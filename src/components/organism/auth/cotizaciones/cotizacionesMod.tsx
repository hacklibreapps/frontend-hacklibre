'use client'

import { HeaderQuotationItem } from '@/components/atom/auth/cotizacion/headerQuotationItem'
import PageTitle from '@/components/atom/auth/structures/pageTitlte'
import GoBack from '@/components/atom/goback'
import PageContainer from '@/components/atom/structures/containers/pageContainer'
import PageContent from '@/components/atom/structures/containers/pageContent'
import Input from '@/components/atom/structures/input'
import Select from '@/components/atom/structures/select'
import { ToastNotification } from '@/components/atom/structures/toast'
import Formulary from '@/components/molecule/auth/structures/formulary'
import { useAuth } from '@/context/authContext'
import {
  CotizacionEditInterface,
  TipoCambioInterface
} from '@/interfaces/querys/queryInterface'
import { KeyValueInterface } from '@/interfaces/structures/keyValueInterface'
import { UUIDInterface } from '@/interfaces/structures/uuidInterface'
import { ApiFecthAuth } from '@/services/auth/axios/apiFetchAuth'
import endPoints from '@/services/auth/endPoints/endPoint'
import { prefix } from '@/services/envs/envs'
import { Required } from '@/utils/required'
import { todayDate } from '@/utils/today'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ItemCotizacion } from '@/components/molecule/auth/quotations/itemCotizacion'
import {
  CondicionesInterface,
  ItemCotizacionForm,
  ProductoInterface
} from '@/interfaces/structures/quotationsInterface'
import { CotizacionBodyInterface } from '@/interfaces/structures/bodyFormInterface'
// import { ApiPatchAuth } from '@/services/auth/axios/apiPatchAuth'
// import ResponseFromEdited from '@/utils/responseFromEdited'
import { ApiPostAuth } from '@/services/auth/axios/apiPostAuth'
import ResponseFromCreated from '@/utils/responseFromCreated'
import FormContent from '@/components/molecule/auth/structures/formContent'
import { Button } from '@/components/atom/structures/button'
import { Img } from '@/utils/img'
import { backUrl } from '@/services/envs/connectionUrl'
import { BsCartPlus } from 'react-icons/bs'
import { ToolTip } from '@/utils/toolTip'
import { ItemCondicion } from '@/components/molecule/auth/quotations/itemCondicion'
import TextArea from '@/components/atom/structures/textArea'
import { CheckForm } from '@/utils/checkForm'
import ResetForm from '@/utils/resetForm'
import { useRouter } from 'next/navigation'
import useQueryParams from '@/utils/useQueryParams'
import { formatMoney } from '@/utils/formatMoney'

interface serialNrInterface {
  serial: string
  serialNr: number
  version: number
}
interface KeyValuePrincipalInterface extends KeyValueInterface {
  principal: boolean
}

