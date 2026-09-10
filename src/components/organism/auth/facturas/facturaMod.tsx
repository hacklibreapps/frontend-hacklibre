'use client'

import React, { useEffect, useRef, useState } from 'react'
import { RiAddLine } from 'react-icons/ri'
import PageContainer from '@/components/atom/structures/containers/pageContainer'
import PageTitle from '@/components/atom/auth/structures/pageTitlte'
import PageContent from '@/components/atom/structures/containers/pageContent'
import Formulary from '@/components/molecule/auth/structures/formulary'
import FormContainer from '@/components/molecule/auth/structures/formContainer'
import FormContent from '@/components/molecule/auth/structures/formContent'
import GoBack from '@/components/atom/goback'
import { Button } from '@/components/atom/structures/button'
import { prefix } from '@/services/envs/envs'
import { useAuth } from '@/context/authContext'
import endPoints from '@/services/auth/endPoints/endPoint'
import { ApiPostAuth } from '@/services/auth/axios/apiPostAuth'
import { ApiPatchAuth } from '@/services/auth/axios/apiPatchAuth'
import ResponseFromCreated from '@/utils/responseFromCreated'
import ResponseFromEdited from '@/utils/responseFromEdited'
import { CheckForm } from '@/utils/checkForm'
import ResetForm from '@/utils/resetForm'
import { ToastNotification } from '@/components/atom/structures/toast'
import { FacturaBodyInterface } from '@/interfaces/structures/bodyFormInterface'
import { ApiFecthAuth } from '@/services/auth/axios/apiFetchAuth'
import { UUIDInterface } from '@/interfaces/structures/uuidInterface'
import Select from '@/components/atom/structures/select'
import Input from '@/components/atom/structures/input'
import { useInvoiceCalc } from '@/modules/invoice/useInvoiceCalc'
import { TipoCambioDiaInterface } from '@/interfaces/querys/queryInterface'
import {
  IGV_RATE,
  ItemRow,
  uid,
  parseNum,
  toISODate,
  isoToDMY,
  moneySymbol,
  COMPANIES
} from '@/modules/invoice/utils'
import { BsFiletypeXml } from 'react-icons/bs'
import TextArea from '@/components/atom/structures/textArea'
import { ModalSize } from '@/interfaces/querys/queryInterface'
import { NewProductInQuotation } from '@/components/molecule/auth/quotations/ProductCreateModal'
import { useImportInvoiceXML } from '@/components/molecule/invoices/hooks/useImportInvoiceXML'
import { useInvoiceFormState } from '@/components/molecule/invoices/hooks/useInvoiceFormState'
import { InvoiceItemsFromXML } from '@/components/molecule/invoices/items/invoiceItemsFromXML'
import InvoiceItemsEditable from '@/components/molecule/invoices/items/invoiceItemsEditable'
import { KeyValueInterface } from '@/interfaces/structures/keyValueInterface'
import { useInvoiceCredito } from '@/components/molecule/invoices/hooks/useInvoiceCredito'
// import { InvoiceCreditoUI } from '@/components/molecule/invoices/credito/invoiceCreditoUI'
import { ParsedInvoiceXML } from '@/components/molecule/invoices/xml/types'
import { AxiosError } from 'axios'
import { getCookie } from '@/services/cookies/cookies'

// HELPERS Y FUNCIONES AUXILIARES

type CompanyHeader = {
  legalName: string
  commercialName: string
  address: string
  city: string
  ruc: string
}
type EnterpriseLike = {
  id?: string
  name?: string
  nombreComercial?: string
  razonSocial?: string
  legalName?: string
  direccion?: string
  address?: string
  ciudad?: string
  city?: string
  ruc?: string
}
type InvoiceItemLike = {
  quantity?: number
  cantidad?: number
  unit?: string
  unidad?: string
  code?: string
  codigo?: string
  description?: string
  descripcion?: string
  unit_price?: number
  precio_unitario?: number
}
type InvoiceRetrieveLike = {
  empresa?: string
  enterprise?: string
  invoice_number?: string
  invoice_file?: string
  invoice_type?: string
  emission_date?: string
  due_date?: string
  observation?: string
  money?: 'PEN' | 'USD' | string
  tipo_cambio_dolar?: string | number
  rel_clients?: string
  cliente?: { name?: string; ruc?: string; address?: string }
  senores?: string
  ruc?: string
  direccion?: string
  items?: InvoiceItemLike[]
  detalle?: InvoiceItemLike[]
}

type Cuota = {
  nro: number
  fechaVencimiento: string
  monto: number
}

type Money = 'PEN' | 'USD'

type Props = {
  cuotas: Cuota[]
  money: Money
  locked: boolean
  onChangeFecha?: (nro: number, fecha: string) => void
}

