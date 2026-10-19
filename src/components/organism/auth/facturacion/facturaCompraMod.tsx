'use client'

import React, { useEffect, useRef, useState } from 'react'
import PageContainer from '@/components/atom/structures/containers/pageContainer'
import PageTitle from '@/components/atom/auth/structures/pageTitlte'
import PageContent from '@/components/atom/structures/containers/pageContent'
import Formulary from '@/components/molecule/auth/structures/formulary'
import FormContainer from '@/components/molecule/auth/structures/formContainer'
import FormContent from '@/components/molecule/auth/structures/formContent'
import GoBack from '@/components/atom/goback'
import Input from '@/components/atom/structures/input'
import Select from '@/components/atom/structures/select'
import { Button } from '@/components/atom/structures/button'
import { prefix } from '@/services/envs/envs'
import ResetForm from '@/utils/resetForm'
import endPoints from '@/services/auth/endPoints/endPoint'
import { UUIDInterface } from '@/interfaces/structures/uuidInterface'
import { useAuth } from '@/context/authContext'
import ResponseFromCreated from '@/utils/responseFromCreated'
import { ToastNotification } from '@/components/atom/structures/toast'
import { ApiPostAuth } from '@/services/auth/axios/apiPostAuth'
// import { ApiFecthAuth } from '@/services/auth/axios/apiFetchAuth'
import { CheckForm } from '@/utils/checkForm'

import { BsPaperclip, BsTrash, BsUpload } from 'react-icons/bs'
import { Hr } from '@/utils/hr'

import { FacturaCompraItemInterface } from '@/interfaces/structures/bodyFormInterface'
import { KeyValueInterface } from '@/interfaces/structures/keyValueInterface'
import { isoToDMY } from '@/modules/invoice/utils'

import { useFacturaCompraCalc } from '@/modules/invoice/useFacturaCompraCalc'

import FacturaCompraItems from '@/components/molecule/invoices/items/facturaCompraItems'
import { ApiFecthAuth } from '@/services/auth/axios/apiFetchAuth'

/* ============================================================
   HELPERS DE FECHA
============================================================ */

const formatDate = (date: Date): string => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}
/* ============================================================
   COMPONENTE
============================================================ */