const CotizacionesMod: React.FC<UUIDInterface> = ({ uuid }) => {
  const { token, enterprise, enterpriseLogo } = useAuth()
  const queryParams = useQueryParams()
  const [option, setOption] = useState<string | null>(null)
  const [uuidQtn, setUuidQtn] = useState<string | null>(null)
  const [loadedConditions, setLoadedConditions] = useState<boolean>(false)
  useEffect(() => {
    if (queryParams) {
      setOption(queryParams.get('option'))
      setUuidQtn(queryParams.get('uuid'))
    }
  }, [queryParams])

  const router = useRouter()
  const [submitLoaded, setSubmitLoaded] = useState<boolean>(false)
  const [cotizaciones, setCotizaciones] =
    useState<CotizacionEditInterface | null>(null)
  const [formaPago, setFormaDePago] = useState<KeyValueInterface[]>([])
  const [leadTimes, setLeadTimes] = useState<KeyValueInterface[]>([])
  const [defaultConditions, setDefaultConditions] = useState<
    CondicionesInterface[]
  >([])
  const [regularConditions, setRegularConditions] = useState<
    CondicionesInterface[]
  >([])
  const [moneyDisabled, setMoneyDisabled] = useState<boolean>(false)
  const [productosQtn, setProductosQtn] = useState<ProductoInterface[]>([])
  const [condiciones, setCondiciones] = useState<CondicionesInterface[]>([])
  const [tc, setTc] = useState<TipoCambioInterface>()
  const [serialNr, setSerialNr] = useState<serialNrInterface>()
  const [noPagedClients, setNoPagedClients] = useState<KeyValueInterface[]>()
  const [noPagedMoney, setNoPagedMoney] = useState<KeyValueInterface[]>()
  const [descripcionFormaPago, setDescripcionFormaPago] = useState<string>('')
  const [formaPagoCurrent, setFormaPagoCurrent] = useState<string>('')
  const [formaPagoInicial] = useState<KeyValueInterface[]>([])
  const [formaPagoFinal] = useState<KeyValueInterface[]>([])

  const [contactsClient, setContactsClient] =
    useState<KeyValuePrincipalInterface[]>()
  const [dataEditContactsclient, setDataEditContactsclient] = useState<
    KeyValuePrincipalInterface | KeyValueInterface
  >()
  // setDataEditTiempoEntrega
  const [dataEditTiempoEntrega, setDataEditTiempoEntrega] =
    useState<KeyValueInterface>()
  // setDataEditClient
  const [dataEditClient, setDataEditClient] = useState<KeyValueInterface>()
  const [dataEditMoney, setDataEditMoney] = useState<KeyValueInterface>()
  const [dataEditFormPago, setDataEditFormPago] = useState<KeyValueInterface>()

  const primaryContact = useMemo(
    () => contactsClient?.find((c) => c.principal) ?? null,
    [contactsClient]
  )

  const [currentMoney, setCurrentMoney] = useState<KeyValueInterface | null>(
    null
  )
  const [resetNoPagedclients, setResetNoPagedclients] = useState<boolean>(false)
  const [resetMoney, setResetMoney] = useState<boolean>(false)
  const [resetFormaPago, setResetFormaPago] = useState<boolean>(false)
  const [resetTiempoEntrega, setResetTiempoEntrega] = useState<boolean>(false)
  const [resetContactclient, setResetContactclient] = useState<boolean>(false)
  const [currentTiempoEntrega, setCurrentTiempoEntrega] = useState<
    string | null
  >(null)
  const [items, setItems] = useState<ItemCotizacionForm[]>([])

  const handlerRestartResetTiempoEntrega = () => {
    if (resetTiempoEntrega) setResetTiempoEntrega(false)
  }
  const handlerRestartResetNoPagedclients = () => {
    if (resetNoPagedclients) setResetNoPagedclients(false)
  }
  const handlerRestartResetMoney = () => {
    if (resetMoney) setResetMoney(false)
  }
  const handlerRestartResetFormaPago = () => {
    if (resetFormaPago) setResetFormaPago(false)
  }
  const handlerRestartResetContactclient = () => {
    if (resetContactclient) setResetContactclient(false)
  }
  const handlerLoadMoney = async (e: string) => {
    if (e) {
      const response = await ApiFecthAuth(
        endPoints.mainData.money.retrieve(e),
        token || ''
      )
      setCurrentMoney({
        key: response.data.uuid,
        value: response.data.currency,
        attr: response.data.sign
      })
    }
  }

  useEffect(() => {
    if (items.length <= 0) {
      setMoneyDisabled(false)
    } else {
      setMoneyDisabled(true)
    }
  }, [items.length])

  const actualizarItem = (
    idx: number,
    campo: keyof ItemCotizacionForm | 'producto_uuid',
    valor: string | number | boolean | KeyValueInterface
  ) => {
    const copia = [...items]
    const it = copia[idx]
    if (!it) return

    if (campo === 'producto_uuid') {
      const prod = productosQtn.find((p) => p.uuid === valor)

      if (prod) {
        it.producto = prod
        it.nombre = prod.nombre
        it.descripcion = prod.descripcion
        it.precioUnitario = prod.precioUnitario
        it.precioUnitarioOriginal = prod.precioUnitario
        it.igvPct = prod.gravadoIgv ? prod.igvTasa : 0
        it.guardarNuevo = false
      } else {
        it.guardarNuevo = true
      }
    }
    // else if (campo ==='precioUnitario'){
    //   it.precioUnitario = Number(valor)
    //   it.igvPct = 12
    // }
    else {
      // @ts-expect-error actualización dinámica controlada
      it[campo] = valor
    }

    const cantidad = it.cantidad || 0
    const precio = it.precioUnitario || 0
    const descuentoPct = it.descuentoPct || 0
    const igvPct = it.igvPct || 18

    const factorDesc = 1 - descuentoPct / 100
    if (!it.producto?.incluyeIgv) {
      // 🟢 PRECIO SIN IGV → CALCULAR IGV
      it.subtotal = cantidad * precio * factorDesc
      it.igv = it.subtotal * (igvPct / 100)
      it.total = it.subtotal + it.igv
    } else {
      // 🔵 PRECIO CON IGV → USAR DATOS DEL SISTEMA
      const factorIgv = 1 + igvPct / 100
      const precioSinIgv = igvPct > 0 ? precio / factorIgv : precio

      it.subtotal = cantidad * precioSinIgv * factorDesc
      it.total = cantidad * precio
      it.igv = it.total - it.subtotal
    }

    setItems(copia)
  }

  const eliminarItem = (idx: number) => {
    const copia = [...items]
    copia.splice(idx, 1)
    setItems(copia)
  }

  // refs
  const serialRef = useRef<HTMLInputElement>(null)
  const serialNrRef = useRef<HTMLInputElement>(null)
  const versionNrRef = useRef<HTMLInputElement>(null)
  const paraRef = useRef<HTMLInputElement>(null)
  const contactoRef = useRef<HTMLInputElement>(null)
  const fechaRef = useRef<HTMLInputElement>(null)
  const monedaRef = useRef<HTMLInputElement>(null)
  const formaPagoRef = useRef<HTMLInputElement>(null)
  const asuntoRef = useRef<HTMLInputElement>(null)
  const formaPagoInicioRef = useRef<HTMLInputElement>(null)
  const formaPagoFinalRef = useRef<HTMLInputElement>(null)
  const tiempoEntregaRef = useRef<HTMLInputElement>(null)
  const validezOfertaRef = useRef<HTMLInputElement>(null)
  const tiempoEntregaSelectRef = useRef<HTMLInputElement>(null)
  const observacionRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getData(uuid ? uuid : uuidQtn ? uuidQtn : '', token)
        if (uuid && uuid.length > 0) {
          setCotizaciones(data.props.cotizacion)
        }
        if (uuidQtn && uuidQtn.length > 0) {
          setCotizaciones(data.props.cotizacion)
        }
        setSerialNr(data.props.serial)
        setNoPagedClients(data.props.noPagedClients)
        setNoPagedMoney(data.props.noPagedMoney)
        setProductosQtn(data.props.productosNoPaged)
        setTc(data.props.tc)
        setFormaDePago(data.props.formaPago)
        setLeadTimes(data.props.leadTimes)
        setDefaultConditions(data.props.defaultConditions)
        setRegularConditions(data.props.regularConditions)
      } catch (error) {
        ToastNotification('danger', `Ha ocurrido un error - ${error}`)
      }
    }
    fetchData()
  }, [uuid, token, enterprise, uuidQtn])

  const HandlerAddCondicion = () => {
    setCondiciones((prev) => [
      ...prev,
      {
        uuid: crypto.randomUUID(),
        titulo: '',
        contenido: '',
        porDefecto: false
      }
    ])
  }

  // Actualizar campos de una condición
  const actualizarCondicion = (
    idx: number,
    campo: keyof CondicionesInterface,
    valor: string | boolean | CondicionesInterface | null
  ) => {
    setCondiciones((prev) => {
      if (idx < 0 || idx >= prev.length) return prev
      const copia = prev.map((cond, i) =>
        i === idx ? { ...cond, [campo]: valor } : cond
      )
      return copia
    })
  }

  // Eliminar condición
  const eliminarCondicion = (idx: number) => {
    const copia = [...condiciones]
    copia.splice(idx, 1)
    setCondiciones(copia)
  }

  useEffect(() => {
    if (cotizaciones) {
      if (noPagedClients && noPagedClients.length > 0 && paraRef.current) {
        setDataEditClient({
          key: cotizaciones.client.key,
          value: cotizaciones.client.value
        })
      }

      if (contactsClient && cotizaciones.contact && contactsClient.length > 0) {
        setDataEditContactsclient({
          key: cotizaciones.contact.key,
          value: cotizaciones.contact.value
        })
      }

      if ((formaPago && cotizaciones.formaPago, formaPago.length > 0)) {
        setDataEditFormPago({
          key: cotizaciones.formaPago.key.toString(),
          value: cotizaciones.formaPago.value
        })
      }

      if (formaPagoInicioRef.current && cotizaciones.formaPagoFinal) {
        formaPagoInicioRef.current.value = String(
          Number(cotizaciones.formaPagoFinal)
        )
      }

      if (serialNrRef.current && serialNr)
        serialNrRef.current.value = serialNr.serialNr?.toString() || ''

      if (versionNrRef.current && serialNr)
        versionNrRef.current.value = serialNr.version?.toString() || ''

      if (
        noPagedMoney &&
        noPagedMoney.length > 0 &&
        monedaRef.current &&
        cotizaciones.moneda
      ) {
        setDataEditMoney({
          key: cotizaciones.moneda.key.toString(),
          value: cotizaciones.moneda.value
        })
      }

      if (observacionRef.current) {
        observacionRef.current.value = cotizaciones.observations || ''
      }
      if (formaPagoInicioRef.current) {
        formaPagoInicioRef.current.value =
          cotizaciones.formaPagoInicio.toString() || ''
      }
      if (formaPagoFinalRef.current) {
        formaPagoFinalRef.current.value =
          cotizaciones.formaPagoFinal.toString() || ''
      }
      if (tiempoEntregaRef.current) {
        tiempoEntregaRef.current.value =
          cotizaciones.tiempoEntrega.toString() || ''
      }
      if (
        leadTimes &&
        leadTimes.length > 0 &&
        tiempoEntregaSelectRef.current &&
        cotizaciones.tiempoEntregaUnidad
      ) {
        setDataEditTiempoEntrega({
          key: cotizaciones.tiempoEntregaUnidad.key.toString(),
          value: cotizaciones.tiempoEntregaUnidad.value
        })
      }
      if (asuntoRef.current) {
        asuntoRef.current.value = cotizaciones.subject || ''
      }

      if (observacionRef.current) {
        observacionRef.current.value = cotizaciones.observations || ''
      }

      const itemsMapped: ItemCotizacionForm[] = cotizaciones.items.map((it) => {
        // Buscar el producto completo si existe
        const fullProd = productosQtn.find((p) => p.uuid === it.producto?.key)
        return {
          producto: fullProd || undefined,
          nombre: fullProd ? fullProd.nombre : it.producto?.value || '',
          descripcion: it.descripcion,
          cantidad: it.cantidad,
          precioUnitario: it.precioUnitario,
          precioUnitarioOriginal: it.precioUnitario,
          descuentoPct: it.descuentoPct,
          igvPct: it.igvPct,
          subtotal: it.subtotal,
          incluyeIgv: true, // ver esta variable
          igv: it.igv,
          total: it.total,
          moneda: {
            key: it.moneda.key,
            value: it.moneda.value,
            simbol: fullProd?.moneda?.simbol || '' // si existe
          },
          guardarNuevo: false
        }
      })
      setItems(itemsMapped)

      const mapped = cotizaciones.condiciones.map((c) => ({
        uuid: crypto.randomUUID(),
        titulo: c.titulo ?? '',
        contenido: c.contenido ?? '',
        porDefecto: false
      }))
      if (!loadedConditions) {
        setCondiciones((prev) => [...prev, ...mapped])
        setLoadedConditions(true)
      }
      if (serialRef.current && serialNr && serialNr.serial) {
        serialRef.current.value = serialNr.serial.toString() || ''
      }
    } else {
      if (serialRef.current && serialNr && serialNr.serial) {
        serialRef.current.value = serialNr.serial.toString() || ''
      }
      if (monedaRef.current && noPagedMoney && noPagedMoney.length > 0) {
        if (!uuidQtn) {
          monedaRef.current.value = noPagedMoney[0].key.toString()
          setDataEditMoney(noPagedMoney[0])
        }
      }
      if (validezOfertaRef.current) {
        validezOfertaRef.current.value = '15'
      }
      if (defaultConditions.length > 0) {
        if (!uuidQtn) {
          setCondiciones(defaultConditions)
        }
      }
    }
  }, [
    cotizaciones,
    serialNr,
    contactsClient,
    primaryContact,
    noPagedMoney,
    enterprise,
    uuid,
    defaultConditions,
    option,
    noPagedClients,
    formaPago,
    leadTimes,
    productosQtn,
    uuidQtn,
    loadedConditions
  ])

  // al cambiar empresa
  useEffect(() => {
    if (paraRef.current) paraRef.current.value = ''
    if (contactoRef.current) contactoRef.current.value = ''
    setResetNoPagedclients(true)
    setItems([])
  }, [enterprise])

  const handlerChangeContact = (uuidClient: string) => {
    setDataEditContactsclient(undefined)
    setResetContactclient(true)
    if (contactoRef.current) contactoRef.current.value = ''
    const fetchData = async () => {
      const response = await ApiFecthAuth(
        `${endPoints.clients.contacts.noPagedByClient(uuidClient)}`,
        token || ''
      )
      setContactsClient(response ? response.data : [])
    }
    if (uuidClient) fetchData()
  }

  const handlerChangeFormaPagoDescription = (value: string) => {
    const selected = formaPago.find((item) => item.key === value)
    if (selected && selected.attr) {
      setDescripcionFormaPago(selected.attr)
      setFormaPagoCurrent(value)
    } else {
      setDescripcionFormaPago('Sin Descripción')
      setFormaPagoCurrent('')
    }
  }

  const handlerCurrentTiempoEntrega = () => {
    if (tiempoEntregaSelectRef.current) {
      setCurrentTiempoEntrega(tiempoEntregaSelectRef.current.value)
    }
  }

  const formData = {
    serial: {
      name: 'serial',
      id: 'serial',
      showLabel: false,
      ref: serialRef,
      required: true,
      label: 'Serial',
      tiny: true,
      readOnly: true
    },
    serialNr: {
      name: 'serialNr',
      id: 'serialNr',
      showLabel: false,
      ref: serialNrRef,
      required: true,
      label: 'Nro. Serial',
      type: 'hidden',
      tiny: true
    },
    version: {
      name: 'version',
      id: 'version',
      showLabel: false,
      ref: versionNrRef,
      required: true,
      label: 'version',
      type: 'hidden',
      tiny: true
    },
    noPagedClients: {
      name: 'enterprise',
      id: 'enterprise',
      label: 'Empresa',
      ref: paraRef,
      showLabel: false,
      data: noPagedClients,
      tiny: true,
      required: true,
      onChange: handlerChangeContact,
      editData: dataEditClient,
      resetSignal: resetNoPagedclients,
      resetHandler: handlerRestartResetNoPagedclients,
      noDeleteOption: true
    },
    contactClient: {
      name: 'contactClient',
      id: 'contactClient',
      label: 'Cliente',
      ref: contactoRef,
      showLabel: false,
      data: contactsClient,
      tiny: true,
      required: true,
      editData: dataEditContactsclient,
      resetSignal: resetContactclient,
      resetHandler: handlerRestartResetContactclient,
      noDeleteOption: true
    },
    fecha: {
      name: 'fechaPecosaInicio',
      id: 'fechaPecosaInicio',
      showLabel: false,
      label: 'Fecha Cotizacion',
      type: 'date',
      ref: fechaRef,
      required: true,
      tiny: true,
      value: todayDate()
    },
    money: {
      name: 'money',
      id: 'money',
      label: 'Moneda',
      ref: monedaRef,
      showLabel: false,
      data: noPagedMoney,
      tiny: true,
      required: true,
      onChange: handlerLoadMoney,
      noDeleteOption: true,
      readOnly: moneyDisabled,
      editData: dataEditMoney,
      resetSignal: resetMoney,
      resetHandler: handlerRestartResetMoney
    },
    formaPago: {
      name: 'formaPago',
      id: 'formaPago',
      label: 'Forma de pago',
      ref: formaPagoRef,
      showLabel: false,
      data: formaPago,
      tiny: true,
      required: true,
      editData: dataEditFormPago,
      resetSignal: resetFormaPago,
      resetHandler: handlerRestartResetFormaPago,
      onChange: handlerChangeFormaPagoDescription,
      noDeleteOption: true
    },
    observacion: {
      name: 'observacion',
      id: 'observacion',
      label: 'Observaciones',
      showLabel: true,
      ref: observacionRef,
      required: false,
      row: 5,
      minLen: 1,
      maxLen: 10000,
      tiny: true
    },
    // Nuevos campos añadidos
    forma_pago_inicio: {
      name: 'forma_pago_inicio',
      id: 'forma_pago_inicio',
      showLabel: false,
      label: 'Forma de Pago (Inicio)',
      ref: formaPagoInicioRef,
      required: false,
      tiny: true,
      data: formaPagoInicial
    },

    forma_pago_final: {
      name: 'forma_pago_final',
      id: 'forma_pago_final',
      showLabel: false,
      label: 'Forma de Pago (Final)',
      ref: formaPagoFinalRef,
      required: false,
      type: 'select',
      tiny: true,
      data: formaPagoFinal
    },

    // Campo de Tiempo de Entrega (número y unidad)
    tiempo_entrega: {
      name: 'tiempo_entrega',
      id: 'tiempo_entrega',
      showLabel: false,
      label: '',
      ref: tiempoEntregaRef,
      required: true,
      tiny: true
    },
    validez_oferta: {
      name: 'validez_oferta',
      id: 'validez_oferta',
      showLabel: false,
      label: '',
      ref: validezOfertaRef,
      required: true,
      type: 'number',
      tiny: true
    },

    // Unidad de Tiempo de Entrega
    tiempo_entrega_select: {
      name: 'tiempo_entrega_select',
      id: 'tiempo_entrega_select',
      showLabel: false,
      label: '',
      ref: tiempoEntregaSelectRef,
      required: true,
      tiny: true,
      data: leadTimes,
      onClick: handlerCurrentTiempoEntrega,
      editData: dataEditTiempoEntrega,
      resetSignal: resetTiempoEntrega,
      resetHandler: handlerRestartResetTiempoEntrega
    },

    asunto: {
      name: 'asunto',
      id: 'asunto',
      showLabel: false,
      label: 'Asunto',
      ref: asuntoRef,
      required: true,
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

  const n = (v: unknown): number => {
    const num = Number(v)
    return isNaN(num) ? 0 : num
  }
  const totals = useMemo(() => {
    const subtotal = items.reduce((acc, it) => acc + n(it.subtotal), 0)

    const total = items.reduce((acc, it) => acc + n(it.total), 0)

    const igv = total - subtotal

    const bruto = items.reduce(
      (acc, it) => acc + n(it.cantidad) * n(it.precioUnitarioOriginal),
      0
    )

    const netoSinDesc = items.reduce(
      (acc, it) => acc + n(it.cantidad) * n(it.precioUnitario),
      0
    )

    const descuento = Math.max(0, bruto - netoSinDesc)

    return {
      subtotal,
      igv,
      descuento,
      total
    }
  }, [items])

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const fields = [
      { ref: paraRef, message: 'Debe seleccionar la empresa' },
      {
        ref: contactoRef,
        message: 'Debe seleccionar el contacto de la empresa'
      },
      { ref: fechaRef, message: 'Debe ingresar la fecha de la cotización' },
      {
        ref: monedaRef,
        message: 'Debe seleccionar la moneda a usar de la cotización'
      },
      { ref: formaPagoRef, message: 'Debe seleccionar la forma de pago' },
      {
        ref: validezOfertaRef,
        message: 'Debe Ingresar la validez de la oferta'
      },
      { ref: tiempoEntregaRef, message: 'Debe ingresar el tiempo de entrega' },
      {
        ref: tiempoEntregaSelectRef,
        message: 'Debe seleccionar el tiempo de entrega'
      },
      { ref: asuntoRef, message: 'Debe ingresar el asunto de la cotización' }
    ]

    const resetFields = [
      {
        refs: [
          paraRef,
          contactoRef,
          formaPagoRef,
          validezOfertaRef,
          tiempoEntregaRef,
          tiempoEntregaSelectRef,
          asuntoRef,
          fechaRef,
          monedaRef,
          observacionRef
        ],
        resetValues: []
      }
    ]

    const resetAllFields = ResetForm({ resetFields })

    const handlerResetfield = async () => {
      if (!uuidQtn) {
        resetAllFields()
        setResetContactclient(true)
        setResetNoPagedclients(true)
        setResetFormaPago(true)
        if (fechaRef.current) {
          fechaRef.current.value = todayDate()
        }
        setResetTiempoEntrega(true)
        setItems([])
        setCondiciones([])
        if (defaultConditions.length > 0) {
          if (!uuidQtn) {
            setCondiciones(defaultConditions)
          }
        }
        try {
          const response = await ApiFecthAuth(
            endPoints.quotations.nextSerial,
            token || ''
          )
          if (response?.data) {
            setSerialNr(response.data)

            if (serialRef.current && response.data.serial)
              serialRef.current.value = response.data.serial.toString()
            if (serialNrRef.current && response.data.serialNr)
              serialNrRef.current.value = response.data.serialNr.toString()
            if (versionNrRef.current && response.data.version)
              versionNrRef.current.value = response.data.version.toString()
          }
        } catch (error) {
          ToastNotification(
            'warning',
            `No se pudo obtener el siguiente número de cotización, ${error}`
          )
        }
      }
    }

    if (!CheckForm(fields)) return
    if (formaPagoCurrent === 'CRED') {
      if (formaPagoInicioRef.current?.value.trim() === '') {
        ToastNotification('warning', 'Debe ingresar los días de crédito')
        return
      }
    } else if (formaPagoCurrent === 'ADEL') {
      if (formaPagoInicioRef.current?.value.trim() === '') {
        ToastNotification('warning', 'Debe ingresar el porcentaje inicial')
        return
      }
      if (formaPagoFinalRef.current?.value.trim() === '') {
        ToastNotification('warning', 'Debe ingresar el porcentaje final')
        return
      }
    } else if (formaPagoCurrent === 'CUOT') {
      if (formaPagoInicioRef.current?.value.trim() === '') {
        ToastNotification('warning', 'Debe ingresar la cantidad de cuotas')
        return
      }
    }

    if (items.length <= 0) {
      ToastNotification('warning', 'Debe ingresar al menos 1 producto')
      return
    }
    for (const [i, item] of items.entries()) {
      const camposIncompletos: string[] = []

      if (!item.nombre?.trim()) camposIncompletos.push('nombre')
      if (!item.descripcion?.trim()) camposIncompletos.push('descripción')
      if (!item.cantidad || item.cantidad <= 0)
        camposIncompletos.push('cantidad')
      if (!item.precioUnitario || item.precioUnitario <= 0)
        camposIncompletos.push('precio unitario')
      if (!item.subtotal || item.subtotal <= 0)
        camposIncompletos.push('subtotal')
      if (item.igv === undefined || item.igv < 0) camposIncompletos.push('IGV')
      if (!item.total || item.total <= 0) camposIncompletos.push('total')
      if (!item.moneda?.key) camposIncompletos.push('moneda')

      if (camposIncompletos.length > 0) {
        ToastNotification(
          'warning',
          `El producto #${
            i + 1
          } tiene campos incompletos: ${camposIncompletos.join(', ')}`
        )
        return
      }
    }
    if (condiciones.length <= 0) {
      ToastNotification('warning', 'Debe ingresar al menos 1 condición')
      return
    }
    if (condiciones.length <= 0) {
      ToastNotification('warning', 'Debe ingresar al menos 1 condición')
      return
    }

    // 🚨 Validar que todas las condiciones estén completas
    for (const [i, cond] of condiciones.entries()) {
      const camposIncompletos: string[] = []

      if (!cond.titulo?.trim()) camposIncompletos.push('título')
      if (!cond.contenido?.trim()) camposIncompletos.push('contenido')

      if (camposIncompletos.length > 0) {
        ToastNotification(
          'warning',
          `La condición #${
            i + 1
          } tiene campos incompletos: ${camposIncompletos.join(', ')}`
        )
        return
      }
    }

    const body: CotizacionBodyInterface = {
      quotation_nr: serialNr ? serialNr.serialNr : 0,
      quotation_version: serialNr ? serialNr.version : 0,
      related_quotation: uuidQtn ? uuidQtn : uuid ? uuid : '',
      client: paraRef.current ? paraRef.current.value : '',
      contact: contactoRef.current ? contactoRef.current.value : '',
      subject: asuntoRef.current ? asuntoRef.current.value : '',
      fecha_emision: fechaRef.current ? fechaRef.current.value : '',
      reopen: uuidQtn ? true : false,
      validez_dias: validezOfertaRef.current
        ? Number(validezOfertaRef.current.value)
        : 0,
      tiempo_entrega_unidad: tiempoEntregaSelectRef.current
        ? tiempoEntregaSelectRef.current.value
        : '',
      tiempo_entrega: tiempoEntregaRef.current
        ? tiempoEntregaRef.current.value
        : "",
      forma_pago: formaPagoRef.current ? formaPagoRef.current.value : '',
      forma_pago_descripcion: formaPagoRef.current
        ? formaPagoRef.current.value
        : '',
      forma_pago_inicio: formaPagoInicioRef.current
        ? Number(formaPagoInicioRef.current.value)
        : 0,
      forma_pago_final: formaPagoFinalRef.current
        ? Number(formaPagoFinalRef.current.value)
        : 0,
      forma_pago_porcentaje: formaPagoCurrent === 'ADEL' ? true : false,
      moneda: monedaRef.current ? monedaRef.current.value : '',
      tipo_cambio: Number(tc?.venta),
      subtotal: totals.subtotal,
      total_igv: totals.igv,
      total_descuento: totals.descuento,
      total: totals.total,
      observations: observacionRef.current ? observacionRef.current.value : '',
      status: 'DRAFT',
      items: items.map((c, i) => ({
        producto: c.producto ? c.producto.uuid : null,
        nombre: c.nombre ? c.nombre : '',
        descripcion: c.descripcion,
        cantidad: c.cantidad,
        precio_unitario: c.precioUnitario,
        precio_venta: c.precioUnitario,
        descuento_pct: c.descuentoPct,
        igv_pct: c.igvPct,
        orden: i + 1,
        subtotal: c.subtotal,
        igv: c.igv,
        total: c.total,
        guardar_nuevo: c.guardarNuevo ? true : false,
        moneda: monedaRef.current ? monedaRef.current.value : ''
      })),
      condiciones: condiciones.map((c, i) => ({
        condicion: c.condicionSeleccionada
          ? c.condicionSeleccionada.uuid
          : null,
        titulo: c.titulo,
        contenido: c.contenido,
        por_defecto: c.porDefecto,
        orden: i + 1,
        guardar_nuevo: c.guardarNuevo ? true : false
      }))
    }
    try {
      setSubmitLoaded(true)
      const endPoint = uuid
        ? endPoints.quotations.create
        : endPoints.quotations.create

      const response = await ApiPostAuth<typeof body, { uuid: string }>(
        endPoint,
        token || '',
        body
      )

      if (response.success) {
        ResponseFromCreated({
          response,
          successMessage: uuidQtn
            ? 'Cotización regenerada SATISFACTORIAMENTE'
            : 'Cotización registrada SATISFACTORIAMENTE.',
          handlerResetfield,
          handlerResponseData: () => {
            router.push(`/auth/cotizaciones/${response.data.uuid ?? ''}`)
          }
        })
      } else {
        ToastNotification('danger', response.data.message as string)
      }
      console.log('body: ', body, enterprise)

      // if (uuid) {
      //   const response = await ApiPatchAuth(endPoint, token || '', body)
      //   ResponseFromEdited({
      //     response,
      //     returnSuccess: `/cotizaciones?t=s&m=edit`
      //   })
      // } else {
      //   const response = await ApiPostAuth<typeof body, { uuid: string }>(
      //     endPoint,
      //     token || '',
      //     body
      //   )
      //   if (response.success) {
      //     ResponseFromCreated({
      //       response,
      //       successMessage: uuidQtn
      //         ? 'Cotización regenerada SATISFACTORIAMENTE'
      //         : 'Cotización registrada SATISFACTORIAMENTE.',
      //       handlerResetfield,
      //       handlerResponseData: () => {
      //         if (!uuid) {
      //           router.push(`/auth/cotizaciones/${response.data.uuid ?? ''}`) //
      //         }
      //       }
      //     })
      //   } else {
      //     ToastNotification('danger', response.data.message as string)
      //   }
      // }
    } catch (error) {
      ToastNotification('danger', `No se pudo guardar la cotización - ${error}`)
    } finally {
      setSubmitLoaded(false)
    }
  }

  const HandlerAddItems = useCallback(() => {
    setItems((prev) => [
      ...prev,
      {
        nombre: '',
        descripcion: '',
        cantidad: 1,
        precioUnitario: 0,
        precioUnitarioOriginal: 0,
        descuentoPct: 0,
        igvPct: 0,
        subtotal: 0,
        igv: 0,
        total: 0,
        incluyeIgv: false,
        moneda: currentMoney
          ? {
              key: currentMoney.key as string,
              value: currentMoney.value,
              simbol: currentMoney.attr ? currentMoney.attr : ''
            }
          : { key: '', value: '', simbol: '' }
      }
    ])
  }, [currentMoney])

  return (
    <PageContainer>
      <PageTitle
        description={uuid ? 'Editar Cotización' : 'Nueva Cotización'}
      />
      <GoBack enlace={`${prefix}/cotizaciones/`} />

      <PageContent>
        <Formulary onSubmit={onSubmit}>
          <div className='mx-auto w-full max-w-[300mm] bg-white rounded-xl shadow p-6 md:p-10 print:shadow-none print:rounded-none print:p-0'>
            <div className='w-full flex flex-col md:flex-row justify-center md:justify-start items-center md:items-start'>
              <div className='order-2 md:order-1 w-1/2 flex flex-col items-center md:items-start'>
                <div className='w-auto text-center'>
                  <p className='text-2xl font-bold uppercase'>Cotización</p>
                  <Input data={formData.serial} />
                  <p className='text-center p-0 m-0 text-xs'>
                    (Número referencial)
                  </p>
                  <div className='absolute inset-0 opacity-0 pointer-events-none'>
                    <Input data={formData.serialNr} />
                    <Input data={formData.version} />
                  </div>
                </div>
              </div>
              <div className='order-1 pb-3 md:pb-0 md:order-2 w-1/2 flex flex-col justify-center md:justify-start items-center md:items-end'>
                {enterpriseLogo ? (
                  <Img
                    className='h-20 w-auto'
                    src={`${backUrl}${enterpriseLogo}`}
                  />
                ) : null}
              </div>
            </div>

            <div className='w-full flex flex-col md:flex-row pt-5 justify-start items-start'>
              <div className='w-full md:w-1/2 flex flex-col items-start'>
                <div className='w-full flex flex-col justify-start items-start'>
                  <HeaderQuotationItem
                    title={
                      <>
                        Para
                        <Required data={formData.noPagedClients.required} />:
                      </>
                    }
                    value={<Select data={formData.noPagedClients} />}
                  />
                  <HeaderQuotationItem
                    title={
                      <>
                        Atención
                        <Required data={formData.contactClient.required} />:
                      </>
                    }
                    value={<Select data={formData.contactClient} />}
                  />
                </div>
              </div>
              <div className='w-full md:w-1/2 flex flex-col'>
                <div className='w-full flex flex-col justify-start md:justify-end items-start md:items-end'>
                  <HeaderQuotationItem
                    toRight
                    noSeparator
                    title={
                      <>
                        Fecha
                        <Required data={formData.fecha.required} />:
                      </>
                    }
                    value={<Input data={formData.fecha} />}
                  />
                  <HeaderQuotationItem
                    toRight
                    noSeparator
                    title={
                      <>
                        Moneda
                        <Required data={formData.money.required} />:
                      </>
                    }
                    value={<Select data={formData.money} />}
                  />
                </div>
              </div>
            </div>

            <div className='w-full flex flex-col md:flex-row justify-start items-start'>
              <div className='w-full md:w-1/2 flex flex-col items-start'>
                <div className='w-full flex flex-col justify-start items-start'>
                  <HeaderQuotationItem
                    title={
                      <>
                        Forma de Pago
                        <Required data={formData.formaPago.required} />:
                      </>
                    }
                    value={
                      <ToolTip
                        content={descripcionFormaPago}
                        place='right'
                        time={500}
                        className='w-full'
                      >
                        <Select data={formData.formaPago} />
                      </ToolTip>
                    }
                  />
                </div>
              </div>
            </div>
            {formaPagoCurrent.length > 0 ? (
              <div className='w-full flex flex-col md:flex-row justify-start items-start'>
                <div
                  className={`w-full ${
                    formaPagoCurrent !== 'ADEL' ? ' md:w-1/2 ' : ''
                  } flex flex-col items-start`}
                >
                  <div className='w-full flex flex-row justify-start items-start'>
                    {['CRED', 'ADEL', 'CUOT'].includes(formaPagoCurrent) ? (
                      <HeaderQuotationItem
                        title={
                          <>
                            {formaPagoCurrent === 'CRED'
                              ? 'Días de crédito'
                              : formaPagoCurrent === 'ADEL'
                                ? 'Porcentaje Inicial'
                                : formaPagoCurrent === 'CUOT'
                                  ? 'Cantidad de cuotas'
                                  : ''}
                            <Required
                              data={formData.forma_pago_inicio.required}
                            />
                            :
                          </>
                        }
                        value={<Input data={formData.forma_pago_inicio} />}
                      />
                    ) : null}
                    {formaPagoCurrent === 'ADEL' ? (
                      <HeaderQuotationItem
                        title={
                          <span className='pl-3'>
                            Porcentaje Final
                            <Required
                              data={formData.forma_pago_final.required}
                            />
                            :
                          </span>
                        }
                        value={<Input data={formData.forma_pago_final} />}
                      />
                    ) : null}
                  </div>
                </div>
              </div>
            ) : null}
            <div className='w-full flex flex-col md:flex-row justify-start items-start'>
              <div className='w-full md:w-1/2 flex flex-col items-start'>
                <div className='w-full flex flex-col justify-start items-start'>
                  <HeaderQuotationItem
                    title={
                      <>
                        Validez de oferta
                        <Required data={formData.validez_oferta.required} />:
                      </>
                    }
                    value={
                      <div className='flex flex-row justify-center items-center space-x-4'>
                        <div className='w-1/2 sm:w-4/12'>
                          <Input data={formData.validez_oferta} />
                        </div>
                        <div className='w-1/2 sm:w-8/12 font-normal'>Día/s</div>
                      </div>
                    }
                  />
                  <HeaderQuotationItem
                    title={
                      <>
                        Tiempo de Entrega
                        <Required data={formData.tiempo_entrega.required} />:
                      </>
                    }
                    value={
                      <div
                        className={`flex ${currentTiempoEntrega === 'C' ? 'flex-col' : 'flex-row space-x-4'}  justify-center items-center  w-full`}
                      >
                        <div
                          className={` ${currentTiempoEntrega !== 'C' ? 'sm:w-4/12 xl:w-3/12 w-1/2' : 'w-full'} `}
                        >
                          <Input data={formData.tiempo_entrega} />
                        </div>
                        <div
                          className={`${currentTiempoEntrega !== 'C' ? 'sm:w-8/12 xl:w-9/12 w-1/2' : 'w-full'} `}
                        >
                          <Select data={formData.tiempo_entrega_select} />
                        </div>
                      </div>
                    }
                  />
                </div>
              </div>
            </div>

            <div className='w-full flex flex-col justify-start items-start'>
              <div className='w-full flex flex-col justify-start items-start'>
                <HeaderQuotationItem
                  title={
                    <>
                      Asunto/Servicio
                      <Required data={formData.asunto.required} />:
                    </>
                  }
                  noSeparator
                  wSeparator={[
                    'w-1/2 sm:w-4/12 md:w-3/12 xl:w-2/12',
                    'w-1/2 sm:w-8/12 md:w-9/12 xl:w-10/12'
                  ]}
                  value={<Input data={formData.asunto} />}
                />
              </div>
            </div>

            <div className='w-full mt-5'>
              <p className='font-bold text-md uppercase'>PRODUCTOS</p>
              <div className='w-full border border-Greys rounded-xl'>
                <div className='flex flex-row border-b border-Greys items-center justify-between bg-Greys/20'>
                  <p className='p-3 font-medium'>Ítem</p>
                  <p className='p-3 font-medium'>Importe</p>
                </div>
                {items.map((it, idx) =>
                  tc ? (
                    <ItemCotizacion
                      it={it}
                      idx={idx}
                      actualizarItem={actualizarItem}
                      key={idx}
                      productosQtn={productosQtn}
                      eliminarItem={eliminarItem}
                      currentMoney={currentMoney}
                      tc={tc}
                      uuid={uuid}
                    />
                  ) : null
                )}

                <div className='w-full border-y border-Greys px-3 mt-3 flex flex-row justify-center items-center bg-Greys/20'>
                  <div className='w-1/3 py-2 text-center'>
                    <span className='font-bold'>Subtotal: </span>
                    <span className='font-medium'>
                      {totals
                        ? formatMoney(totals.subtotal, currentMoney?.attr)
                        : '0.00'}
                    </span>
                  </div>
                  <div className='w-1/3 py-2 text-center'>
                    <span className='font-bold'>IGV (18%): </span>
                    <span className='font-medium'>
                      {totals
                        ? formatMoney(totals.igv, currentMoney?.attr)
                        : '0.00'}
                    </span>
                  </div>
                  <div className='w-1/3 py-2 text-center'>
                    <span className='font-bold'>Total: </span>
                    <span className='font-medium'>
                      {totals && totals.total
                        ? formatMoney(totals.total, currentMoney?.attr)
                        : '0.00'}
                    </span>
                  </div>
                </div>

                <div className='flex flex-row justify-start items-center'>
                  <div
                    className='p-3 w-auto flex flex-row justify-center items-center px-2 rounded-lg cursor-pointer hover:font-medium text-Cian8 hover:underline'
                    onClick={HandlerAddItems}
                  >
                    <BsCartPlus size={18} />

                    <p className='pl-2 lg:pl-1'>Agregar Producto</p>
                  </div>
                </div>
              </div>
            </div>
            <div className='w-full mt-8'>
              <p className='font-bold text-md uppercase'>CONDICIONES</p>
              <div className='w-full border border-Greys rounded-xl'>
                <div className='flex flex-row border-b border-Greys items-center justify-between bg-Greys/20'>
                  <p className='p-3 font-medium w-3/12'>Título</p>
                  <p className='p-3 font-medium w-8/12'>Contenido</p>
                  <p className='p-3 font-medium w-1/12 text-center'>Acción</p>
                </div>

                {condiciones.map((cond, idx) => (
                  <ItemCondicion
                    key={cond.uuid}
                    cond={cond}
                    idx={idx}
                    actualizarCondicion={actualizarCondicion}
                    eliminarCondicion={eliminarCondicion}
                    condicionesOptions={regularConditions}
                  />
                ))}

                <div className='flex flex-row justify-start items-center'>
                  <div
                    className='p-3 w-auto flex flex-row justify-center items-center px-2 rounded-lg cursor-pointer hover:font-medium text-Cian8 hover:underline'
                    onClick={HandlerAddCondicion}
                  >
                    <BsCartPlus size={18} />
                    <p className='pl-2 lg:pl-1'>Agregar Condición</p>
                  </div>
                </div>
              </div>
            </div>
            <div className='w-full mt-8'>
              <TextArea data={formData.observacion} />
            </div>
            {/* Botón */}
            <FormContent
              className='w-full'
              classNameInter='flex flex-row justify-center items-center'
            >
              <div className='w-full xl:w-1/3 pt-5'>
                <Button data={formData.submit} />
              </div>
            </FormContent>
          </div>
        </Formulary>
      </PageContent>
    </PageContainer>
  )
}

