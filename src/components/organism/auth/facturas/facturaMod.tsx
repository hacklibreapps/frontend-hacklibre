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
  toISODate,
  isoToDMY,
  moneySymbol
} from '@/modules/invoice/utils'
import { BsFiletypeXml, BsPaperclip, BsTrash, BsUpload } from 'react-icons/bs'
import TextArea from '@/components/atom/structures/textArea'
import { ModalSize } from '@/interfaces/querys/queryInterface'
import { NewProductInQuotation } from '@/components/molecule/auth/quotations/ProductCreateModal'
import { useImportInvoiceXML } from '@/components/molecule/invoices/hooks/useImportInvoiceXML'
import { useInvoiceFormState } from '@/components/molecule/invoices/hooks/useInvoiceFormState'
import { InvoiceItemsFromXML } from '@/components/molecule/invoices/items/invoiceItemsFromXML'

import { KeyValueInterface } from '@/interfaces/structures/keyValueInterface'
import { useInvoiceCredito } from '@/components/molecule/invoices/hooks/useInvoiceCredito'
import { ParsedInvoiceXML } from '@/components/molecule/invoices/xml/types'
import { AxiosError } from 'axios'
import { getCookie } from '@/services/cookies/cookies'
import { ItemInvoicesMod } from '@/components/molecule/invoices/ItemInvoicesMod'
import { Hr } from '@/utils/hr'
import { Cuota, CuotasTable } from '@/components/molecule/invoices/cuotas_table'

//