const FacturaCompraMod: React.FC<UUIDInterface> = ({ uuid }) => {
  const { token, enterpriseName, ruc, address } = useAuth()

  const [submitLoaded, setSubmitLoaded] = useState(false)
  const [loadingProveedor, setLoadingProveedor] = useState(false)
  const [emisorHeader, setEmisorHeader] = useState({
    ruc: '',
    razonSocial: '',
    direccion: ''
  })

  const [proveedorVersion, setProveedorVersion] = useState(0)

  const [lastRucProveedorSearched, setLastRucProveedorSearched] =
    useState<string>('')
  /* ============================================================
     ITEMS
  ============================================================ */

  const [items, setItems] = useState<FacturaCompraItemInterface[]>([
    {
      cantidad: 1,
      unidad_medida: '',
      descripcion: '',
      valor_unitario: '0.00',
      icbper: '0.00'
    }
  ])

  /* ============================================================
     MONEDA
  ============================================================ */

  const [moneda, setMoneda] = useState<'PEN' | 'USD'>('PEN')
  const [moneyList, setMoneyList] = useState<KeyValueInterface[]>([])

  const [unidadMedidaList, setUnidadMedidaList] = useState<KeyValueInterface[]>(
    []
  )

  const [tipoDePago, setTipoDePago] = useState<'CONT' | 'CRED'>('CONT')

  /* ============================================================
     REFS
  ============================================================ */

  // Comprobante
  const serieRef = useRef<HTMLInputElement>(null)
  const numeroRef = useRef<HTMLInputElement>(null)
  const formaPagoRef = useRef<HTMLInputElement>(null)
  const monedaRef = useRef<HTMLInputElement>(null)

  // Fechas
  const fechaEmisionRef = useRef<HTMLInputElement>(null)

  // Emisor / proveedor
  const rucEmisorRef = useRef<HTMLInputElement>(null)
  const razonSocialRef = useRef<HTMLInputElement>(null)
  const direccionEmisorRef = useRef<HTMLInputElement>(null)

  // Receptor
  const nroDocReceptorRef = useRef<HTMLInputElement>(null)
  const razonSocialReceptorRef = useRef<HTMLInputElement>(null)
  const direccionReceptorRef = useRef<HTMLInputElement>(null)

  // Totales
  const subtotalRef = useRef<HTMLInputElement>(null)
  const valorVentaRef = useRef<HTMLInputElement>(null)
  const igvRef = useRef<HTMLInputElement>(null)
  const icbperTotalRef = useRef<HTMLInputElement>(null)
  const operacionesGratuitasRef = useRef<HTMLInputElement>(null)
  const importeTotalRef = useRef<HTMLInputElement>(null)
  const importeLetrasRef = useRef<HTMLInputElement>(null)

  // Estado y archivo
  const estadoRef = useRef<HTMLInputElement>(null)
  const invoiceFileRef = useRef<HTMLInputElement>(null)
  const [documentos, setDocumentos] = useState<File[]>([])

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

  const buscarProveedorPorRuc = async (rucProveedor: string) => {
    if (!token) return
    if (rucProveedor.length !== 11) return
    if (rucProveedor === lastRucProveedorSearched) return

    try {
      setLoadingProveedor(true)

      const response = await ApiFecthAuth(
        `${endPoints.clients.byRuc(rucProveedor)}&client_type=provider`,
        token
      )

      console.log('[PROVEEDOR] response completa:', response)
      console.log('[PROVEEDOR] response.data:', response.data)

      const proveedor = response.data

      console.log('[PROVEEDOR] proveedor final:', proveedor)

      if (!proveedor?.ruc) {
        setLastRucProveedorSearched('')

        ToastNotification(
          'warning',
          'La respuesta no contiene los datos del proveedor.'
        )

        return
      }

      const razonSocial = proveedor.completeCompanyName ?? ''
      const direccion = proveedor.address ?? ''

      console.log('[PROVEEDOR] razón social:', razonSocial)
      console.log('[PROVEEDOR] dirección:', direccion)

      if (razonSocialRef.current) {
        razonSocialRef.current.value = razonSocial
      }

      if (direccionEmisorRef.current) {
        direccionEmisorRef.current.value = direccion
      }

      setEmisorHeader({
        ruc: proveedor.ruc,
        razonSocial,
        direccion
      })

      setProveedorVersion((prev) => prev + 1)
      setLastRucProveedorSearched(rucProveedor)

      ToastNotification('success', 'Proveedor encontrado.')
    } catch (error) {
      console.error('[PROVEEDOR] error:', error)

      setLastRucProveedorSearched('')

      if (razonSocialRef.current) {
        razonSocialRef.current.value = ''
      }

      if (direccionEmisorRef.current) {
        direccionEmisorRef.current.value = ''
      }

      setEmisorHeader({
        ruc: rucProveedor,
        razonSocial: '',
        direccion: ''
      })

      ToastNotification('warning', 'Proveedor no encontrado.')
    } finally {
      setLoadingProveedor(false)
    }
  }

  /* ============================================================
     FECHAS
  ============================================================ */

  const today = new Date()

  const twoDaysAgo = new Date(today)
  twoDaysAgo.setDate(twoDaysAgo.getDate() - 2)

  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  const minDate = formatDate(twoDaysAgo)
  const maxDate = formatDate(today)

  /*
   * Fecha inicial:
   *
   * emisión = hoy
   * vencimiento = mañana
   */
  useEffect(() => {
    if (uuid) return

    const now = new Date()
    const emission = formatDate(now)

    if (fechaEmisionRef.current) {
      fechaEmisionRef.current.value = emission
    }
  }, [uuid])

  /* ============================================================
     TÍTULO DE SECCIÓN
  ============================================================ */

  // const SectionTitle = ({ title }: { title: string }) => (
  //   <h3 className='text-sm font-semibold text-slate-600 uppercase tracking-wide border-b border-slate-200 pb-2 mb-4'>
  //     {title}
  //   </h3>
  // )

  /* ============================================================
     CÁLCULOS
  ============================================================ */

  const { base, igv, icbper, total, letras } = useFacturaCompraCalc(
    items,
    moneda
  )

  /*
   * Actualizar campos calculados
   */
  useEffect(() => {
    if (subtotalRef.current) {
      subtotalRef.current.value = base.toFixed(2)
    }

    if (valorVentaRef.current) {
      valorVentaRef.current.value = base.toFixed(2)
    }

    if (igvRef.current) {
      igvRef.current.value = igv.toFixed(2)
    }

    if (icbperTotalRef.current) {
      icbperTotalRef.current.value = icbper.toFixed(2)
    }

    if (operacionesGratuitasRef.current) {
      operacionesGratuitasRef.current.value = '0.00'
    }

    if (importeTotalRef.current) {
      importeTotalRef.current.value = total.toFixed(2)
    }

    if (importeLetrasRef.current) {
      importeLetrasRef.current.value = letras
    }
  }, [base, igv, icbper, total, letras])

  /* ============================================================
     FORM DATA
  ============================================================ */

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
    const fetchUnidadMedida = async () => {
      if (!token) return

      try {
        const res = await ApiFecthAuth(
          endPoints.mainData.unidadMedida.noPaged,
          token
        )

        setUnidadMedidaList(res?.data || [])
      } catch (error) {
        console.error('Error cargando unidades de medida', error)
        ToastNotification('danger', 'Error cargando unidades de medida')
      }
    }

    fetchUnidadMedida()
  }, [token])

  const formData = {
    /* ========================================================
       IDENTIFICACIÓN
    ======================================================== */

    serie: {
      label: 'Serie',
      showLabel: true,
      name: 'serie',
      id: 'serie',
      ref: serieRef,
      required: true,
      tiny: true,
      placeHolder: 'F001'
    },

    numero: {
      label: 'Número',
      showLabel: true,
      name: 'numero',
      id: 'numero',
      ref: numeroRef,
      required: true,
      tiny: true,
      placeHolder: '00000001'
    },

    formaPago: {
      label: 'Forma de Pago',
      showLabel: true,
      name: 'forma_pago',
      id: 'forma_pago',
      ref: formaPagoRef,
      required: true,

      data: [
        {
          key: 'CONT',
          value: 'Al contado'
        },
        {
          key: 'CRED',
          value: 'Crédito'
        }
      ],

      tiny: true,
      noDeleteOption: true,

      onChange: (key: string) => {
        if (key === 'CONT' || key === 'CRED') {
          setTipoDePago(key)
        }
      }
    },

    moneda: {
      label: 'Moneda',
      showLabel: true,
      name: 'moneda',
      id: 'moneda',
      ref: monedaRef,
      required: true,
      data: moneyList,
      tiny: true,
      noDeleteOption: true,

      onChange: (key: string) => {
        const selected = moneyList.find(
          (item) => String(item.key) === String(key)
        )

        const label = String(selected?.value ?? '').toUpperCase()

        if (
          label.includes('USD') ||
          label.includes('DÓLAR') ||
          label.includes('DOLAR')
        ) {
          setMoneda('USD')
        } else {
          setMoneda('PEN')
        }
      }
    },

    /* ========================================================
       FECHAS
    ======================================================== */

    fechaEmision: {
      label: 'Fecha de Emisión',
      showLabel: true,
      name: 'fecha_emision',
      id: 'fecha_emision',
      ref: fechaEmisionRef,
      required: true,
      type: 'date',
      tiny: true,
      defaultValue: maxDate,
      minDate,
      maxDate
    },

    /* ========================================================
       EMISOR / PROVEEDOR
    ======================================================== */

    rucEmisor: {
      label: 'RUC del Emisor',
      showLabel: true,
      name: 'ruc_emisor',
      id: 'ruc_emisor',
      ref: rucEmisorRef,
      required: true,
      tiny: true,
      inputMode: 'numeric',
      placeHolder: '###########',

      onChange: (value: string) => {
        const clean = value.replace(/\D/g, '').slice(0, 11)

        if (rucEmisorRef.current) {
          rucEmisorRef.current.value = clean
        }

        setEmisorHeader((prev) => ({
          ...prev,
          ruc: clean
        }))

        if (clean.length === 11) {
          buscarProveedorPorRuc(clean)
        } else {
          setLastRucProveedorSearched('')

          if (razonSocialRef.current) {
            razonSocialRef.current.value = ''
          }

          if (direccionEmisorRef.current) {
            direccionEmisorRef.current.value = ''
          }

          setEmisorHeader({
            ruc: clean,
            razonSocial: '',
            direccion: ''
          })
        }
      }
    },

    razonSocialEmisor: {
      label: 'Razón Social del Emisor',
      showLabel: true,
      name: 'razon_social_emisor',
      id: 'razon_social_emisor',
      ref: razonSocialRef,
      required: true,
      tiny: true,
      placeHolder: 'Nombre o razón social del proveedor',

      value: emisorHeader.razonSocial,

      onChange: (value: string) => {
        setEmisorHeader((prev) => ({
          ...prev,
          razonSocial: value
        }))
      }
    },

    direccionEmisor: {
      label: 'Dirección del Emisor',
      showLabel: true,
      name: 'direccion_emisor',
      id: 'direccion_emisor',
      ref: direccionEmisorRef,
      required: false,
      tiny: true,
      placeHolder: 'Dirección del proveedor',

      value: emisorHeader.direccion,

      onChange: (value: string) => {
        setEmisorHeader((prev) => ({
          ...prev,
          direccion: value
        }))
      }
    },

    /* ========================================================
       RECEPTOR
    ======================================================== */

    nroDocReceptor: {
      label: 'N° Documento',
      showLabel: true,
      name: 'nro_doc_receptor',
      id: 'nro_doc_receptor',
      ref: nroDocReceptorRef,
      required: true,
      value: ruc ?? '',
      readOnly: true,
      tiny: true
    },

    razonSocialReceptor: {
      label: 'Razón Social',
      showLabel: true,
      name: 'razon_social_receptor',
      id: 'razon_social_receptor',
      ref: razonSocialReceptorRef,
      required: false,
      value: enterpriseName ?? '',
      readOnly: true,
      tiny: true
    },

    direccionReceptor: {
      label: 'Dirección',
      showLabel: true,
      name: 'direccion_receptor',
      id: 'direccion_receptor',
      ref: direccionReceptorRef,
      required: false,
      value: address ?? '',
      readOnly: true,
      tiny: true
    },

    /* ========================================================
       RESUMEN TRIBUTARIO
    ======================================================== */

    subtotal: {
      label: 'Sub Total Ventas',
      showLabel: true,
      name: 'subtotal',
      id: 'subtotal',
      ref: subtotalRef,
      required: true,
      type: 'number',
      tiny: true,
      readOnly: true
    },

    valorVenta: {
      label: 'Valor de Venta',
      showLabel: true,
      name: 'valor_venta',
      id: 'valor_venta',
      ref: valorVentaRef,
      required: true,
      type: 'number',
      tiny: true,
      readOnly: true
    },

    igv: {
      label: 'IGV (18%)',
      showLabel: true,
      name: 'igv',
      id: 'igv',
      ref: igvRef,
      required: true,
      type: 'number',
      tiny: true,
      readOnly: true
    },

    icbperTotal: {
      label: 'ICBPER Total',
      showLabel: true,
      name: 'icbper_total',
      id: 'icbper_total',
      ref: icbperTotalRef,
      required: false,
      type: 'number',
      tiny: true,
      readOnly: true
    },

    operacionesGratuitas: {
      label: 'Operaciones Gratuitas',
      showLabel: true,
      name: 'operaciones_gratuitas',
      id: 'operaciones_gratuitas',
      ref: operacionesGratuitasRef,
      required: false,
      type: 'number',
      tiny: true,
      readOnly: true
    },

    importeTotal: {
      label: 'Importe Total',
      showLabel: true,
      name: 'importe_total',
      id: 'importe_total',
      ref: importeTotalRef,
      required: true,
      type: 'number',
      tiny: true,
      readOnly: true
    },

    importeLetras: {
      label: 'Importe en Letras',
      showLabel: true,
      name: 'importe_letras',
      id: 'importe_letras',
      ref: importeLetrasRef,
      required: true,
      tiny: true,
      readOnly: true
    },

    /* ========================================================
       ESTADO
    ======================================================== */

    estado: {
      label: 'Estado',
      showLabel: true,
      name: 'estado',
      id: 'estado',
      ref: estadoRef,
      required: true,

      data: [
        {
          key: 'registrada',
          value: 'Registrada'
        },
        {
          key: 'pagada',
          value: 'Pagada'
        },
        {
          key: 'anulada',
          value: 'Anulada'
        }
      ],

      tiny: true,
      noDeleteOption: true
    },

    /* ========================================================
       SUBMIT
    ======================================================== */

    submit: {
      name: 'submit',
      id: 'submit',
      label: 'submit',
      showLabel: false,
      type: 'submit',

      buttonName: uuid ? 'Guardar' : 'Registrar',

      disabled: submitLoaded,
      loaded: submitLoaded,

      tiny: true
    }
  }

  /* ============================================================
     SUBMIT
     POR AHORA SE MANTIENE LA LÓGICA EXISTENTE
  ============================================================ */

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const fields = [
      {
        ref: serieRef,
        message: 'Debe ingresar la serie de la factura'
      },
      {
        ref: numeroRef,
        message: 'Debe ingresar el número de factura'
      },
      {
        ref: rucEmisorRef,
        message: 'Debe ingresar el RUC del proveedor'
      },
      {
        ref: razonSocialRef,
        message: 'Debe ingresar la razón social del proveedor'
      },
      {
        ref: fechaEmisionRef,
        message: 'Debe ingresar la fecha de emisión'
      },
      {
        ref: formaPagoRef,
        message: 'Debe seleccionar la forma de pago'
      },
      {
        ref: monedaRef,
        message: 'Debe seleccionar la moneda'
      }
    ]

    if (!CheckForm(fields)) return

    if (!token) {
      ToastNotification('danger', 'No hay sesión activa.')
      return
    }

    if (!items.length) {
      ToastNotification(
        'warning',
        'Debe agregar al menos un producto o servicio.'
      )
      return
    }

    const itemInvalido = items.some(
      (item) =>
        !item.descripcion.trim() ||
        Number(item.cantidad) <= 0 ||
        !item.unidad_medida
    )

    if (itemInvalido) {
      ToastNotification(
        'warning',
        'Complete la descripción, cantidad y unidad de medida de todos los ítems.'
      )
      return
    }

    /*
     * El backend actual exige cuotas cuando payment_type === CRED.
     * No inventamos las cuotas de Compra.
     */
    if (tipoDePago === 'CRED') {
      ToastNotification(
        'warning',
        'Falta implementar las cuotas para compras a crédito.'
      )
      return
    }

    const itemsPayload = items.map((item) => ({
      description: item.descripcion.trim(),
      quantity: Number(item.cantidad),
      measurement_unit: item.unidad_medida,
      unit_price: Number(item.valor_unitario) || 0
    }))

    const body = {
      invoice_serial_nr: serieRef.current?.value ?? '',

      invoice_correlative_nr: numeroRef.current?.value ?? '',

      emition_date: fechaEmisionRef.current?.value
        ? isoToDMY(fechaEmisionRef.current.value)
        : null,

      /*
       * En una compra rel_clients representa
       * al proveedor/emisor.
       */
      rel_clients: rucEmisorRef.current?.value ?? '',

      client_name: razonSocialRef.current?.value ?? '',

      address_clients: direccionEmisorRef.current?.value ?? '',

      invoice_type: 'buys',

      payment_type: tipoDePago,

      has_delivery_address: false,

      /*
       * El Select guarda en el ref el key
       * proveniente de mainData.money.noPaged.
       */
      money: monedaRef.current?.value ?? '',

      cantidad_cuotas: 0,

      credito: '',

      op_gravada: base.toFixed(2),

      op_inafecta: '0.00',

      recargo_consumo: '0.00',

      igv: igv.toFixed(2),

      igv_rate: '18.00',

      importe_total: total.toFixed(2),

      observations: '',

      status: true,

      items: itemsPayload,

      documents: documentos
    }

    console.log('[FACTURA COMPRA] body:', body)

    const resetFields = [
      {
        refs: [
          serieRef,
          numeroRef,
          rucEmisorRef,
          razonSocialRef,
          direccionEmisorRef
        ],
        resetValues: []
      }
    ]

    const resetAllFields = ResetForm({
      resetFields
    })

    const handlerResetfield = () => {
      resetAllFields()

      setDocumentos([])

      setEmisorHeader({
        ruc: '',
        razonSocial: '',
        direccion: ''
      })

      setLastRucProveedorSearched('')

      setItems([
        {
          cantidad: 1,
          unidad_medida: '',
          descripcion: '',
          valor_unitario: '0.00',
          icbper: '0.00'
        }
      ])

      const now = new Date()
      const emission = formatDate(now)

      if (fechaEmisionRef.current) {
        fechaEmisionRef.current.value = emission
      }
    }

    const endPoint = endPoints.invoices.create

    try {
      setSubmitLoaded(true)

      const response = await ApiPostAuth(
        endPoint,
        token,
        {
          ...body,

          items: JSON.stringify(body.items),

          documents: documentos
        },
        undefined,
        'multipart/form-data'
      )

      console.log('[FACTURA COMPRA] response:', response)

      ResponseFromCreated({
        response,
        successMessage: 'Factura de Compra registrada SATISFACTORIAMENTE.',
        handlerResetfield
      })
    } catch (err) {
      console.error('[FACTURA COMPRA] submit error:', err)

      ToastNotification('danger', 'No se pudo procesar la factura de compra.')
    } finally {
      setSubmitLoaded(false)
    }
  }

  /* ============================================================
     RENDER
  ============================================================ */
  return (
    <PageContainer className='w-full' styleInside={{ padding: '0px' }}>
      {/* ENCABEZADO SUPERIOR */}
      <div className='flex items-center justify-between w-full mb-2'>
        <div className='w-full flex justify-start px-4'>
          <PageTitle
            description={
              uuid ? 'Editar factura de compra' : 'Nueva factura de compra'
            }
          />
        </div>
      </div>

      <GoBack enlace={`${prefix}/facturacion/`} />

      <PageContent className='w-full' styleInside={{ padding: '0px' }}>
        <Formulary onSubmit={onSubmit}>
          <FormContainer>
            <FormContent className='w-full'>
              <div className='w-full overflow-hidden bg-white lg:rounded-lg lg:border lg:border-slate-400 max-w-none mx-0 px-4 sm:px-6 md:px-8 lg:px-10'>
                {/* ======================================================
                  ENCABEZADO
              ====================================================== */}

                <div className='grid grid-cols-1 md:grid-cols-12 items-center rounded-t bg-white'>
                  {/* EMPRESA RECEPTORA */}

                  {/* EMPRESA EMISORA / PROVEEDOR */}
                  <div className='col-span-12 md:col-span-8 p-4 text-center md:text-start flex flex-col justify-center'>
                    <div className='col-span-12 md:col-span-8 p-4 text-center md:text-start flex flex-col justify-center'>
                      <div className='font-extrabold text-2xl sm:text-[1.6rem] uppercase leading-tight'>
                        {emisorHeader.razonSocial || 'PROVEEDOR'}
                      </div>

                      <div className='font-bold text-lg sm:text-xl leading-snug'>
                        RUC: {emisorHeader.ruc || '00000000000'}
                      </div>

                      <div className='text-sm sm:text-base mt-1 leading-snug'>
                        {emisorHeader.direccion || '---'}
                      </div>
                    </div>
                  </div>
                  {/* FACTURA DE COMPRA */}
                  <div className='col-span-12 md:col-span-4 p-4 flex justify-center md:justify-end items-start md:items-center'>
                    <div
                      className='border-2 border-slate-400 px-4 py-3 text-center rounded-md
                               w-10/12 sm:w-9/12 md:w-10/12 lg:w-11/12 xl:w-10/12
                               2xl:w-9/12 mt-4 md:mt-0 lg:mt-4 xl:mt-6
                               max-w-[420px]'
                    >
                      <div className='font-bold text-base uppercase leading-tight tracking-wide'>
                        FACTURA DE COMPRA
                      </div>

                      <div className='text-xs mt-1 font-medium'>
                        RUC: {emisorHeader.ruc || '00000000000'}
                      </div>

                      <div className='grid grid-cols-2 gap-2 mt-3'>
                        <Input data={formData.serie} />
                        <Input data={formData.numero} />
                      </div>
                    </div>
                  </div>
                </div>

                <Hr />

                {/* ======================================================
                  DATOS DEL COMPROBANTE
              ====================================================== */}

                <div className='p-6 space-y-2'>
                  <div className='flex flex-col md:flex-row md:items-center md:gap-3 xl:gap-6'>
                    <div className='w-full md:w-4/12 xl:w-3/12 h-10 flex items-center'>
                      {formData.fechaEmision.label}
                    </div>

                    <div className='w-full md:w-8/12 xl:w-5/12 md:max-w-[280px]'>
                      <Input data={formData.fechaEmision} />
                    </div>
                  </div>

                  {/* PROVEEDOR */}
                  <div className='flex flex-col md:flex-row md:items-center md:gap-3 xl:gap-6'>
                    <div className='w-full md:w-4/12 xl:w-3/12 h-10 flex items-center'>
                      {formData.razonSocialEmisor.label}
                    </div>

                    <div className='w-full md:w-8/12 xl:w-5/12 md:max-w-[400px]'>
                      <Input
                        key={`razon-social-${proveedorVersion}`}
                        data={formData.razonSocialEmisor}
                      />
                    </div>
                  </div>

                  <div className='flex flex-col md:flex-row md:items-center md:gap-3 xl:gap-6'>
                    <div className='w-full md:w-4/12 xl:w-3/12 h-10 flex items-center'>
                      {formData.rucEmisor.label}
                    </div>

                    <div className='w-full md:w-8/12 xl:w-5/12 md:max-w-[260px]'>
                      <Input data={formData.rucEmisor} />

                      {loadingProveedor && (
                        <p className='text-xs text-slate-500 mt-1'>
                          Buscando proveedor...
                        </p>
                      )}
                    </div>
                  </div>

                  <div className='flex flex-col md:flex-row md:items-center md:gap-3 xl:gap-6'>
                    <div className='w-full md:w-4/12 xl:w-3/12 h-10 flex items-center'>
                      {formData.direccionEmisor.label}
                    </div>

                    <div className='w-full md:w-8/12 xl:w-5/12 md:max-w-[560px]'>
                      <Input
                        key={`direccion-emisor-${proveedorVersion}`}
                        data={formData.direccionEmisor}
                      />
                    </div>
                  </div>

                  <div className='flex flex-col md:flex-row md:items-center md:gap-3 xl:gap-6'>
                    <div className='w-full md:w-4/12 xl:w-3/12 h-10 flex items-center'>
                      {formData.formaPago.label}
                    </div>

                    <div className='w-full md:w-8/12 xl:w-5/12 md:max-w-[260px]'>
                      <Select data={formData.formaPago} />
                    </div>
                  </div>

                  <div className='flex flex-col md:flex-row md:items-center md:gap-3 xl:gap-6'>
                    <div className='w-full md:w-4/12 xl:w-3/12 h-10 flex items-center'>
                      {formData.moneda.label}
                    </div>

                    <div className='w-full md:w-8/12 xl:w-5/12 md:max-w-[260px]'>
                      <Select data={formData.moneda} />
                    </div>
                  </div>
                </div>

                <Hr />

                {/* ======================================================
                  PRODUCTOS / SERVICIOS
              ====================================================== */}

                <div className='mt-4 border border-slate-300 rounded-lg overflow-hidden'>
                  <div className='flex justify-start items-center bg-cyan-900 text-white px-4 py-2'>
                    <span className='font-semibold text-sm'>
                      Productos / Servicios
                    </span>
                  </div>

                  <div className='p-4'>
                    <FacturaCompraItems
                      items={items}
                      setItems={setItems}
                      unidadMedidaList={unidadMedidaList}
                    />
                  </div>
                </div>

                <Hr />

                {/* ======================================================
                  TOTALES
              ====================================================== */}

                <div className='p-4 border-t border-slate-300 bg-slate-50'>
                  <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                    {/* IZQUIERDA */}
                    <div className='space-y-4'>
                      <div className='text-sm font-semibold text-slate-700'>
                        {letras || '—'}
                      </div>
                    </div>

                    {/* DERECHA */}
                    <div className='space-y-4'>
                      <div className='border border-slate-400 text-sm bg-white rounded-md shadow-sm'>
                        {[
                          ['Sub Total Ventas', base],
                          ['Descuentos', '0.00'],
                          ['Valor Venta', base],
                          ['IGV (18%)', igv],
                          ['ICBPER', icbper],
                          ['Otros Cargos', '0.00'],
                          ['Importe Total', total]
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
                              {moneda === 'USD' ? '$' : 'S/'}{' '}
                              {Number(value).toFixed(2)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* ======================================================
                  DOCUMENTOS ADJUNTOS
              ====================================================== */}

                <div className='w-full border border-slate-300 rounded-lg overflow-hidden mt-4'>
                  <div className='flex justify-between items-center bg-cyan-900 text-white px-4 py-2'>
                    <div className='flex items-center gap-2'>
                      <BsPaperclip size={16} />

                      <span className='font-semibold text-sm'>
                        Documentos adjuntos
                      </span>
                    </div>
                  </div>

                  <div className='p-4 bg-white'>
                    <div className='flex justify-end mb-4'>
                      <label
                        htmlFor='purchaseDocuments'
                        className='flex items-center gap-2 px-4 py-2 border border-emerald-500 text-emerald-600 rounded-md font-medium text-sm hover:bg-emerald-50 transition cursor-pointer'
                      >
                        <BsUpload size={16} />
                        Adjuntar documento
                      </label>

                      <input
                        id='purchaseDocuments'
                        ref={invoiceFileRef}
                        type='file'
                        accept='.pdf,.png,.jpg,.jpeg'
                        multiple
                        className='hidden'
                        onChange={handleDocumentsChange}
                      />
                    </div>

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

                {/* ======================================================
                  GUARDAR
              ====================================================== */}

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
    </PageContainer>
  )
  // return (
  //   <PageContainer className='w-full' styleInside={{ padding: '0px' }}>
  //     {/* ========================================================
  //         ENCABEZADO
  //     ======================================================== */}
  //     <div className='flex items-center justify-between w-full mb-2 '>
  //       <div className='w-full flex justify-start px-4'>
  //         <PageTitle
  //           description={
  //             uuid ? 'Editar factura de compra' : 'Nueva factura de compra'
  //           }
  //         />
  //       </div>

  //       <GoBack enlace={`${prefix}/facturacion/`} />
  //     </div>
  //     <PageContent
  //       className='w-full'
  //       styleInside={{
  //         padding: '0px'
  //       }}
  //     >
  //       <Formulary onSubmit={onSubmit}>
  //         <FormContainer>
  //           <FormContent className='w-full'>
  //             <div className='w-full bg-white border border-slate-300 rounded-lg p-4 sm:p-6 shadow-sm space-y-8'>
  //               {/* ==================================================
  //                   IDENTIFICACIÓN
  //               ================================================== */}

  //               <section>
  //                 <SectionTitle title='Identificación de la Factura' />

  //                 <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
  //                   <Input data={formData.serie} />

  //                   <Input data={formData.numero} />

  //                   <Select data={formData.formaPago} />

  //                   <Select data={formData.moneda} />
  //                 </div>
  //               </section>

  //               {/* ==================================================
  //                   FECHAS
  //               ================================================== */}

  //               <section>
  //                 <SectionTitle title='Fechas del Comprobante' />

  //                 <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
  //                   <Input data={formData.fechaEmision} />

  //                   <Input data={formData.fechaVencimiento} />
  //                 </div>
  //               </section>

  //               {/* ==================================================
  //                   PROVEEDOR
  //               ================================================== */}

  //               <section>
  //                 <SectionTitle title='Datos del Proveedor (Emisor)' />

  //                 <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
  //                   <div>
  //                     <Input data={formData.rucEmisor} />

  //                     {loadingProveedor && (
  //                       <p className='text-xs text-slate-500 mt-1'>
  //                         Buscando proveedor...
  //                       </p>
  //                     )}
  //                   </div>

  //                   <div className='md:col-span-2'>
  //                     <Input data={formData.razonSocialEmisor} />
  //                   </div>
  //                 </div>

  //                 <div className='w-full mt-4'>
  //                   <Input data={formData.direccionEmisor} />
  //                 </div>
  //               </section>

  //               {/* ==================================================
  //                   RECEPTOR
  //               ================================================== */}

  //               <section>
  //                 <SectionTitle title='Datos del Receptor' />

  //                 <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
  //                   <Input data={formData.nroDocReceptor} />

  //                   <div className='md:col-span-2'>
  //                     <Input data={formData.razonSocialReceptor} />
  //                   </div>
  //                 </div>

  //                 <div className='w-full mt-4'>
  //                   <Input data={formData.direccionReceptor} />
  //                 </div>
  //               </section>

  //               {/* ==================================================
  //                   DETALLE
  //               ================================================== */}

  //               <section>
  //                 <SectionTitle title='Detalle de la Compra' />

  //                 <FacturaCompraItems items={items} setItems={setItems} />
  //               </section>

  //               {/* ==================================================
  //                   RESUMEN TRIBUTARIO
  //               ================================================== */}

  //               <section>
  //                 <SectionTitle title='Resumen Tributario' />

  //                 <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
  //                   <Input data={formData.subtotal} />

  //                   <Input data={formData.valorVenta} />

  //                   <Input data={formData.igv} />

  //                   <Input data={formData.icbperTotal} />

  //                   <Input data={formData.operacionesGratuitas} />

  //                   <Input data={formData.importeTotal} />
  //                 </div>
  //               </section>

  //               {/* ==================================================
  //                   IMPORTE EN LETRAS
  //               ================================================== */}

  //               <section>
  //                 <SectionTitle title='Importe en Letras' />

  //                 <div className='grid grid-cols-1 gap-4'>
  //                   <Input data={formData.importeLetras} />
  //                 </div>
  //               </section>

  //               {/* ==================================================
  //                   ESTADO Y DOCUMENTO
  //               ================================================== */}

  //               <section>
  //                 <SectionTitle title='Estado y Documento SUNAT' />

  //                 <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
  //                   <Select data={formData.estado} />

  //                   <Input data={formData.archivoAdjunto} />
  //                 </div>
  //               </section>

  //               {/* ==================================================
  //                   SUBMIT
  //               ================================================== */}

  //               <div className='pt-6 flex justify-end border-t border-slate-200'>
  //                 <div className='w-full sm:w-auto sm:min-w-[180px]'>
  //                   <Button data={formData.submit} />
  //                 </div>
  //               </div>
  //             </div>
  //           </FormContent>
  //         </FormContainer>
  //       </Formulary>
  //     </PageContent>
  //   </PageContainer>
  // )
}

export { FacturaCompraMod }

/* ============================================================
   TEMPORAL - GET
   Lo dejamos preparado hasta definir endpoint de compra.
============================================================ */

// async function getData(uuid: string | undefined, token: string | null) {
//   if (token) {
//     const facturaCompra =
//       uuid && uuid.length > 0
//         ? await ApiFecthAuth(endPoints.invoices.retrieve(uuid), token)
//         : null

//     return {
//       props: {
//         facturaCompra
//       },
//       revalidate: 3600
//     }
//   }

//   return {
//     props: {
//       facturaCompra: null
//     },
//     revalidate: 3600
//   }
// }