export default CotizacionesMod

async function getData(uuid: string | undefined, token: string | null) {
  if (token) {
    const cotizacion =
      uuid && uuid.length > 0
        ? await ApiFecthAuth(endPoints.quotations.retrieve(uuid, 'edit'), token)
        : null

    const serial = uuid
      ? await ApiFecthAuth(endPoints.quotations.nextSerialUuid(uuid), token)
      : await ApiFecthAuth(endPoints.quotations.nextSerial, token)

    const noClients = await ApiFecthAuth(endPoints.clients.NoPagedList, token)
    const npMoney = await ApiFecthAuth(endPoints.mainData.money.noPaged, token)
    const productosNoPaged = await ApiFecthAuth(
      endPoints.productos.noPaged,
      token
    )
    const tc = await ApiFecthAuth(
      endPoints.mainData.exchange.latest,
      token ?? ''
    )
    const formaPago = await ApiFecthAuth(
      endPoints.quotations.paymentMethod,
      token ?? ''
    )
    const leadTimes = await ApiFecthAuth(
      endPoints.quotations.leadTimes,
      token ?? ''
    )
    const defaultConditions = await ApiFecthAuth(
      endPoints.condiciones.default,
      token ?? ''
    )
    const regularConditions = await ApiFecthAuth(
      endPoints.condiciones.listNoPaged('por_defecto=false'),
      token ?? ''
    )
    return {
      props: {
        cotizacion: cotizacion ? cotizacion.data : null,
        serial: serial ? serial.data : null,
        noPagedClients: noClients ? noClients.data : null,
        noPagedMoney: npMoney ? npMoney.data : null,
        productosNoPaged: productosNoPaged ? productosNoPaged.data : null,
        tc: tc ? tc.data : null,
        formaPago: tc ? formaPago.data : null,
        leadTimes: tc ? leadTimes.data : null,
        defaultConditions: defaultConditions.data,
        regularConditions: regularConditions.data
      },
      revalidate: 3600
    }
  }
  return {
    props: {
      cotizacion: null,
      serial: null,
      noPagedClients: null,
      noPagedMoney: null,
      productosNoPaged: null,
      tc: null,
      formaPago: null,
      leadTimes: null,
      defaultConditions: null,
      regularConditions: null
    },
    revalidate: 3600
  }
}