const slug = (s?: string) =>
  (s ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ')

function enterpriseToHeader(e?: EnterpriseLike): CompanyHeader {
  if (!e)
    return { legalName: '', commercialName: '', address: '', city: '', ruc: '' }

  const nameGuess = slug(
    e.nombreComercial || e.name || e.razonSocial || e.legalName
  )
  if (nameGuess.includes('hacklibre')) return { ...COMPANIES.HACKLIBRE }
  if (nameGuess.includes('caparazon') || nameGuess.includes('caparazón'))
    return { ...COMPANIES.CAPARAZON }

  return {
    legalName: e.razonSocial || e.legalName || e.name || '',
    commercialName: e.nombreComercial || e.name || '',
    address: e.direccion || e.address || '',
    city: e.ciudad || e.city || '',
    ruc: e.ruc || ''
  }
}

const FacturaMod: React.FC<UUIDInterface> = ({ uuid }) => {
  const { token, enterprise, enterprises, ready } = useAuth()

  const [submitLoaded, setSubmitLoaded] = useState(false)
  const [, setEmissionDate] = useState<string>('')
  const [money, setMoney] = useState<'PEN' | 'USD'>('PEN')
  const [tipocambio, setTipoCambio] = useState<TipoCambioDiaInterface | null>(
    null
  )
  const [currentInvoiceType, setCurrentInvoiceType] = useState<string>('')
  const [itemsFromXML, setItemsFromXML] = useState(false)
  const [openNewProduct, setOpenNewProduct] = useState<ModalSize | null>(null)

  const { observation, setObservation } = useInvoiceFormState()
  const [tipoDePago, setTipoDePago] = useState<'CONT' | 'CRED'>('CONT')

  const [nroDeCuotas, setNroDeCuotas] = useState<number>(1)
  const [fechaPrimeraCuota, setFechaPrimeraCuota] = useState<string>('')
  const [cuotas, setCuotas] = useState<Cuota[]>([])

  const [isXMLImport, setIsXMLImport] = useState(false)
  const [lockedFromXML, setLockedFromXML] = useState<boolean>(false)

  const [hasDetraccion, setHasDetraccion] = useState(false)
  const [detraccionFromXML, setDetraccionFromXML] = useState(false)

  const [porcentajeDetraccion, setPorcentajeDetraccion] = useState<number>(0)
  const [montoDetraccion, setMontoDetraccion] = useState<number>(0)
  const [cuentaBN, setCuentaBN] = useState('')

  // ************ Busqueda por RUC ****************
  const [loadingCliente, setLoadingCliente] = useState(false)
  const [lastRucSearched, setLastRucSearched] = useState<string>('')

  //************************************************ */
  const isManual = !isXMLImport && !lockedFromXML

  const [unidadMedidaList, setUnidadMedidaList] = useState<KeyValueInterface[]>(
    []
  )
  const [moneyList, setMoneyList] = useState<KeyValueInterface[]>([])

  // const [resetTipoDePago, setResetTipoDePago] = useState(false)

  const [dataEditFormaPago, setDataEditFormaPago] =
    useState<KeyValueInterface>()

  const [dataEditMoneda, setDataEditMoneda] = useState<KeyValueInterface>()
  const [resetMoneda, setResetMoneda] = useState<boolean>(false)

  const [resetFormaPago, setResetFormaPago] = useState<boolean>(false)

  const handlerRestartResetMoneda = () => {
    if (resetMoneda) setResetMoneda(false)
  }

  const handlerRestartResetFormaPago = () => {
    if (resetFormaPago) setResetFormaPago(false)
  }

  const [creditoFromXML, setCreditoFromXML] = useState<
    ParsedInvoiceXML['credito'] | null
  >(null)

  // DETRACCIÓN - LEYENDA
  // opciones (luego vendrán del backend)
  const [leyendasDetraccion, setLeyendasDetraccion] = useState<
    KeyValueInterface[]
  >([])

  // valor para edición / XML import
  const [dataEditLeyendaDetraccion, setDataEditLeyendaDetraccion] =
    useState<KeyValueInterface>()

  // reset del select
  const [resetLeyendasDetraccion, setResetLeyendasDetraccion] =
    useState<boolean>(false)

  const handlerRestartResetLeyendasDetraccion = () => {
    if (resetLeyendasDetraccion) setResetLeyendasDetraccion(false)
  }

  // DETRACCIÓN - BIEN / SERVICIO
  const [bienesServiciosSPOT, setBienesServiciosSPOT] = useState<
    KeyValueInterface[]
  >([])
  const [dataEditBienServicio, setDataEditBienServicio] =
    useState<KeyValueInterface>()

  // DETRACCIÓN - MEDIO DE PAGO
  const [mediosPagoDetraccion, setMediosPagoDetraccion] = useState<
    KeyValueInterface[]
  >([])
  const [dataEditMedioPagoDetraccion, setDataEditMedioPagoDetraccion] =
    useState<KeyValueInterface>()

  const [items, setItems] = useState<ItemRow[]>([
    {
      id: uid(),
      quantity: 1,
      unit: 'UNIDAD',
      code: '',
      description: '',
      unitPrice: 0
    }
  ])

  const [company, setCompany] = useState<CompanyHeader>({
    legalName: '',
    commercialName: '',
    address: '',
    city: '',
    ruc: ''
  })

  const updateCuotaFecha = (nro: number, fecha: string) => {
    setCuotas((prev) =>
      prev.map((c) => (c.nro === nro ? { ...c, fechaVencimiento: fecha } : c))
    )
  }

  const invoiceNumberRef = useRef<HTMLInputElement>(null)
  const invoiceFileRef = useRef<HTMLInputElement>(null)
  const invoiceTypeRef = useRef<HTMLInputElement>(null)

  const emissionDateRef = useRef<HTMLInputElement>(null)
  const dueDateRef = useRef<HTMLInputElement>(null)

  const opGravadaRef = useRef<HTMLInputElement>(null)
  const opInafectaRef = useRef<HTMLInputElement>(null)
  const recargoConsumoRef = useRef<HTMLInputElement>(null)
  const igvRef = useRef<HTMLInputElement>(null)
  const importeTotalRef = useRef<HTMLInputElement>(null)

  const observationRef = useRef<HTMLTextAreaElement>(null)
  const moneyRef = useRef<HTMLInputElement>(null)
  const tipoCambioDolarRef = useRef<HTMLInputElement>(null)
  const relClientsRef = useRef<HTMLInputElement>(null)

  const senoresRef = useRef<HTMLInputElement>(null)
  const rucClienteRef = useRef<HTMLInputElement>(null)
  const direccionClienteRef = useRef<HTMLInputElement>(null)
  const direccionReceptorRef = useRef<HTMLInputElement>(null)
  const tipoDePagoRef = useRef<HTMLInputElement>(null)
  // const nroDeCuotasRef = useRef<HTMLInputElement>(null)

  // ===== REFS para Información de la Detracción =====
  const leyendaDetraccionRef = useRef<HTMLInputElement>(null)
  const bienServicioRef = useRef<HTMLInputElement>(null)
  const medioPagoDetraccionRef = useRef<HTMLInputElement>(null)
  const nroCuentaBNRef = useRef<HTMLInputElement>(null)
  const porcentajeDetraccionRef = useRef<HTMLInputElement>(null)
  const montoDetraccionRef = useRef<HTMLInputElement>(null)

  const CuotasTable: React.FC<Props> = ({
    cuotas,
    money,
    locked,
    onChangeFecha
  }) => (
    <div className='mt-4'>
      <table className='w-full text-xs border border-slate-300'>
        <thead className='bg-slate-200'>
          <tr>
            <th className='border px-2 py-1'>N° Cuota</th>
            <th className='border px-2 py-1'>Fec. Venc.</th>
            <th className='border px-2 py-1 text-right'>Monto</th>
          </tr>
        </thead>
        <tbody>
          {cuotas.map((c) => (
            <tr key={c.nro}>
              <td className='border px-2 py-1 text-center'>{c.nro}</td>
              <td className='border px-2 py-1'>
                {locked ? (
                  c.fechaVencimiento
                ) : (
                  <input
                    type='date'
                    value={c.fechaVencimiento}
                    onChange={(e) => onChangeFecha?.(c.nro, e.target.value)}
                    className='w-full border rounded px-1 h-8'
                  />
                )}
              </td>
              <td className='border px-2 py-1 text-right'>
                {moneySymbol(money)} {c.monto.toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )

  useEffect(() => {
    const now = new Date()
    const d = String(now.getDate()).padStart(2, '0')
    const m = String(now.getMonth() + 1).padStart(2, '0')
    const y = now.getFullYear()
    setEmissionDate(`${d}/${m}/${y}`)
    if (emissionDateRef.current) emissionDateRef.current.value = toISODate(now)
    if (dueDateRef.current) dueDateRef.current.value = toISODate(now)
  }, [])

  useEffect(() => {
    const list = Array.isArray(enterprises) ? enterprises : []
    const selected = list.find((x) => x.uuid === enterprise)
    const companyData = enterpriseToHeader(selected)
    setCompany(companyData)
  }, [enterprise, enterprises])

  useEffect(() => {
    const updateInvoiceType = () => {
      const value = getCookie('currentInvoiceType')
      if (value) {
        setCurrentInvoiceType(value)
      }
    }
    updateInvoiceType()
    window.addEventListener('cookieUpdated', updateInvoiceType)

    return () => {
      window.removeEventListener('cookieUpdated', updateInvoiceType)
    }
  }, [])

  const calc = useInvoiceCalc(
    items,
    money,
    tipocambio ? tipocambio.venta : 1,
    IGV_RATE
  )

  const {
    credito: creditoCalculado,
    // updateCuotaFecha,
    setCredito
  } = useInvoiceCredito({
    enabled: tipoDePago === 'CRED',
    total: calc.total,
    nroCuotas: nroDeCuotas
  })

  const creditoFinal = creditoFromXML ?? creditoCalculado

  useEffect(() => {
    if (creditoFromXML && setCredito) {
      setCredito(creditoFromXML)
    }
  }, [creditoFromXML, setCredito])

  useEffect(() => {
    if (opGravadaRef.current) opGravadaRef.current.value = String(calc.base)
    if (igvRef.current) igvRef.current.value = String(calc.igv)
    if (importeTotalRef.current)
      importeTotalRef.current.value = String(calc.total)
    if (opInafectaRef.current) opInafectaRef.current.value = '0.00'
    if (recargoConsumoRef.current) recargoConsumoRef.current.value = '0.00'
  }, [calc])

  useEffect(() => {
    const fetchData = async () => {
      if (!ready || !token || !enterprise) return
      try {
        const data = await getData(uuid, token)
        const factura = data.props.factura as InvoiceRetrieveLike | null
        const tipocambioRes = data.props.tipocambio
        if (factura) {
          // Mapear si se necesita
        }
        if (tipocambioRes) setTipoCambio(tipocambioRes)
      } catch (error) {
        ToastNotification('danger', `Ha ocurrido un error - ${error}`)
      }
    }
    if (uuid && token) fetchData()
  }, [uuid, token, enterprise, ready])

  useEffect(() => {
    const fetchUnidadMedida = async () => {
      if (!token) return

      try {
        const res = await ApiFecthAuth(
          endPoints.mainData.unidadMedida.noPaged,
          token
        )

        setUnidadMedidaList(res?.data || [])
      } catch (error) {
        console.error('Error cargando unidad de medida', error)
        ToastNotification('danger', 'Error cargando unidades de medida')
      }
    }

    fetchUnidadMedida()
  }, [token])

  useEffect(() => {
    const fetchMoney = async () => {
      if (!token) return

      try {
        const res = await ApiFecthAuth(endPoints.mainData.money.noPaged, token)

        setMoneyList(res?.data || [])
      } catch (error) {
        console.error('Error cargando monedas', error)
        ToastNotification('danger', 'Error cargando tipos de moneda')
      }
    }

    fetchMoney()
  }, [token])

  useEffect(() => {
    const loadCatalogosDetraccion = async () => {
      try {
        const res = await fetch('/api/catalogos/detraccion')
        const data = await res.json()

        setLeyendasDetraccion(data.leyendas)
        setBienesServiciosSPOT(data.bienesServicios)
        setMediosPagoDetraccion(data.mediosPago)
      } catch (error) {
        console.error('Error cargando catálogos de detracción', error)
      }
    }

    loadCatalogosDetraccion()
  }, [])

  useEffect(() => {
    const fetchTipoCambio = async () => {
      try {
        if (!token) return
        const tm = await ApiFecthAuth(
          endPoints.mainData.exchange.latest,
          token as string
        )
        setTipoCambio(tm?.data || null)
      } catch {
        ToastNotification('danger', 'Error cargando tipo de cambio')
      }
    }
    if (!uuid) fetchTipoCambio()
  }, [token, uuid])

  function generarCuotas(
    total: number,
    cantidad: number,
    fechaInicio: string
  ): Cuota[] {
    if (!fechaInicio || cantidad < 1) return []

    const base = Number((total / cantidad).toFixed(2))
    const diferencia = Number((total - base * cantidad).toFixed(2))

    return Array.from({ length: cantidad }).map((_, i) => {
      const fecha = new Date(fechaInicio)
      fecha.setMonth(fecha.getMonth() + i)

      return {
        nro: i + 1,
        fechaVencimiento: fecha.toISOString().slice(0, 10),
        monto: i === cantidad - 1 ? base + diferencia : base
      }
    })
  }

  useEffect(() => {
    if (tipoDePago !== 'CRED') {
      setCuotas([])
      return
    }

    if (!fechaPrimeraCuota || nroDeCuotas < 1) return

    setCuotas(
      generarCuotas(
        calc.total, // Importe Total de la factura
        nroDeCuotas,
        fechaPrimeraCuota
      )
    )
  }, [tipoDePago, nroDeCuotas, fechaPrimeraCuota, calc.total])

  // Recalcula el monto cada vez que cambie el total o el porcentaje
  useEffect(() => {
    const monto = Math.round(calc.total * (porcentajeDetraccion / 100))
    setMontoDetraccion(monto)
  }, [calc.total, porcentajeDetraccion])

  useEffect(() => {
    if (tipocambio && tipoCambioDolarRef.current) {
      tipoCambioDolarRef.current.value = tipocambio.venta?.toString() ?? ''
    }
  }, [tipocambio])

  // IMPORTACIÓN XML (HOOK)
  const { importXML, loading: loadingImportXML } = useImportInvoiceXML({
    // refs
    refs: {
      invoiceNumberRef,
      emissionDateRef,
      senoresRef,
      rucClienteRef,
      direccionClienteRef,
      opGravadaRef,
      igvRef,
      importeTotalRef,
      observationRef,
      porcentajeDetraccionRef,
      montoDetraccionRef,
      nroCuentaBNRef
    },

    // items
    setItems,
    setItemsFromXML,

    // moneda
    setMoney,
    setDataEditMoneda,
    setResetMoneda,

    // observación
    setObservation,

    // detracción
    setHasDetraccion,
    setDetraccionFromXML,
    setDataEditLeyendaDetraccion,
    setDataEditBienServicio,
    setDataEditMedioPagoDetraccion,
    setPorcentajeDetraccion,
    setMontoDetraccion,
    setCuentaBN,

    // forma de pago
    setTipoDePago,
    setNroDeCuotas,
    setCreditoFromXML,
    setDataEditFormaPago,

    // flags
    setLockedFromXML,
    setIsXMLImport,

    onSuccess: (tipoDocumento) => {
      ToastNotification(
        'success',
        `✅ ${tipoDocumento} importada correctamente desde XML.`
      )
    },

    onError: () => {
      ToastNotification('danger', '⚠️ Error al procesar el archivo XML.')
    }
  })

  // Crear función buscarClientePorRuc
  const buscarClientePorRuc = async (ruc: string) => {
    if (!token) return
    if (ruc.length !== 11) return
    if (ruc === lastRucSearched) return

    try {
      setLoadingCliente(true)
      setLastRucSearched(ruc)

      const response = await ApiFecthAuth(endPoints.clients.byRuc(ruc), token)

      console.log('RESPONSE COMPLETA:', response)
      console.log('DATA:', response?.data)

      const cliente = response?.data

      if (cliente) {
        if (senoresRef.current)
          senoresRef.current.value = cliente.completeCompanyName ?? ''

        if (direccionClienteRef.current)
          direccionClienteRef.current.value = cliente.address ?? ''

        if (relClientsRef.current)
          relClientsRef.current.value = cliente.uuid ?? ''

        ToastNotification('success', 'Cliente encontrado.')
      }
    } catch (error: unknown) {
      const axiosError = error as AxiosError

      if (axiosError.response?.status === 404) {
        if (senoresRef.current) senoresRef.current.value = ''
        if (direccionClienteRef.current) direccionClienteRef.current.value = ''

        ToastNotification(
          'warning',
          'Cliente no registrado. Puede ingresarlo manualmente.'
        )
      } else {
        ToastNotification('danger', 'Error buscando cliente.')
      }
    } finally {
      setLoadingCliente(false)
    }
  }

  const formData = {
    invoiceNumber: {
      name: 'invoice_number',
      id: 'invoice_number',
      showLabel: true,
      label: 'Nro. de factura',
      ref: invoiceNumberRef,
      required: true,
      tiny: true,
      placeHolder: 'E001-000001',
      inputMode: 'text',
      readOnly: lockedFromXML
    },
    dueDate: {
      name: 'due_date',
      id: 'due_date',
      showLabel: false,
      label: 'Fecha de vencimiento',
      ref: dueDateRef,
      required: true,
      type: 'date',
      readOnly: lockedFromXML,
      tiny: true
    },
    emissionDate: {
      name: 'emission_date',
      id: 'emission_date',
      showLabel: false,
      label: 'Fecha de emisión',
      ref: emissionDateRef,
      required: true,
      type: 'date',
      readOnly: lockedFromXML,
      tiny: true,
      defaultValue: toISODate(new Date()),
      onChange: (val: string) => {
        if (dueDateRef.current) dueDateRef.current.min = val
      }
    },
    senores: {
      name: 'senores',
      id: 'senores',
      showLabel: false,
      label: 'Señor(es)',
      ref: senoresRef,
      required: true,
      readOnly: lockedFromXML,
      tiny: true,
      placeHolder: 'NOMBRE O RAZÓN SOCIAL'
    },
    rucCliente: {
      name: 'ruc_cliente',
      id: 'ruc_cliente',
      showLabel: false,
      label: 'RUC',
      ref: rucClienteRef,
      required: true,
      readOnly: lockedFromXML,
      tiny: true,
      placeHolder: '###########',
      inputMode: 'numeric',
      onChange: (val: string) => {
        const clean = val.replace(/\D/g, '') // solo números

        if (rucClienteRef.current) rucClienteRef.current.value = clean

        if (clean.length === 11) {
          buscarClientePorRuc(clean)
        }
      }
    },
    direccionCliente: {
      name: 'direccion_cliente',
      id: 'direccion_cliente',
      showLabel: false,
      label: 'Dirección del Cliente',
      ref: direccionClienteRef,
      required: true,
      readOnly: lockedFromXML,
      tiny: true,
      placeHolder: 'AV. / JR. / KM. ...'
    },
    //AGREGAR NUEVO -- VERIFICAR SI VA O SE ELIMINA POR AHORA LO DEJAMOS(direccionReceptor)
    // direccionReceptor: {
    //   name: 'direccion_receptor',
    //   id: 'direccion_receptor',
    //   showLabel: false,
    //   label: 'Dirección del Receptor de la factura',
    //   ref: direccionReceptorRef,
    //   required: true,
    //   tiny: true,
    //   placeHolder: 'AV. / JR. / KM. ...'
    // },
    tipoCambioDolar: {
      name: 'tipo_cambio',
      id: 'tipo_cambio',
      showLabel: false,
      label: 'Tipo de Cambio (PEN/USD)',
      ref: tipoCambioDolarRef,
      value: tipocambio?.venta,
      required: true,
      tiny: true,
      readOnly: true
    },
    money: {
      name: 'money',
      id: 'money',
      label: 'Tipo de Moneda',
      showLabel: false,
      ref: moneyRef,
      required: true,
      readOnly: lockedFromXML,
      // disabled: loadingImportXML,  // revisar ???
      tiny: true,
      data: moneyList,
      editData: dataEditMoneda,
      resetSignal: resetMoneda,
      resetHandler: handlerRestartResetMoneda,
      // value: moneyList,
      onChange: (key: string) => {
        setMoney(key as 'PEN' | 'USD')
      }
    },
    observation: {
      name: 'observation',
      id: 'observation',
      showLabel: false,
      label: 'Observación',
      ref: observationRef,
      required: false,
      readOnly: lockedFromXML,
      row: 2,
      minLen: 1,
      maxLen: 10000,
      tiny: true,
      value: observation,
      onChange: (val: string) => setObservation(val)
    },
    tipoDePago: {
      name: 'tipo_de_pago',
      id: 'tipo_de_pago',
      label: 'Tipo de Pago',
      showLabel: false,
      ref: tipoDePagoRef,
      readOnly: lockedFromXML,
      // disabled: loadingImportXML, // revisar ???
      tiny: true,
      data: [
        { key: 'CONT', value: 'Al contado' },
        { key: 'CRED', value: 'Crédito' }
      ],
      editData: dataEditFormaPago,
      resetSignal: resetFormaPago,
      resetHandler: handlerRestartResetFormaPago,
      noDeleteOption: true,
      onChange: (key: string) => {
        if (key === 'CONT') setTipoDePago('CONT')
        if (key === 'CRED') setTipoDePago('CRED')
      }
    },

    // nroDeCuotas: {
    //   name: 'nro_de_cuotas',
    //   id: 'nro_de_cuotas',
    //   label: 'Número de Cuotas',
    //   showLabel: false,
    //   ref: nroDeCuotasRef,
    //   required: true,
    //   type: 'number',
    //   min: 1,
    //   value: nroDeCuotas,
    //   hidden: tipoDePago !== 'CREDITO',
    //   onChange: (key: string) => setNroDeCuotas(Number(key))
    // },
    // addCuotas: {
    //   name: 'add_cuotas',
    //   id: 'add_cuotas',
    //   label: 'Agregar Cuotas',
    //   showLabel: false,
    //   type: 'button',
    //   disabled: false,
    //   loaded: false,
    //   tiny: true,
    //   // onClick: () => {},
    //   buttonName: 'Agregar Cuotas'
    // },

    // === DETRACCIÓN ===
    leyendaDetraccion: {
      name: 'leyenda_detraccion',
      id: 'leyenda_detraccion',
      label: 'Leyenda',
      showLabel: false,
      ref: leyendaDetraccionRef,
      data: leyendasDetraccion,
      tiny: true,
      readOnly: lockedFromXML,
      // disabled: loadingImportXML, // revisar ???
      editData: dataEditLeyendaDetraccion,
      resetSignal: resetLeyendasDetraccion,
      resetHandler: handlerRestartResetLeyendasDetraccion,
      noDeleteOption: true
    },
    bienServicio: {
      name: 'bien_servicio',
      id: 'bien_servicio',
      label: 'Bien o Servicio',
      showLabel: false,
      ref: bienServicioRef,
      data: bienesServiciosSPOT,
      tiny: true,
      readOnly: lockedFromXML,
      // disabled: loadingImportXML, // revisar ???
      editData: dataEditBienServicio,
      noDeleteOption: true
    },
    medioPagoDetraccion: {
      name: 'medio_pago_detraccion',
      id: 'medio_pago_detraccion',
      label: 'Medio de Pago',
      showLabel: false,
      ref: medioPagoDetraccionRef,
      data: mediosPagoDetraccion,
      readOnly: lockedFromXML,
      // disabled: loadingImportXML, // revisar ???
      tiny: true,
      editData: dataEditMedioPagoDetraccion,
      noDeleteOption: true
    },
    nroCuentaBN: {
      name: 'nro_cta_bn',
      id: 'nro_cta_bn',
      label: 'N° Cta. Banco Nación',
      showLabel: false,
      readOnly: lockedFromXML,
      // disabled: loadingImportXML, // revisar ???
      tiny: true,
      value: cuentaBN,
      ref: nroCuentaBNRef,
      placeHolder: '00030096967'
    },
    porcentajeDetraccion: {
      name: 'porcentaje_detraccion',
      id: 'porcentaje_detraccion',
      label: 'Porcentaje de detracción',
      showLabel: false,
      tiny: true,
      ref: porcentajeDetraccionRef,
      readOnly: lockedFromXML,
      // disabled: loadingImportXML, // revisar ???
      type: 'number',
      min: 0,
      step: '0.01',
      placeHolder: '12.00',
      value: porcentajeDetraccion,
      onChange: (val: string) => {
        setPorcentajeDetraccion(parseFloat(val) || 0)
      }
    },
    montoDetraccion: {
      name: 'monto_detraccion',
      id: 'monto_detraccion',
      label: 'Monto de detracción',
      showLabel: false,
      tiny: true,
      ref: montoDetraccionRef,
      type: 'number',
      min: 0,
      step: '1',
      value: montoDetraccion.toFixed(2),
      readOnly: true
    },

    opGravada: {
      name: 'op_gravada',
      id: 'op_gravada',
      label: 'OP Gravada',
      showLabel: false,
      ref: opGravadaRef,
      required: true,
      type: 'hidden',
      tiny: true
    },
    opInafecta: {
      name: 'op_inafecta',
      id: 'op_inafecta',
      label: 'OP Inafecta',
      showLabel: false,
      ref: opInafectaRef,
      required: true,
      type: 'hidden',
      tiny: true
    },
    recargoConsumo: {
      name: 'recargo_consumo',
      id: 'recargo_consumo',
      label: 'Recargo Consumo',
      showLabel: false,
      ref: recargoConsumoRef,
      required: true,
      type: 'hidden',
      tiny: true
    },
    igv: {
      name: 'igv',
      id: 'igv',
      label: 'IGV',
      showLabel: false,
      ref: igvRef,
      required: true,
      type: 'hidden',
      tiny: true
    },
    importeTotal: {
      name: 'importe_total',
      id: 'importe_total',
      label: 'Importe Total',
      showLabel: false,
      ref: importeTotalRef,
      required: true,
      type: 'hidden',
      tiny: true
    },
    submit: {
      name: 'submit',
      id: 'submit',
      label: 'submit',
      showLabel: false,
      type: 'submit',
      buttonName: `${uuid ? 'Guardar' : 'Registrar'}`,
      disabled: submitLoaded,
      loaded: submitLoaded,
      tiny: true
    }
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const fields = [
      { ref: invoiceNumberRef, message: 'Debe ingresar el número de factura' },
      { ref: senoresRef, message: 'Debe ingresar Señor(es)' },
      { ref: rucClienteRef, message: 'Debe ingresar el RUC del cliente' },
      // {
      //   ref: direccionClienteRef,
      //   message: 'Debe ingresar la dirección del cliente'
      // },
      // {
      //   ref: direccionReceptorRef,
      //   message: 'Debe ingresar la dirección del Receptor'
      // },
      {
        ref: tipoCambioDolarRef,
        message: 'Debe ingresar el tipo de cambio del día'
      }
    ]

    if (!CheckForm(fields)) return
    if (!token) {
      ToastNotification('danger', 'No hay sesión activa.')
      return
    }

    const resetFields = [
      {
        refs: [
          invoiceNumberRef,
          invoiceFileRef,
          invoiceTypeRef,
          emissionDateRef,
          opGravadaRef,
          opInafectaRef,
          recargoConsumoRef,
          igvRef,
          importeTotalRef,
          observationRef,
          moneyRef,
          tipoCambioDolarRef,
          relClientsRef,
          senoresRef,
          rucClienteRef,
          direccionClienteRef,
          direccionReceptorRef
        ],
        // resetValues: Array(15).fill('')
        resetValues: []
      }
    ]
    const resetAllFields = ResetForm({ resetFields })
    const handlerResetfield = async () => {
      resetAllFields()
      setResetFormaPago(true)
      setResetMoneda(true)
      setItems([
        {
          id: uid(),
          quantity: 1,
          unit: 'UNIDAD',
          code: '',
          description: '',
          unitPrice: 0
        }
      ])
      const now = new Date()
      if (emissionDateRef.current)
        emissionDateRef.current.value = toISODate(now)
      setEmissionDate(
        `${String(now.getDate()).padStart(2, '0')}/${String(
          now.getMonth() + 1
        ).padStart(2, '0')}/${now.getFullYear()}`
      )
    }
    const [serie, correlativo] =
      invoiceNumberRef.current?.value.split('-') ?? []

    console.log(creditoFinal)

    const body: FacturaBodyInterface & {
      items?: Array<{
        description: string
        quantity: number
        unit_price: number
      }>
      emission_date_display?: string
    } = {
      invoice_serial_nr: serie ?? '',
      invoice_correlative_nr: correlativo ?? '',
      emition_date: emissionDateRef.current?.value
        ? isoToDMY(emissionDateRef.current.value)
        : null,
      rel_clients: rucClienteRef.current?.value ?? '',
      address_clients: direccionClienteRef.current?.value ?? '',
      // invoice_file: invoiceFileRef.current?.value ?? '',
      invoice_type: currentInvoiceType,
      payment_type: tipoDePago,
      has_delivery_address: false,
      money: money,
      exchange_rate: tipoCambioDolarRef.current?.value ?? String(tipocambio),
      cantidad_cuotas: nroDeCuotas,
      // ACA ME QUEDE alem
      credito: tipoDePago === 'CRED' ? creditoFinal : null,

      op_gravada: String(calc.base),
      op_inafecta: '0.00',
      recargo_consumo: '0.00',
      igv: String(calc.igv),
      igv_rate: IGV_RATE.toFixed(2),
      importe_total: String(calc.total),

      // === Información de la detracción ===
      leyenda_detraccion: dataEditLeyendaDetraccion
        ? String(dataEditLeyendaDetraccion.key)
        : '',

      bien_servicio: dataEditBienServicio
        ? String(dataEditBienServicio.key)
        : '',

      medio_pago_detraccion: dataEditMedioPagoDetraccion
        ? String(dataEditMedioPagoDetraccion.key)
        : '',

      nro_cta_bn: nroCuentaBNRef.current?.value ?? '',
      porcentaje_detraccion: porcentajeDetraccionRef.current?.value ?? '0.00',
      monto_detraccion: String(
        Math.round(parseFloat(montoDetraccionRef.current?.value || '0'))
      ),

      total_neto_pagar: String(
        calc.total -
          Math.round(parseFloat(montoDetraccionRef.current?.value || '0'))
      ),

      due_date: dueDateRef.current?.value
        ? isoToDMY(dueDateRef.current.value)
        : null,

      observation: observationRef.current?.value ?? '',
      // ser elejido desde el endpoint(tiene que ser el tipo de cambio de la factura inportada)

      status: true, //se define en back

      items: items.map((it) => ({
        description: it.description,
        quantity: it.quantity,
        unit_price: it.unitPrice
      }))

      //agregar campo de adjuntar archivo(se adjuntara la factura)
    }
    console.log(body)

    const endPoint = uuid
      ? endPoints.invoices.patch(uuid)
      : endPoints.invoices.create

    try {
      setSubmitLoaded(true)
      if (uuid) {
        const response = await ApiPatchAuth(endPoint, token, body)
        ResponseFromEdited({ response, returnSuccess: `/facturas?t=s&m=edit` })
      } else {
        const response = await ApiPostAuth(endPoint, token, body)
        ResponseFromCreated({
          response,
          successMessage: 'Factura registrada SATISFACTORIAMENTE.',
          handlerResetfield
        })
      }
    } catch (err) {
      console.error('[FACTURA] submit error:', err)
      ToastNotification('danger', 'No se pudo procesar la factura.')
    } finally {
      setSubmitLoaded(false)
    }
  }

  return (
    <PageContainer className='w-full' styleInside={{ padding: '0px' }}>
      {/* Encabezado superior */}
      <div className='flex items-center justify-between w-full mb-2 '>
        {/*Título a la izquierda */}
        <div className='w-full flex justify-start px-4'>
          <PageTitle
            description={
              uuid
                ? 'Editar factura electrónica'
                : 'Registrar factura electrónica'
            }
          />
        </div>
        {/* Botón Importar XML */}
        <div className='w-full flex justify-end p-3'>
          <label
            htmlFor='xmlInput'
            className={`flex items-center gap-2 px-3 py-2 text-xs font-semibold border rounded-md cursor-pointer transition
  ${
    loadingImportXML
      ? 'bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed'
      : 'bg-cyan-50 text-cyan-700 border-cyan-300 hover:bg-cyan-100'
  }`}
          >
            <BsFiletypeXml size={18} />
            {loadingImportXML ? 'Importando...' : 'Importar XML'}
          </label>

          {/* Input oculto para subir archivo XML */}
          <input
            id='xmlInput'
            type='file'
            accept='.xml'
            className='hidden'
            onChange={importXML}
            disabled={loadingImportXML}
          />
        </div>
      </div>

      <GoBack enlace={`${prefix}/facturas/`} />

      <PageContent className='w-full' styleInside={{ padding: '0px' }}>
        <Formulary onSubmit={onSubmit}>
          {tipoDePago}
          <FormContainer>
            <FormContent className='w-full'>
              <div className='w-full overflow-hidden bg-white lg:rounded-lg lg:border lg:border-slate-400 max-w-none mx-0 px-4 sm:px-6 md:px-8 lg:px-10'>
                {/* ==== ENCABEZADO DE LA FACTURA ==== */}

                <div className='grid grid-cols-1 md:grid-cols-12 items-center rounded-t bg-white'>
                  {/* Bloque de empresa */}
                  <div className='col-span-12 md:col-span-8 p-4 text-center md:text-start flex flex-col justify-center'>
                    <div className='font-extrabold text-2xl sm:text-[1.6rem] uppercase leading-tight'>
                      {company.legalName}
                    </div>
                    <div className='font-bold text-lg sm:text-xl leading-snug'>
                      {company.commercialName}
                    </div>
                    <div className='text-sm sm:text-base mt-1 leading-snug'>
                      {company.address}
                    </div>
                    <div className='text-sm sm:text-base leading-snug'>
                      {company.city}
                    </div>
                  </div>

                  {/* Bloque de FACTURA ELECTRÓNICA */}
                  <div className='col-span-12 md:col-span-4 p-4 flex justify-center md:justify-end items-start md:items-center'>
                    <div
                      className='border-2 border-slate-400 px-4 py-2 text-center rounded-md
                                  w-10/12 sm:w-9/12 md:w-10/12 lg:w-11/12 xl:w-10/12 2xl:w-9/12
                                  mt-4 md:mt-0 lg:mt-4 xl:mt-6 max-w-[420px] transition-all duration-300'
                    >
                      <div className='font-bold text-base uppercase leading-tight tracking-wide'>
                        FACTURA ELECTRÓNICA
                      </div>
                      <div className='text-xs mt-1 leading-tight font-medium tracking-normal'>
                        RUC: {company.ruc}
                      </div>
                      <div className='mt-2 font-semibold text-xs tracking-wide'>
                        <Input data={formData.invoiceNumber} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* SEPARADOR */}
                <div className='w-full h-1 bg-slate-300' />

                {/* DATOS */}
                <div className='p-6 space-y-2'>
                  <div className='flex flex-col md:flex-row md:items-center md:gap-3 xl:gap-6'>
                    <div className='w-full md:w-4/12 lg:w-3/12 h-10 flex items-center text-left whitespace-nowrap'>
                      {formData.dueDate.label}
                    </div>
                    <div className='w-full md:w-8/12 lg:w-5/12 md:max-w-[280px]'>
                      <Input data={formData.dueDate} />
                    </div>
                  </div>

                  <div className='flex flex-col md:flex-row md:items-center md:gap-3 xl:gap-6'>
                    <div className='w-full md:w-4/12 lg:w-3/12 h-10 flex items-center text-left whitespace-nowrap'>
                      {formData.emissionDate.label}
                    </div>
                    <div className='w-full md:w-8/12 lg:w-5/12 md:max-w-[280px] flex items-center gap-2'>
                      <Input data={formData.emissionDate} />
                    </div>
                  </div>

                  <div className='flex flex-col md:flex-row md:items-center md:gap-3 xl:gap-6'>
                    <div className='w-full md:w-4/12 lg:w-3/12 h-10 flex items-center text-left whitespace-nowrap'>
                      {formData.senores.label}
                    </div>
                    <div className='w-full md:w-8/12 lg:w-5/12 md:max-w-[400px]'>
                      <Input data={formData.senores} />
                    </div>
                  </div>

                  <div className='flex flex-col md:flex-row md:items-center md:gap-3 xl:gap-6'>
                    <div className='w-full md:w-4/12 lg:w-3/12 h-10 flex items-center text-left whitespace-nowrap'>
                      {formData.rucCliente.label}
                    </div>
                    <div className='w-full md:w-8/12 lg:w-5/12 md:max-w-[260px]'>
                      <Input data={formData.rucCliente} />

                      {loadingCliente && (
                        <p className='text-xs text-slate-500 mt-1'>
                          Buscando cliente...
                        </p>
                      )}
                    </div>
                  </div>

                  <div className='flex flex-col md:flex-row md:items-center md:gap-3 xl:gap-6'>
                    <div className='w-full md:w-4/12 lg:w-3/12 h-10 flex items-center text-left whitespace-nowrap'>
                      {formData.direccionCliente.label}
                    </div>
                    <div className='w-full md:w-8/12 lg:w-5/12 md:max-w-[560px]'>
                      <Input data={formData.direccionCliente} />
                    </div>
                  </div>
                  {/* <div className='flex flex-col md:flex-row md:items-center md:gap-3 xl:gap-6'>
                    <div className='w-full md:w-4/12 lg:w-3/12 h-10 flex items-center text-left whitespace-nowrap'>
                      {formData.direccionReceptor.label}
                    </div>
                    <div className='w-full md:w-8/12 lg:w-5/12 md:max-w-[560px]'>
                      <Input data={formData.direccionReceptor} />
                    </div>
                  </div> */}

                  <div className='flex flex-col md:flex-row md:items-center md:gap-3 xl:gap-6'>
                    <div className='w-full md:w-4/12 lg:w-3/12 h-10 flex items-center text-left whitespace-nowrap'>
                      {formData.tipoCambioDolar.label}
                    </div>
                    <div className='w-full md:w-8/12 lg:w-5/12 md:max-w-[200px]'>
                      <Input data={formData.tipoCambioDolar} />
                    </div>
                  </div>

                  <div className='flex flex-col md:flex-row md:items-center md:gap-3 xl:gap-6'>
                    <div className='w-full md:w-4/12 lg:w-3/12 h-10 flex items-center text-left whitespace-nowrap'>
                      {formData.money.label}
                    </div>
                    <div className='w-full md:w-8/12 lg:w-5/12 md:max-w-[260px]'>
                      <Select data={formData.money} />
                    </div>
                  </div>

                  <div className='flex flex-col md:flex-row md:items-center md:gap-3 xl:gap-6'>
                    <div className='w-full md:w-4/12 lg:w-3/12 h-10 flex items-center text-left whitespace-nowrap'>
                      {formData.observation.label}
                    </div>
                    <div className='w-full md:w-8/12 lg:w-5/12 md:max-w-[560px]'>
                      <TextArea data={formData.observation} />
                    </div>
                  </div>

                  <div className='flex flex-col md:flex-row md:items-center md:gap-3 xl:gap-6'>
                    <div className='w-full md:w-4/12 lg:w-3/12 h-10 flex items-center text-left whitespace-nowrap'>
                      {formData.tipoDePago.label}
                    </div>
                    <div className='w-full md:w-8/12 lg:w-5/12 md:max-w-[560px]'>
                      <Select data={formData.tipoDePago} />
                    </div>
                  </div>

                  {/* BLOQUE CORRECTO (NO borrar) */}
                  {/* ====== SOLO FACTURA MANUAL ====== */}
                  {tipoDePago === 'CRED' &&
                    !isXMLImport &&
                    !creditoFromXML && (
                      <>
                        <div className='mt-4 border border-slate-300 rounded-md p-4 bg-slate-50'>
                          <h4 className='font-semibold text-sm mb-3'>
                            Crédito / Cuotas
                          </h4>

                          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                            <div>
                              <label className='text-sm font-medium'>
                                Cantidad de cuotas
                              </label>
                              <input
                                type='number'
                                min={1}
                                value={nroDeCuotas}
                                onChange={(e) =>
                                  setNroDeCuotas(Number(e.target.value) || 1)
                                }
                                className='w-full border rounded px-2 h-9'
                              />
                            </div>

                            <div>
                              <label className='text-sm font-medium'>
                                Fecha de vencimiento (1ra cuota)
                              </label>
                              <input
                                type='date'
                                value={fechaPrimeraCuota}
                                onChange={(e) =>
                                  setFechaPrimeraCuota(e.target.value)
                                }
                                className='w-full border rounded px-2 h-9'
                              />
                            </div>
                          </div>
                        </div>

                        {cuotas.length > 0 && (
                          <CuotasTable
                            cuotas={cuotas}
                            money={money}
                            locked={false}
                            onChangeFecha={updateCuotaFecha}
                          />
                        )}
                      </>
                    )}
                </div>
                {/* BLOQUE CORRECTO FIN (NO borrar) */}

                {/* SEPARADOR */}
                <div className='w-full h-1 bg-slate-300' />

                {/* =====================
                    ÍTEMS DE FACTURA
                ===================== */}

                {itemsFromXML ? (
                  <InvoiceItemsFromXML
                    items={items}
                    currency={money}
                    onEnableEdit={() => setItemsFromXML(false)}
                  />
                ) : (
                  <InvoiceItemsEditable
                    items={items}
                    setItems={setItems}
                    currency={money}
                    unidadMedidaList={unidadMedidaList}
                    locked={itemsFromXML}
                  />
                )}

                {/* TABLA ÍTEMS */}
                {/* 📱 Vista móvil (tarjetas verticales con botón fijo al final) */}
                <div className='block md:hidden space-y-4 relative'>
                  {items.map((it, index) => (
                    <div
                      key={it.id}
                      className='border border-slate-300 rounded-lg p-3 bg-white shadow-sm space-y-2'
                    >
                      <div className='flex justify-between items-center mb-1'>
                        <h4 className='font-semibold text-slate-700'>
                          Ítem {index + 1}
                        </h4>
                        <button
                          type='button'
                          onClick={() =>
                            setItems((prev) =>
                              prev.filter((r) => r.id !== it.id)
                            )
                          }
                          className='h-6 w-6 flex items-center justify-center border border-rose-400 text-rose-600 rounded hover:bg-rose-50'
                          title='Eliminar ítem'
                        >
                          ✕
                        </button>
                      </div>

                      <div className='grid grid-cols-1 gap-2 text-sm'>
                        <div>
                          <label className='block text-slate-600 font-medium'>
                            Cantidad
                          </label>
                          <input
                            type='number'
                            min={0}
                            step='any'
                            className='w-full border border-slate-300 rounded px-2 h-9 text-right'
                            value={it.quantity}
                            onFocus={(e) => {
                              if (!e.target.dataset.cleared) {
                                e.target.value = ''
                                e.target.dataset.cleared = 'true'
                              }
                            }}
                            onChange={(e) =>
                              setItems((prev) =>
                                prev.map((r) =>
                                  r.id === it.id
                                    ? {
                                        ...r,
                                        quantity: parseNum(e.target.value)
                                      }
                                    : r
                                )
                              )
                            }
                          />
                        </div>

                        <div>
                          <label className='block text-slate-600 font-medium'>
                            Unidad
                          </label>
                          <input
                            className='w-full border border-slate-300 rounded px-2 h-9 text-center'
                            value={it.unit}
                            onFocus={(e) => {
                              if (!e.target.dataset.cleared) {
                                e.target.value = ''
                                e.target.dataset.cleared = 'true'
                              }
                            }}
                            onChange={(e) =>
                              setItems((prev) =>
                                prev.map((r) =>
                                  r.id === it.id
                                    ? { ...r, unit: e.target.value }
                                    : r
                                )
                              )
                            }
                          />
                        </div>

                        <div>
                          <label className='block text-slate-600 font-medium'>
                            Código
                          </label>
                          <input
                            className='w-full border border-slate-300 rounded px-2 h-9 text-center'
                            value={it.code}
                            onFocus={(e) => {
                              if (!e.target.dataset.cleared) {
                                e.target.value = ''
                                e.target.dataset.cleared = 'true'
                              }
                            }}
                            onChange={(e) =>
                              setItems((prev) =>
                                prev.map((r) =>
                                  r.id === it.id
                                    ? { ...r, code: e.target.value }
                                    : r
                                )
                              )
                            }
                          />
                        </div>

                        <div>
                          <label className='block text-slate-600 font-medium'>
                            Descripción
                          </label>
                          <input
                            className='w-full border border-slate-300 rounded px-2 h-9'
                            value={it.description}
                            placeholder='Detalle del servicio / producto'
                            onFocus={(e) => {
                              if (!e.target.dataset.cleared) {
                                e.target.value = ''
                                e.target.dataset.cleared = 'true'
                              }
                            }}
                            onChange={(e) =>
                              setItems((prev) =>
                                prev.map((r) =>
                                  r.id === it.id
                                    ? { ...r, description: e.target.value }
                                    : r
                                )
                              )
                            }
                          />
                        </div>

                        <div>
                          <label className='block text-slate-600 font-medium'>
                            Valor unitario
                          </label>
                          <input
                            type='number'
                            min={0}
                            step='any'
                            className='w-full border border-slate-300 rounded px-2 h-9 text-right'
                            value={it.unitPrice}
                            onFocus={(e) => {
                              if (!e.target.dataset.cleared) {
                                e.target.value = ''
                                e.target.dataset.cleared = 'true'
                              }
                            }}
                            onChange={(e) =>
                              setItems((prev) =>
                                prev.map((r) =>
                                  r.id === it.id
                                    ? {
                                        ...r,
                                        unitPrice: parseNum(e.target.value)
                                      }
                                    : r
                                )
                              )
                            }
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Botón estático al final */}
                  <div className='flex justify-end mt-4'>
                    <button
                      type='button'
                      onClick={() =>
                        setItems((prev) => [
                          ...prev,
                          {
                            id: uid(),
                            quantity: 1,
                            unit: 'UNIDAD',
                            code: '',
                            description: '',
                            unitPrice: 0
                          }
                        ])
                      }
                      className='flex items-center gap-2 px-4 py-2 border border-emerald-500 text-emerald-600 rounded-md font-medium text-sm hover:bg-emerald-50 transition'
                    >
                      <RiAddLine size={18} />
                      Agregar ítem
                    </button>
                  </div>

                  <div className='mt-4 text-[13px] flex justify-start'>
                    Valor de Venta de Operaciones Gratuitas:
                    <span className='inline-flex items-center ml-2'>
                      <span className='px-1 border border-slate-300 border-r-0 text-slate-700 text-[11px]'>
                        {moneySymbol(money)}
                      </span>
                      <input
                        className='border border-slate-300 rounded-r px-2 h-9 w-36 text-right'
                        placeholder='0.00'
                        readOnly
                      />
                    </span>
                  </div>
                </div>

                {/* SEPARADOR */}
                <div className='w-full h-1 bg-slate-300 my-4' />

                {/* === TOTALES + LETRAS + Operaciones Gratuitas === */}
                <div className='p-4 border-t border-slate-300 bg-slate-50'>
                  <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                    {/* ===== COLUMNA IZQUIERDA ===== */}
                    <div className='space-y-4'>
                      {/* Valor de Venta de Operaciones Gratuitas */}
                      <div className='text-sm flex items-center'>
                        Valor de Venta de Operaciones Gratuitas:
                        <span className='inline-flex items-center ml-2'>
                          <span className='px-1 border border-slate-300 border-r-0 text-[11px]'>
                            {moneySymbol(money)}
                          </span>
                          <input
                            className='border border-slate-300 rounded-r px-2 h-8 w-32 text-right'
                            readOnly
                            value='0.00'
                          />
                        </span>
                      </div>

                      {/* Texto en letras */}
                      <div className='text-sm font-semibold text-slate-700'>
                        {calc.letras || '—'}
                      </div>
                    </div>

                    {/* ===== COLUMNA DERECHA ===== */}
                    <div className='space-y-4'>
                      {/* Totales */}
                      <div className='border border-slate-400 text-sm bg-white rounded-md shadow-sm'>
                        {[
                          ['Sub Total Ventas', calc.base],
                          ['Anticipos', '0.00'],
                          ['Descuentos', '0.00'],
                          ['Valor Venta', calc.base],
                          ['ISC', '0.00'],
                          ['IGV (18%)', calc.igv],
                          ['Otros Cargos', '0.00'],
                          ['Otros Tributos', '0.00'],
                          ['Monto de redondeo', '0.00'],
                          ['Importe Total', calc.total]
                        ].map(([label, value], i) => (
                          <div
                            key={i}
                            className={`grid grid-cols-2 border-b border-slate-300 ${
                              label === 'Importe Total'
                                ? 'font-semibold bg-slate-100'
                                : ''
                            }`}
                          >
                            <div className='px-3 py-1'>{label}</div>
                            <div className='px-3 py-1 text-right'>
                              {moneySymbol(money)} {Number(value).toFixed(2)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* ---------------------------------------------------------INICIO DE DESTRACCIONES---------------------------------------- */}
                {isManual && (
                  <div className='w-full border border-slate-400 text-xs bg-white rounded-md shadow-sm mt-4'>
                    <div className='border-b border-slate-300 bg-slate-100 px-3 py-1 font-semibold'>
                      Información de la Detracción
                    </div>

                    <div className='px-4 py-3 grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2'>
                      <div>
                        <label className='font-medium'>Leyenda</label>
                        <Select data={formData.leyendaDetraccion} />
                      </div>

                      <div>
                        <label className='font-medium'>Bien o Servicio</label>
                        <Select data={formData.bienServicio} />
                      </div>

                      <div>
                        <label className='font-medium'>Medio de Pago</label>
                        <Select data={formData.medioPagoDetraccion} />
                      </div>

                      <div>
                        <label className='font-medium'>
                          N° Cuenta Banco Nación
                        </label>
                        <Input data={formData.nroCuentaBN} />
                      </div>

                      <div>
                        <label className='font-medium'>
                          Porcentaje de detracción
                        </label>
                        <Input data={formData.porcentajeDetraccion} />
                      </div>

                      <div>
                        <label className='font-medium'>
                          Monto detracción (S/.)
                        </label>
                        <Input data={formData.montoDetraccion} />
                      </div>
                    </div>
                  </div>
                )}

                {(hasDetraccion || detraccionFromXML) && (
                  <div className='w-full border border-slate-400 text-xs bg-white rounded-md shadow-sm mt-4'>
                    <div className='border-b border-slate-300 bg-slate-100 px-3 py-1 font-semibold'>
                      Información de la Detracción
                      {detraccionFromXML && (
                        <span className='ml-2 text-[11px] text-slate-500'>
                          (importada desde XML)
                        </span>
                      )}
                    </div>

                    <div className='px-4 py-3 grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2'>
                      <div>
                        <label className='font-medium'>Leyenda</label>
                        <Select data={formData.leyendaDetraccion} />
                      </div>

                      <div>
                        <label className='font-medium'>Bien o Servicio</label>
                        <Select data={formData.bienServicio} />
                      </div>

                      <div>
                        <label className='font-medium'>Medio de Pago</label>
                        <Select data={formData.medioPagoDetraccion} />
                      </div>

                      <div>
                        <label className='font-medium'>
                          N° Cuenta Banco Nación
                        </label>
                        <Input data={formData.nroCuentaBN} />
                      </div>

                      <div>
                        <label className='font-medium'>
                          Porcentaje de detracción
                        </label>
                        <Input data={formData.porcentajeDetraccion} />
                      </div>

                      <div>
                        <label className='font-medium'>
                          Monto detracción (S/.)
                        </label>
                        <Input data={formData.montoDetraccion} />
                      </div>
                    </div>
                  </div>
                )}

                {/* ---------------------------------------------------------FIN DE DESTRACCIONES---------------------------------------- */}

                {/* ---------------------------------------------------------Información del crédito--------------------------------------------------------- */}

                {lockedFromXML && creditoFinal && (
                  <>
                    <div className='w-full border border-slate-400 text-xs bg-white rounded-md shadow-sm mt-4'>
                      <div className='border-b border-slate-300 bg-slate-100 px-3 py-1 font-semibold'>
                        Información del crédito
                      </div>

                      <div className='px-4 py-3 grid grid-cols-2 gap-y-2'>
                        <div>Monto pendiente:</div>
                        <div>
                          {moneySymbol(money)}{' '}
                          {creditoFinal.montoPendiente.toFixed(2)}
                        </div>

                        <div>Total de cuotas:</div>
                        <div>{creditoFinal.cuotas.length}</div>
                      </div>
                    </div>

                    <CuotasTable
                      cuotas={creditoFinal.cuotas}
                      money={money}
                      locked={true}
                    />
                  </>
                )}

                {/* ---------------------------------------------------------Fin de Información del crédito--------------------------------------------------------- */}

                <FormContent
                  className='w-full'
                  classNameInter='flex flex-row justify-center items-center'
                >
                  <div className='w-full xl:w-1/3 pt-5'>
                    <Button data={formData.submit} />
                  </div>
                </FormContent>
              </div>
            </FormContent>
          </FormContainer>
        </Formulary>
      </PageContent>
      <NewProductInQuotation
        open={openNewProduct}
        onClose={() => setOpenNewProduct(null)}
        onProductCreated={(producto) => {
          // 🔥 aquí luego conectas el producto con items
          setItems((prev) => [
            ...prev,
            {
              id: uid(),
              quantity: 1,
              unit: producto.unidad.value,
              code: producto.sku ?? '',
              description: producto.descripcion,
              unitPrice: producto.precioUnitario
            }
          ])
          setOpenNewProduct(null)
        }}
      />
    </PageContainer>
  )
}

export { FacturaMod }

async function getData(uuid: string | undefined, token: string | null) {
  if (token) {
    const factura =
      uuid && uuid.length > 0
        ? await ApiFecthAuth(endPoints.invoices.retrieve(uuid), token)
        : null

    const tipoCambioRes = await ApiFecthAuth(
      endPoints.mainData.exchange.latest,
      token
    )

    const tipocambio =
      tipoCambioRes && tipoCambioRes.data
        ? (tipoCambioRes.data as unknown as TipoCambioDiaInterface)
        : null

    return {
      props: {
        factura: factura
          ? (factura.data as unknown as InvoiceRetrieveLike)
          : null,
        tipocambio: tipocambio
      },
      revalidate: 3600
    }
  }
  return { props: { factura: null, tipocambio: null }, revalidate: 3600 }
}