const FacturaMod: React.FC<UUIDInterface> = ({ uuid }) => {
  const {
    token,
    enterprise,
    ready,
    detractionPercent,
    detractionAccount,
    enterpriseName,
    comercialName,
    ruc,
    address,
    departamento,
    provincia,
    distrito
  } = useAuth()

  // usestates
  const [initialValues, setInitialValues] = useState<boolean>(false)
  const [places, setPlaces] = useState<string[]>([])
  const [submitLoaded, setSubmitLoaded] = useState(false)
  const [money, setMoney] = useState<'PEN' | 'USD'>('PEN')
  const [tipocambio, setTipoCambio] = useState<TipoCambioDiaInterface | null>(
    null
  )
  const [listDetractionPercent, setListDetractionPercent] = useState<
    KeyValueInterface[]
  >([])

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

  const [loadingCliente, setLoadingCliente] = useState(false)
  const [lastRucSearched, setLastRucSearched] = useState<string>('')

  // const isManual = !isXMLImport && !lockedFromXML

  const [unidadMedidaList, setUnidadMedidaList] = useState<KeyValueInterface[]>(
    []
  )
  const [moneyList, setMoneyList] = useState<KeyValueInterface[]>([])

  const [dataEditFormaPago, setDataEditFormaPago] =
    useState<KeyValueInterface>()

  const [dataEditMoneda, setDataEditMoneda] = useState<KeyValueInterface>()

  //

  const [resetMoneda, setResetMoneda] = useState<boolean>(false)
  const [resetFormaPago, setResetFormaPago] = useState<boolean>(false)
  const [resetLeyendasDetraccion, setResetLeyendasDetraccion] =
    useState<boolean>(false)
  const [resetBienServicio, setResetBienServicio] = useState<boolean>(false)
  const [resetMedioPagoDetraccion, setResetMedioPagoDetraccion] =
    useState<boolean>(false)
  const [resetPorcentajeDetraccion, setResetPorcentajeDetraccion] =
    useState<boolean>(false)

  const [lateInvoice, setLateInvoice] = useState<boolean>(false)

  const [creditoFromXML, setCreditoFromXML] = useState<
    ParsedInvoiceXML['credito'] | null
  >(null)

  const [leyendasDetraccion, setLeyendasDetraccion] = useState<
    KeyValueInterface[]
  >([])

  const [dataEditLeyendaDetraccion, setDataEditLeyendaDetraccion] =
    useState<KeyValueInterface>()

  const [bienesServiciosSPOT, setBienesServiciosSPOT] = useState<
    KeyValueInterface[]
  >([])
  const [dataEditBienServicio, setDataEditBienServicio] =
    useState<KeyValueInterface>()

  const [mediosPagoDetraccion, setMediosPagoDetraccion] = useState<
    KeyValueInterface[]
  >([])
  const [dataEditMedioPagoDetraccion, setDataEditMedioPagoDetraccion] =
    useState<KeyValueInterface>()

  const [dataPorcentajeDetraccion, setDataPorcentajeDetraccion] =
    useState<KeyValueInterface>()

  const [items, setItems] = useState<ItemRow[]>([
    {
      id: 'initial-invoice-item',
      quantity: 1,
      unit: 'UNIDAD',
      code: '',
      description: '',
      unitPrice: 0
    }
  ])

  const [documentos, setDocumentos] = useState<File[]>([])

  // refs

  const invoiceNumberRef = useRef<HTMLInputElement>(null)
  const invoiceFileRef = useRef<HTMLInputElement>(null)
  const invoiceTypeRef = useRef<HTMLInputElement>(null)

  const emissionDateRef = useRef<HTMLInputElement>(null)
  const checkboxRef = useRef<HTMLInputElement>(null)
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

  const leyendaDetraccionRef = useRef<HTMLInputElement>(null)
  const bienServicioRef = useRef<HTMLInputElement>(null)
  const medioPagoDetraccionRef = useRef<HTMLInputElement>(null)
  const nroCuentaBNRef = useRef<HTMLInputElement>(null)
  const porcentajeDetraccionRef = useRef<HTMLInputElement>(null)
  const montoDetraccionRef = useRef<HTMLInputElement>(null)

  // handlers reset

  const handlerRestartResetMoneda = () => {
    if (resetMoneda) setResetMoneda(false)
  }
  const handlerRestartResetFormaPago = () => {
    if (resetFormaPago) setResetFormaPago(false)
  }
  const handlerRestartResetLeyendasDetraccion = () => {
    if (resetLeyendasDetraccion) {
      setResetLeyendasDetraccion(false)
    }
  }
  const handlerRestartResetBienServicio = () => {
    if (resetBienServicio) {
      setResetBienServicio(false)
    }
  }
  const handlerRestartResetMedioPagoDetraccion = () => {
    if (resetMedioPagoDetraccion) {
      setResetMedioPagoDetraccion(false)
    }
  }
  const handlerRestartResetPorcentajeDetraccion = () => {
    if (resetPorcentajeDetraccion) {
      setResetPorcentajeDetraccion(false)
    }
  }

  const formatDate = (date: Date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')

    return `${year}-${month}-${day}`
  }

  const today = new Date()

  const twoDaysAgo = new Date()
  twoDaysAgo.setDate(today.getDate() - 2)

  const minDate = formatDate(twoDaysAgo)
  const maxDate = formatDate(today)

  const updateCuotaFecha = (nro: number, fecha: string) => {
    setCuotas((prev) =>
      prev.map((c) => (c.nro === nro ? { ...c, fechaVencimiento: fecha } : c))
    )
  }
  useEffect(() => {
    setPlaces(
      [distrito, provincia, departamento].filter(
        (place): place is string =>
          typeof place === 'string' && place.length > 0
      )
    )
  }, [distrito, provincia, departamento])

  const handleDocumentsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])

    if (!files.length) return

    setDocumentos((prev) => {
      const nuevos = files.filter(
        (file) =>
          !prev.some(
            (existing) =>
              existing.name === file.name &&
              existing.size === file.size &&
              existing.lastModified === file.lastModified
          )
      )

      return [...prev, ...nuevos]
    })

    e.target.value = ''
  }

  const deleteDocument = (index: number) => {
    setDocumentos((prev) =>
      prev.filter((_, currentIndex) => currentIndex !== index)
    )
  }

  const formatFileSize = (size: number) => {
    if (size < 1024) return `${size} B`

    if (size < 1024 * 1024) {
      return `${(size / 1024).toFixed(1)} KB`
    }

    return `${(size / (1024 * 1024)).toFixed(1)} MB`
  }

  useEffect(() => {
    if (detractionAccount) {
      setCuentaBN(detractionAccount)

      if (nroCuentaBNRef.current) {
        nroCuentaBNRef.current.value = detractionAccount
      }
    }

    if (detractionPercent !== null && detractionPercent !== undefined) {
      const porcentaje = Number(detractionPercent) || 0

      setPorcentajeDetraccion(porcentaje)

      if (porcentajeDetraccionRef.current) {
        porcentajeDetraccionRef.current.value = String(porcentaje)
      }
    }
  }, [detractionAccount, detractionPercent])

  const toLocalISODate = (date: Date): string => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')

    return `${year}-${month}-${day}`
  }

  useEffect(() => {
    const now = new Date()

    if (emissionDateRef.current) {
      emissionDateRef.current.value = toLocalISODate(now)
    }

    // Fecha de vencimiento: mañana
    const tomorrow = new Date(now)
    tomorrow.setDate(tomorrow.getDate() + 1)

    if (dueDateRef.current) {
      dueDateRef.current.value = toLocalISODate(tomorrow)
    }
  }, [])

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

  const { credito: creditoCalculado, setCredito } = useInvoiceCredito({
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

        const tipocambioRes = data.props.tipocambio
        const detractPercent = data.props.detractionPercent

        if (
          tipocambioRes &&
          'status' in tipocambioRes &&
          tipocambioRes.status === 200
        ) {
          setTipoCambio(tipocambioRes.data as TipoCambioDiaInterface)
        }

        if (
          detractPercent &&
          'status' in detractPercent &&
          detractPercent.status === 200
        ) {
          setListDetractionPercent(detractPercent.data)
        }
      } catch (error) {
        ToastNotification('danger', `Ha ocurrido un error - ${error}`)
      }
    }
    if (token) fetchData()
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
    const fetchLeyenda = async () => {
      if (!token) return

      try {
        const res = await ApiFecthAuth(
          endPoints.mainData.detraction.leyend,
          token
        )
        setLeyendasDetraccion(res?.data || [])
      } catch (error) {
        console.error('Error cargando tipo de operacion', error)
        ToastNotification('danger', 'Error cargando tipo de operacion')
      }
    }
    fetchLeyenda()
  }, [token])

  useEffect(() => {
    const fetchTipoBienServicio = async () => {
      if (!token) return

      try {
        const res = await ApiFecthAuth(
          endPoints.mainData.goodServiceType,
          token
        )
        setBienesServiciosSPOT(res?.data || [])
      } catch (error) {
        console.error('Error cargando tipo de bien o servicio', error)
        ToastNotification('danger', 'Error cargando tipo de bien o servicio')
      }
    }
    fetchTipoBienServicio()
  }, [token])

  useEffect(() => {
    const fetchMedioPago = async () => {
      if (!token) return

      try {
        const res = await ApiFecthAuth(endPoints.mainData.paymentMethod, token)
        setMediosPagoDetraccion(res?.data || [])
      } catch (error) {
        console.error('Error cargando medio de pago', error)
        ToastNotification('danger', 'Error cargando medio de pago')
      }
    }
    fetchMedioPago()
  }, [token])

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
    const aplicaDetraccion = calc.total >= 700

    setHasDetraccion(aplicaDetraccion)

    if (!aplicaDetraccion) {
      setMontoDetraccion(0)
      return
    }

    const monto = Math.round(calc.total * (porcentajeDetraccion / 100))

    setMontoDetraccion(monto)
  }, [calc.total, porcentajeDetraccion])
  useEffect(() => {
    if (montoDetraccionRef.current) {
      montoDetraccionRef.current.value = montoDetraccion.toFixed(2)
    }
  }, [montoDetraccion])

  useEffect(() => {
    if (tipocambio && tipoCambioDolarRef.current) {
      tipoCambioDolarRef.current.value = tipocambio.venta?.toString() ?? ''
    }
  }, [tipocambio])

  useEffect(() => {
    if (moneyList && moneyList.length > 0) {
      if (moneyList && moneyList.length > 0) {
        setDataEditMoneda(
          moneyList.find((m) => m.attr === 'S/') ?? moneyList[0]
        )
      }
    }
  }, [moneyList])

  useEffect(() => {
    setDataEditFormaPago({ key: 'CONT', value: 'Al contado' })
  }, [])

  useEffect(() => {
    if (leyendasDetraccion && leyendasDetraccion.length > 0) {
      if (leyendasDetraccion && leyendasDetraccion.length > 0) {
        setDataEditLeyendaDetraccion(
          leyendasDetraccion.find((l) => l.key === 'ogc') ??
            leyendasDetraccion[0]
        )
      }
    }
  }, [leyendasDetraccion])

  // prueba de useeffect reinicio
  // en opcion aca manejo del ref revisar como lo estamos armando
  useEffect(() => {
    if (initialValues) {
      console.log('entro a initialvalues')

      if (leyendasDetraccion && leyendasDetraccion.length > 0) {
        if (leyendasDetraccion && leyendasDetraccion.length > 0) {
          setDataEditLeyendaDetraccion(
            leyendasDetraccion.find((l) => l.key === 'ogc') ??
              leyendasDetraccion[0]
          )
        }
      }
      setInitialValues(false)
    }
  }, [initialValues, leyendasDetraccion])

  useEffect(() => {
    if (bienesServiciosSPOT && bienesServiciosSPOT.length > 0) {
      if (bienesServiciosSPOT && bienesServiciosSPOT.length > 0) {
        setDataEditBienServicio(
          bienesServiciosSPOT.find((b) => b.key === '037') ??
            bienesServiciosSPOT[0]
        )
      }
    }
  }, [bienesServiciosSPOT])

  useEffect(() => {
    if (mediosPagoDetraccion && mediosPagoDetraccion.length > 0) {
      if (mediosPagoDetraccion && mediosPagoDetraccion.length > 0) {
        setDataEditMedioPagoDetraccion(
          mediosPagoDetraccion.find((m) => m.key === '001') ??
            mediosPagoDetraccion[0]
        )
      }
    }
  }, [mediosPagoDetraccion])

  useEffect(() => {
    if (listDetractionPercent.length > 0) {
      const selected =
        listDetractionPercent.find(
          (m) => Number(m.key) === Number(detractionPercent)
        ) ?? listDetractionPercent[0]

      setDataPorcentajeDetraccion(selected)
      setPorcentajeDetraccion(Number(selected.key) || 0)
    }
  }, [detractionPercent, listDetractionPercent])

  //

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

  const handlerIsLate = () => {
    setLateInvoice(checkboxRef.current?.checked ?? false)
  }

  // Crear función buscarClientePorRuc
  const buscarClientePorRuc = async (ruc: string) => {
    if (!token) return
    if (ruc.length !== 11) return

    if (ruc === lastRucSearched) return

    try {
      setLoadingCliente(true)

      const response = await ApiFecthAuth(
        `${endPoints.clients.byRuc(ruc)}&client_type=client`,
        token
      )

      const cliente = response?.data

      if (!cliente?.uuid || !cliente?.ruc) {
        if (senoresRef.current) {
          senoresRef.current.value = ''
        }

        if (direccionClienteRef.current) {
          direccionClienteRef.current.value = ''
        }

        if (relClientsRef.current) {
          relClientsRef.current.value = ''
        }

        setLastRucSearched('')

        ToastNotification(
          'warning',
          'Cliente no registrado. Puede ingresarlo manualmente.'
        )

        return
      }

      /*
       * Recién aquí sabemos que realmente existe.
       */
      if (senoresRef.current) {
        senoresRef.current.value = cliente.completeCompanyName ?? ''
      }

      if (direccionClienteRef.current) {
        direccionClienteRef.current.value = cliente.address ?? ''
      }

      if (relClientsRef.current) {
        relClientsRef.current.value = cliente.uuid ?? ''
      }

      /*
       * Solo una búsqueda exitosa se guarda.
       */
      setLastRucSearched(ruc)

      ToastNotification('success', 'Cliente encontrado.')
    } catch (error: unknown) {
      console.error('[CLIENTE] error:', error)

      const axiosError = error as AxiosError

      if (senoresRef.current) {
        senoresRef.current.value = ''
      }

      if (direccionClienteRef.current) {
        direccionClienteRef.current.value = ''
      }

      if (relClientsRef.current) {
        relClientsRef.current.value = ''
      }

      /*
       * También se libera en caso de error.
       */
      setLastRucSearched('')

      if (axiosError.response?.status === 404) {
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

  const handlerRucClienteChange = (val: string) => {
    const clean = val.replace(/\D/g, '').slice(0, 11)

    if (rucClienteRef.current) {
      rucClienteRef.current.value = clean
    }

    if (clean.length === 11) {
      buscarClientePorRuc(clean)
    } else {
      setLastRucSearched('')

      if (senoresRef.current) {
        senoresRef.current.value = ''
      }

      if (direccionClienteRef.current) {
        direccionClienteRef.current.value = ''
      }

      if (relClientsRef.current) {
        relClientsRef.current.value = ''
      }
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
      minDate: !lateInvoice ? minDate : undefined,
      maxDate: !lateInvoice ? maxDate : undefined,
      onChange: (val: string) => {
        if (dueDateRef.current) dueDateRef.current.min = val
      }
    },
    lateInvoice: {
      name: `lateInvoice`,
      id: `lateInvoice`,
      showLabel: true,
      label: '¿Es una factura atrasada?',
      required: true,
      tiny: true,
      type: 'checkbox',
      ref: checkboxRef,
      onChange: handlerIsLate
    },
    senores: {
      name: 'senores',
      id: 'senores',
      showLabel: false,
      label: 'Cliente',
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
      onChange: handlerRucClienteChange
    },
    direccionCliente: {
      name: 'direccion_cliente',
      id: 'direccion_cliente',
      showLabel: false,
      label: 'Dirección del Cliente',
      ref: direccionClienteRef,
      required: false,
      readOnly: lockedFromXML,
      tiny: true,
      placeHolder: 'AV. / JR. / KM. ...'
    },
    tipoCambioDolar: {
      name: 'tipo_cambio',
      id: 'tipo_cambio',
      showLabel: false,
      label: 'Tipo de Cambio',
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
      tiny: true,
      data: moneyList,
      editData: dataEditMoneda,
      resetSignal: resetMoneda,
      resetHandler: handlerRestartResetMoneda,
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

    // === DETRACCIÓN ===
    leyendaDetraccion: {
      name: 'leyenda_detraccion',
      id: 'leyenda_detraccion',
      label: 'Tipo de operación',
      showLabel: true,
      ref: leyendaDetraccionRef,
      data: leyendasDetraccion,
      tiny: true,
      readOnly: lockedFromXML,
      // disabled: loadingImportXML, // revisar ???
      editData: dataEditLeyendaDetraccion,
      resetSignal: resetLeyendasDetraccion,
      resetHandler: handlerRestartResetLeyendasDetraccion,
      noDeleteOption: true,
      onChange: (key: string) => {
        setDataEditLeyendaDetraccion(
          leyendasDetraccion.find((item) => item.key === key)
        )
      }
    },
    bienServicio: {
      name: 'bien_servicio',
      id: 'bien_servicio',
      label: 'Bien o servicio sujeto a detracción*',
      showLabel: true,
      ref: bienServicioRef,
      data: bienesServiciosSPOT,
      tiny: true,
      readOnly: lockedFromXML,
      editData: dataEditBienServicio,
      resetSignal: resetBienServicio,
      resetHandler: handlerRestartResetBienServicio,
      noDeleteOption: true,
      onChange: (key: string) => {
        setDataEditBienServicio(
          bienesServiciosSPOT.find((item) => item.key === key)
        )
      }
    },
    medioPagoDetraccion: {
      name: 'medio_pago_detraccion',
      id: 'medio_pago_detraccion',
      label: 'Medio de Pago',
      showLabel: true,
      ref: medioPagoDetraccionRef,
      data: mediosPagoDetraccion,
      readOnly: lockedFromXML,
      tiny: true,
      editData: dataEditMedioPagoDetraccion,
      resetSignal: resetMedioPagoDetraccion,
      resetHandler: handlerRestartResetMedioPagoDetraccion,
      noDeleteOption: true,
      onChange: (key: string) => {
        setDataEditMedioPagoDetraccion(
          //mediosPagoDetraccion.find((item) => item.key === key)
          mediosPagoDetraccion.find((item) => String(item.key) === String(key))
        )
      }
    },
    nroCuentaBN: {
      name: 'nro_cta_bn',
      id: 'nro_cta_bn',
      label: 'N° Cta. Banco Nación',
      showLabel: true,
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
      label: '% de detracción',
      showLabel: true,
      ref: porcentajeDetraccionRef,
      data: listDetractionPercent,
      tiny: true,
      readOnly: lockedFromXML,
      editData: dataPorcentajeDetraccion,
      resetSignal: resetPorcentajeDetraccion,
      resetHandler: handlerRestartResetPorcentajeDetraccion,
      noDeleteOption: true,
      //onChange: (key: string) => {
      // setPorcentajeDetraccion(Number(key) || 0)
      //}
      onChange: (key: string) => {
        const selected = listDetractionPercent.find(
          (item) => String(item.key) === String(key)
        )

        console.log('KEY DETRACCION:', key)
        console.log('SELECTED DETRACCION:', selected)

        setDataPorcentajeDetraccion(selected)
        setPorcentajeDetraccion(Number(key) || 0)
      }
    },
    montoDetraccion: {
      name: 'monto_detraccion',
      id: 'monto_detraccion',
      label: 'Monto de detracción',
      showLabel: true,
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
          checkboxRef,
          invoiceNumberRef,
          emissionDateRef,
          rucClienteRef,
          senoresRef,
          direccionClienteRef,
          tipoCambioDolarRef,
          observationRef,

          invoiceFileRef,
          invoiceTypeRef,

          opGravadaRef,
          opInafectaRef,
          recargoConsumoRef,
          igvRef,
          importeTotalRef,

          moneyRef,
          relClientsRef,

          direccionReceptorRef
        ],
        resetValues: []
      }
    ]
    const resetAllFields = ResetForm({ resetFields })

    const handlerResetfield = () => {
      resetAllFields()

      setDocumentos([])

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

      if (emissionDateRef.current) {
        emissionDateRef.current.value = toISODate(now)
      } // esto hace que generer automaticamente el valor del input
      setResetLeyendasDetraccion(true)
      setMoney('PEN')
      setTipoDePago('CONT')

      setNroDeCuotas(1)
      setFechaPrimeraCuota('')
      setCuotas([])

      setObservation('')

      setHasDetraccion(false)
      setDetraccionFromXML(false)

      setIsXMLImport(false)
      setLockedFromXML(false)
      setItemsFromXML(false)
      setCreditoFromXML(null)

      setLateInvoice(false)

      setPorcentajeDetraccion(Number(detractionPercent) || 0)
      setMontoDetraccion(0)

      setCuentaBN(detractionAccount ?? '')

      setLastRucSearched('')

      if (nroCuentaBNRef.current) {
        nroCuentaBNRef.current.value = detractionAccount ?? ''
      }

      if (porcentajeDetraccionRef.current) {
        porcentajeDetraccionRef.current.value = String(
          Number(detractionPercent) || 0
        )
      }

      // ==========================================
      // VOLVER A EJECUTAR LOS useEffect DE DEFAULTS
      // ==========================================
    }
    const [serie, correlativo] =
      invoiceNumberRef.current?.value.split('-') ?? []

    const body: FacturaBodyInterface & {
      items?: Array<{
        description: string
        quantity: number
        unit_price: number
      }>
      documents?: File[]

      emission_date_display?: string
    } = {
      invoice_serial_nr: serie ?? '',
      invoice_correlative_nr: correlativo ?? '',
      emition_date: emissionDateRef.current?.value
        ? isoToDMY(emissionDateRef.current.value)
        : null,
      client_name: senoresRef.current?.value ?? '',
      rel_clients: rucClienteRef.current?.value ?? '',
      address_clients: direccionClienteRef.current?.value ?? '',
      invoice_type: currentInvoiceType,
      payment_type: tipoDePago,
      has_delivery_address: false,
      money: money,
      exchange_rate: tipoCambioDolarRef.current?.value ?? String(tipocambio),
      cantidad_cuotas: nroDeCuotas,
      credito: tipoDePago === 'CRED' ? creditoFinal : null,

      op_gravada: String(calc.base),
      op_inafecta: '0.00',
      recargo_consumo: '0.00',
      igv: String(calc.igv),
      igv_rate: IGV_RATE.toFixed(2),
      importe_total: String(calc.total),

      leyenda_detraccion:
        hasDetraccion && dataEditLeyendaDetraccion
          ? String(dataEditLeyendaDetraccion.key)
          : '',

      bien_servicio:
        hasDetraccion && dataEditBienServicio
          ? String(dataEditBienServicio.key)
          : '',

      medio_pago_detraccion:
        hasDetraccion && dataEditMedioPagoDetraccion
          ? String(dataEditMedioPagoDetraccion.key)
          : '',

      nro_cta_bn: hasDetraccion ? (nroCuentaBNRef.current?.value ?? '') : '',

      porcentaje_detraccion: hasDetraccion ? String(porcentajeDetraccion) : '0',

      monto_detraccion: hasDetraccion ? String(montoDetraccion) : '0',

      total_neto_pagar: String(
        hasDetraccion ? calc.total - montoDetraccion : calc.total
      ),

      due_date: dueDateRef.current?.value
        ? isoToDMY(dueDateRef.current.value)
        : null,

      observations: observationRef.current?.value ?? '',

      status: true,

      items: items.map((it) => ({
        description: it.description,
        quantity: it.quantity,
        measurement_unit: it.unit,
        unit_price: it.unitPrice
      })),

      documents: documentos
    }
    console.log('body: ', body)

    const endPoint = uuid
      ? endPoints.invoices.patch(uuid)
      : endPoints.invoices.create

    try {
      setSubmitLoaded(true)
      if (uuid) {
        const response = await ApiPatchAuth(endPoint, token, body)

        ResponseFromEdited({ response, returnSuccess: `/facturas?t=s&m=edit` })
      } else {
        const response = await ApiPostAuth(
          endPoint,
          token,
          {
            ...body,
            items: JSON.stringify(body.items),
            credito: body.credito ? JSON.stringify(body.credito) : '',
            documents: documentos
          },
          undefined,
          'multipart/form-data'
        )

        ResponseFromCreated({
          response,
          successMessage: 'Factura registrada SATISFACTORIAMENTE.',
          handlerResetfield
        })
        setInitialValues(true)
      }
    } catch {
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
              uuid ? 'Editar factura electrónica' : 'Nueva factura electrónica'
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

      <GoBack enlace={`${prefix}/facturacion/`} />

      <PageContent className='w-full' styleInside={{ padding: '0px' }}>
        <Formulary onSubmit={onSubmit}>
          <FormContainer>
            <FormContent className='w-full'>
              <div className='w-full overflow-hidden bg-white lg:rounded-lg lg:border lg:border-slate-400 max-w-none mx-0 px-4 sm:px-6 md:px-8 lg:px-10'>
                {/* ==== ENCABEZADO DE LA FACTURA ==== */}
                {lateInvoice ? 'true' : 'false'}
                <div className='grid grid-cols-1 md:grid-cols-12 items-center rounded-t bg-white'>
                  {/* Bloque de empresa */}
                  <div className='col-span-12 md:col-span-8 p-4 text-center md:text-start flex flex-col justify-center'>
                    <div className='font-extrabold text-2xl sm:text-[1.6rem] uppercase leading-tight'>
                      {enterpriseName}
                    </div>
                    <div className='font-bold text-lg sm:text-xl leading-snug'>
                      {comercialName}
                    </div>
                    <div className='text-sm sm:text-base mt-1 leading-snug'>
                      {address}
                    </div>
                    <div className='text-sm sm:text-base leading-snug'>
                      {places.join('-')}
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
                        RUC: {ruc}
                      </div>
                      <div className='mt-2 font-semibold text-xs tracking-wide'>
                        <Input data={formData.invoiceNumber} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* SEPARADOR */}
                <Hr />

                {/* DATOS */}
                <div className='p-6 space-y-2'>
                  <div className='flex flex-col md:flex-row md:items-start'>
                    <div className='w-full md:w-4/12 xl:w-2/12 h-10 flex items-center justify-start text-left whitespace-nowrap'>
                      <Input data={formData.lateInvoice} />
                    </div>
                  </div>
                  <div className='flex flex-col md:flex-row md:items-center md:gap-3 xl:gap-6'>
                    <div className='w-full md:w-4/12 xl:w-3/12 h-10 flex items-center text-left whitespace-nowrap'>
                      {formData.emissionDate.label}
                    </div>
                    <div className='w-full md:w-8/12 xl:w-5/12 md:max-w-[280px] flex items-center gap-2'>
                      <Input data={formData.emissionDate} />
                    </div>
                  </div>

                  <div className='flex flex-col md:flex-row md:items-center md:gap-3 xl:gap-6'>
                    <div className='w-full md:w-4/12 xl:w-3/12 h-10 flex items-center text-left whitespace-nowrap'>
                      {formData.rucCliente.label}
                    </div>
                    <div className='w-full md:w-8/12 xl:w-5/12 md:max-w-[260px]'>
                      <Input data={formData.rucCliente} />

                      {loadingCliente && (
                        <p className='text-xs text-slate-500 mt-1'>
                          Buscando cliente...
                        </p>
                      )}
                    </div>
                  </div>

                  <div className='flex flex-col md:flex-row md:items-center md:gap-3 xl:gap-6'>
                    <div className='w-full md:w-4/12 xl:w-3/12 h-10 flex items-center text-left whitespace-nowrap'>
                      {formData.senores.label}
                    </div>
                    <div className='w-full md:w-8/12 xl:w-5/12 md:max-w-[400px]'>
                      <Input data={formData.senores} />
                    </div>
                  </div>

                  <div className='flex flex-col md:flex-row md:items-center md:gap-3 xl:gap-6'>
                    <div className='w-full md:w-4/12 xl:w-3/12 h-10 flex items-center text-left whitespace-nowrap'>
                      {formData.direccionCliente.label}
                    </div>
                    <div className='w-full md:w-8/12 xl:w-5/12 md:max-w-[560px]'>
                      <Input data={formData.direccionCliente} />
                    </div>
                  </div>

                  <div className='flex flex-col md:flex-row md:items-center md:gap-3 xl:gap-6'>
                    <div className='w-full md:w-4/12 xl:w-3/12 h-10 flex items-center text-left whitespace-nowrap'>
                      {formData.tipoCambioDolar.label}
                    </div>
                    <div className='w-full md:w-8/12 xl:w-5/12 md:max-w-[200px]'>
                      <Input data={formData.tipoCambioDolar} />
                    </div>
                  </div>

                  <div className='flex flex-col md:flex-row md:items-center md:gap-3 xl:gap-6'>
                    <div className='w-full md:w-4/12 xl:w-3/12 h-10 flex items-center text-left whitespace-nowrap'>
                      {formData.money.label}
                    </div>
                    <div className='w-full md:w-8/12 xl:w-5/12 md:max-w-[260px]'>
                      <Select data={formData.money} />
                    </div>
                  </div>

                  <div className='flex flex-col md:flex-row md:items-center md:gap-3 xl:gap-6'>
                    <div className='w-full md:w-4/12 xl:w-3/12 h-10 flex items-center text-left whitespace-nowrap'>
                      {formData.observation.label}
                    </div>
                    <div className='w-full md:w-8/12 xl:w-5/12 md:max-w-[560px]'>
                      <TextArea data={formData.observation} />
                    </div>
                  </div>

                  <div className='flex flex-col md:flex-row md:items-center md:gap-3 xl:gap-6'>
                    <div className='w-full md:w-4/12 xl:w-3/12 h-10 flex items-center text-left whitespace-nowrap'>
                      {formData.tipoDePago.label}
                    </div>
                    <div className='w-full md:w-8/12 xl:w-5/12 md:max-w-[560px]'>
                      <Select data={formData.tipoDePago} />
                    </div>
                  </div>

                  {/* BLOQUE CORRECTO (NO borrar) */}
                  {/* ====== SOLO FACTURA MANUAL ====== */}
                  {tipoDePago === 'CRED' && !isXMLImport && !creditoFromXML && (
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
                <Hr />

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
                  <div className='mt-4 border border-slate-300 rounded-lg overflow-hidden'>
                    <div className='flex justify-start items-center bg-cyan-900 text-white px-4 py-2'>
                      <span className='font-semibold text-sm'>Productos</span>
                    </div>
                    {items.map((it, index) => (
                      <ItemInvoicesMod
                        key={it.id}
                        item={it}
                        index={index}
                        setItems={setItems}
                        unidadMedidaList={unidadMedidaList}
                      />
                    ))}

                    {/* Botón estático al final */}
                    <div className='flex justify-end my-4 mr-4'>
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
                  </div>
                )}

                {/* TABLA ÍTEMS */}
                <div className='block space-y-4 relative'>
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
                <Hr />

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
                {(hasDetraccion || detraccionFromXML) && (
                  <div className='w-full border border-slate-400 text-xs bg-white rounded-md  shadow-sm mt-4'>
                    <div className='border-b border-slate-300 bg-slate-100 px-3 py-1 rounded-md font-semibold'>
                      Información de la Detracción
                    </div>

                    <div className='px-4 py-3 flex flex-row justify-center items-center flex-wrap'>
                      <div className='w-full md:w-6/12 xl:w-4/12 2xl:w-2/12 md:px-2'>
                        <Select data={formData.leyendaDetraccion} />
                      </div>

                      <div className='w-full md:w-6/12 xl:w-4/12 2xl:w-2/12 md:px-2'>
                        <Select data={formData.bienServicio} />
                      </div>

                      <div className='w-full md:w-6/12 xl:w-4/12 2xl:w-2/12 md:px-2'>
                        <Select data={formData.medioPagoDetraccion} />
                      </div>

                      <div className='w-full md:w-6/12 xl:w-3/12 2xl:w-2/12 md:px-2'>
                        <Input data={formData.nroCuentaBN} />
                      </div>

                      <div className='w-full md:w-6/12 xl:w-2/12 2xl:w-2/12 md:px-2'>
                        <Select data={formData.porcentajeDetraccion} />
                      </div>

                      <div className='w-full md:w-6/12  2xl:w-2/12 xl:w-3/12 md:px-2'>
                        <Input data={formData.montoDetraccion} />
                      </div>
                    </div>
                  </div>
                )}
                {/*
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
                        <Select data={formData.porcentajeDetraccion} />
                      </div>

                      <div>
                        <label className='font-medium'>
                          Monto detracción (S/.)
                        </label>
                        <Input data={formData.montoDetraccion} />
                      </div>
                    </div>
                  </div>
                )}*/}

                {/* ---------------------------------------------------------FIN DE DESTRACCIONES---------------------------------------- */}
                <div className='w-full border border-slate-300 rounded-lg overflow-hidden mt-4'>
                  {/* HEADER */}
                  <div className='flex justify-between items-center bg-cyan-900 text-white px-4 py-2'>
                    <div className='flex items-center gap-2'>
                      <BsPaperclip size={16} />
                      <span className='font-semibold text-sm'>
                        Documentos adjuntos
                      </span>
                    </div>
                  </div>

                  <div className='p-4 bg-white'>
                    {/* BOTÓN ADJUNTAR */}
                    <div className='flex justify-end mb-4'>
                      <label
                        htmlFor='invoiceDocuments'
                        className='flex items-center gap-2 px-4 py-2 border border-emerald-500 text-emerald-600 rounded-md font-medium text-sm hover:bg-emerald-50 transition cursor-pointer'
                      >
                        <BsUpload size={16} />
                        Adjuntar documento
                      </label>

                      <input
                        id='invoiceDocuments'
                        ref={invoiceFileRef}
                        type='file'
                        accept='.pdf,.png,.jpg,.jpeg'
                        multiple
                        className='hidden'
                        onChange={handleDocumentsChange}
                      />
                    </div>

                    {/* DOCUMENTOS SELECCIONADOS */}
                    {documentos.length === 0 ? (
                      <div className='text-sm text-slate-500 text-center py-4 border border-dashed border-slate-300 rounded-md'>
                        No se han adjuntado documentos.
                      </div>
                    ) : (
                      <div className='space-y-2'>
                        {documentos.map((file, index) => (
                          <div
                            key={`${file.name}-${file.lastModified}-${index}`}
                            className='flex justify-between items-center border border-slate-200 rounded-md px-3 py-2 bg-slate-50'
                          >
                            <div className='flex items-center gap-3 min-w-0'>
                              <BsPaperclip className='text-slate-500 shrink-0' />

                              <div className='min-w-0'>
                                <div className='text-sm font-medium text-slate-700 truncate'>
                                  {file.name}
                                </div>

                                <div className='text-xs text-slate-500'>
                                  {formatFileSize(file.size)}
                                </div>
                              </div>
                            </div>

                            <button
                              type='button'
                              onClick={() => deleteDocument(index)}
                              className='h-7 w-7 flex items-center justify-center text-Red7 rounded hover:bg-red-50'
                              title='Eliminar documento'
                            >
                              <BsTrash />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className='text-[11px] text-slate-500 mt-3'>
                      Formatos permitidos: PDF, PNG, JPG y JPEG.
                    </div>
                  </div>
                </div>
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
    const detractionPercent = await ApiFecthAuth(
      endPoints.mainData.detraction.percent,
      token
    )

    const tipoCambioRes = await ApiFecthAuth(
      endPoints.mainData.exchange.latest,
      token
    )

    return {
      props: {
        tipocambio: tipoCambioRes,
        detractionPercent: detractionPercent
      },
      revalidate: 3600
    }
  }
  return {
    props: {
      tipocambio: null,
      detractionPercent: null
    },
    revalidate: 3600
  }
}
