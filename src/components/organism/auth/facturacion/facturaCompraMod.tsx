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
import { ApiPatchAuth } from '@/services/auth/axios/apiPatchAuth'
import ResponseFromEdited from '@/utils/responseFromEdited'
import ResponseFromCreated from '@/utils/responseFromCreated'
import { ToastNotification } from '@/components/atom/structures/toast'
import { ApiPostAuth } from '@/services/auth/axios/apiPostAuth'
import { ApiFecthAuth } from '@/services/auth/axios/apiFetchAuth'
import { CheckForm } from '@/utils/checkForm'
import {
  FacturaCompraBodyInterface,
  FacturaCompraItemInterface
} from '@/interfaces/structures/bodyFormInterface'
import { useFacturaCompraCalc } from '@/modules/invoice/useFacturaCompraCalc'
import FacturaCompraItems from '@/components/molecule/invoices/items/facturaCompraItems'

const FacturaCompraMod: React.FC<UUIDInterface> = ({ uuid }) => {
  const { token, enterpriseName, ruc } = useAuth()
  const [submitLoaded, setSubmitLoaded] = useState(false)

  // temporal - eliminar al terminar - REVISAR
  const tmp = getData(uuid, token)
  console.log(tmp)
  // fin temporal

  const [items, setItems] = useState<FacturaCompraItemInterface[]>([
    {
      cantidad: 1,
      unidad_medida: 'NIU',
      descripcion: '',
      valor_unitario: '0.00',
      icbper: '0.00'
    }
  ])

  const [moneda, setMoneda] = useState<'PEN' | 'USD'>('PEN')

  // === refs ===
  const serieRef = useRef<HTMLInputElement>(null)
  const numeroRef = useRef<HTMLInputElement>(null)
  const formaPagoRef = useRef<HTMLInputElement>(null)
  const monedaRef = useRef<HTMLInputElement>(null)

  const fechaEmisionRef = useRef<HTMLInputElement>(null)
  const fechaVencimientoRef = useRef<HTMLInputElement>(null)

  // Emisor
  const rucEmisorRef = useRef<HTMLInputElement>(null)
  const razonSocialRef = useRef<HTMLInputElement>(null)
  const direccionEmisorRef = useRef<HTMLInputElement>(null)

  // Totales SUNAT
  const subtotalRef = useRef<HTMLInputElement>(null)
  const valorVentaRef = useRef<HTMLInputElement>(null)
  const igvRef = useRef<HTMLInputElement>(null)
  const icbperTotalRef = useRef<HTMLInputElement>(null)
  const operacionesGratuitasRef = useRef<HTMLInputElement>(null)
  const importeTotalRef = useRef<HTMLInputElement>(null)
  const importeLetrasRef = useRef<HTMLInputElement>(null)

  // Estado y archivo
  const estadoRef = useRef<HTMLInputElement>(null)
  const archivoAdjuntoRef = useRef<HTMLInputElement>(null)

  // Receptor
  const nroDocReceptorRef = useRef<HTMLInputElement>(null)
  const razonSocialReceptorRef = useRef<HTMLInputElement>(null)
  const direccionReceptorRef = useRef<HTMLInputElement>(null)

  const SectionTitle = ({ title }: { title: string }) => (
    <h3 className='text-sm font-semibold text-slate-600 uppercase tracking-wide border-b border-slate-200 pb-2 mb-4'>
      {title}
    </h3>
  )

  const { base, igv, icbper, total, letras } = useFacturaCompraCalc(
    items,
    moneda
  )

  useEffect(() => {
    if (subtotalRef.current) subtotalRef.current.value = base.toFixed(2)

    if (valorVentaRef.current) valorVentaRef.current.value = base.toFixed(2)

    if (igvRef.current) igvRef.current.value = igv.toFixed(2)

    if (icbperTotalRef.current) icbperTotalRef.current.value = icbper.toFixed(2)

    if (importeTotalRef.current)
      importeTotalRef.current.value = total.toFixed(2)

    if (importeLetrasRef.current) importeLetrasRef.current.value = letras
  }, [base, igv, icbper, total, letras])

  const formData = {
    serie: {
      label: 'Serie',
      showLabel: true,
      name: 'serie',
      id: 'serie',
      ref: serieRef,
      required: true,
      tiny: true
    },
    numero: {
      label: 'Número',
      showLabel: true,
      name: 'numero',
      id: 'numero',
      ref: numeroRef,
      required: true,
      tiny: true
    },
    formaPago: {
      label: 'Forma de Pago',
      showLabel: true,
      name: 'forma_pago',
      id: 'forma_pago',
      ref: formaPagoRef,
      required: true,
      data: [
        { key: 'CONTADO', value: 'Contado' },
        { key: 'CREDITO', value: 'Crédito' }
      ],
      tiny: true
    },
    moneda: {
      label: 'Moneda',
      showLabel: true,
      name: 'moneda',
      id: 'moneda',
      ref: monedaRef,
      required: true,
      data: [
        { key: 'PEN', value: 'Soles (PEN)' },
        { key: 'USD', value: 'Dólares (USD)' },
        { key: 'EUR', value: 'Euros (EUR)' }
      ],
      tiny: true,
      onChange: (key: string) => {
        setMoneda(key as 'PEN' | 'USD')
      }
    },

    /* FECHAS*/
    fechaEmision: {
      label: 'Fecha de Emisión',
      showLabel: true,
      name: 'fecha_emision',
      id: 'fecha_emision',
      ref: fechaEmisionRef,
      required: true,
      type: 'date',
      tiny: true
    },
    fechaVencimiento: {
      label: 'Fecha de Vencimiento',
      showLabel: true,
      name: 'fecha_vencimiento',
      id: 'fecha_vencimiento',
      ref: fechaVencimientoRef,
      required: false,
      type: 'date',
      tiny: true
    },

    /*EMISOR */
    rucEmisor: {
      label: 'RUC del Emisor',
      showLabel: true,
      name: 'ruc_emisor',
      id: 'ruc_emisor',
      ref: rucEmisorRef,
      required: true,
      tiny: true
    },
    razonSocialEmisor: {
      label: 'Razón Social del Emisor',
      showLabel: true,
      name: 'razon_social_emisor',
      id: 'razon_social_emisor',
      ref: razonSocialRef,
      required: true,
      tiny: true
    },
    direccionEmisor: {
      label: 'Dirección del Emisor',
      showLabel: true,
      name: 'direccion_emisor',
      id: 'direccion_emisor',
      ref: direccionEmisorRef,
      required: false,
      tiny: true
    },

    /*RECEPTOR Hacklibre o Caparazon */
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
      value: enterpriseName,
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
      readOnly: true,
      tiny: true
    },

    /* RESUMEN SUNAT */
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

    /* ESTADO Y ARCHIVO */
    estado: {
      label: 'Estado',
      showLabel: true,
      name: 'estado',
      id: 'estado',
      ref: estadoRef,
      required: true,
      data: [
        { key: 'registrada', value: 'Registrada' },
        { key: 'pagada', value: 'Pagada' },
        { key: 'anulada', value: 'Anulada' }
      ],
      tiny: true
    },
    archivoAdjunto: {
      label: 'Factura SUNAT (PDF)',
      showLabel: true,
      name: 'archivo_adjunto',
      id: 'archivo_adjunto',
      ref: archivoAdjuntoRef,
      type: 'file',
      accept: '.pdf',
      required: false,
      tiny: true
    },

    /* SUBMIT */
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

  /* === SUBMIT HANDLER === */
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const fields = [
      { ref: serieRef, message: 'Debe ingresar la serie de la factura' },
      { ref: numeroRef, message: 'Debe ingresar el número de factura' },
      { ref: rucEmisorRef, message: 'Debe ingresar el RUC del proveedor' },
      {
        ref: razonSocialRef,
        message: 'Debe ingresar la razón social del proveedor'
      },
      { ref: fechaEmisionRef, message: 'Debe ingresar la fecha de emisión' }
    ]

    if (!CheckForm(fields)) return
    if (!token) {
      ToastNotification('danger', 'No hay sesión activa.')
      return
    }

    const resetFields = [
      {
        refs: [numeroRef, rucEmisorRef],
        resetValues: ['']
      }
    ]

    const body: FacturaCompraBodyInterface = {
      empresa: '',
      tipo_comprobante: 'FACTURA',
      serie: serieRef.current!.value,
      numero: numeroRef.current!.value,
      fecha_emision: fechaEmisionRef.current!.value,
      moneda: monedaRef.current!.value as 'PEN',
      forma_pago: 'CONTADO',

      ruc_emisor: rucEmisorRef.current!.value,
      razon_social_emisor: razonSocialRef.current!.value,

      ruc_receptor: '20604175446',

      items,

      nro_doc_receptor: nroDocReceptorRef.current!.value,

      razon_social_receptor:
        razonSocialReceptorRef.current?.value || 'HACKLIBRE E.I.R.L.',

      direccion_receptor: direccionReceptorRef.current?.value || undefined,

      subtotal: subtotalRef.current!.value,
      valor_venta: valorVentaRef.current!.value,
      igv: igvRef.current!.value,
      importe_total: importeTotalRef.current!.value,
      importe_letras: importeLetrasRef.current!.value,

      archivo_adjunto: archivoAdjuntoRef.current?.files?.[0] || null,
      estado: 'registrada',
      status: true
    }

    const resetAllFields = ResetForm({ resetFields })
    const handlerResetfield = () => {
      resetAllFields()
    }

    const endPoint = uuid
      ? endPoints.invoices.patch(uuid)
      : endPoints.invoices.create

    try {
      setSubmitLoaded(true)
      if (uuid) {
        const response = await ApiPatchAuth(endPoint, token, body)
        ResponseFromEdited({
          response,
          returnSuccess: `/facturas-compra?t=s&m=edit`
        })
      } else {
        const response = await ApiPostAuth(endPoint, token, body)
        ResponseFromCreated({
          response,
          successMessage: 'Factura de Compra registrada SATISFACTORIAMENTE.',
          handlerResetfield
        })
      }
    } catch (err) {
      console.error('[FACTURA COMPRA] submit error:', err)
      ToastNotification('danger', 'No se pudo procesar la factura de compra.')
    } finally {
      setSubmitLoaded(false)
    }
  }

  /* === RENDER === */
  return (
    <PageContainer>
      <PageTitle description='Nueva factura de compra' />
      <GoBack enlace={`${prefix}/facturacion`} />

      <PageContent>
        <Formulary onSubmit={onSubmit}>
          <FormContainer>
            <FormContent>
              <div className='w-full bg-white border border-slate-300 rounded-lg p-6 shadow-sm space-y-8'>
                {/* === IDENTIFICACIÓN === */}
                <section>
                  <SectionTitle title='Identificación de la Factura' />
                  <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
                    <Input data={formData.serie} />
                    <Input data={formData.numero} />
                    <Select data={formData.formaPago} />
                    <Select data={formData.moneda} />
                  </div>
                </section>

                {/* === FECHAS === */}
                <section>
                  <SectionTitle title='Fechas del Comprobante' />
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <Input data={formData.fechaEmision} />
                    <Input data={formData.fechaVencimiento} />
                  </div>
                </section>

                {/* === EMISOR === */}
                <section>
                  <SectionTitle title='Datos del Proveedor (Emisor)' />
                  <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                    <Input data={formData.rucEmisor} />
                    <Input data={formData.razonSocialEmisor} />
                  </div>
                  <div className='w-full'>
                    <Input data={formData.direccionEmisor} />
                  </div>
                </section>

                {/* === RECEPTOR === */}
                <section>
                  <SectionTitle title='Datos del Receptor' />
                  <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                    <Input data={formData.nroDocReceptor} />
                    <Input data={formData.razonSocialReceptor} />
                  </div>
                  <div className='w-full'>
                    <Input data={formData.direccionReceptor} />
                  </div>
                </section>

                {/* === DETALLE DE COMPRA === */}
                <section>
                  <SectionTitle title='Detalle de la Compra' />
                  <FacturaCompraItems items={items} setItems={setItems} />
                </section>

                {/* === RESUMEN TRIBUTARIO === */}
                <section>
                  <SectionTitle title='Resumen Tributario (SUNAT)' />
                  <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                    <Input data={formData.subtotal} />
                    <Input data={formData.valorVenta} />
                    <Input data={formData.igv} />
                    <Input data={formData.icbperTotal} />
                    <Input data={formData.operacionesGratuitas} />
                    <Input data={formData.importeTotal} />
                  </div>
                </section>

                {/* === IMPORTE EN LETRAS === */}
                <section>
                  <SectionTitle title='Importe en Letras' />
                  <div className='grid grid-cols-1 gap-4'>
                    <Input data={formData.importeLetras} />
                  </div>
                </section>

                {/* === ESTADO Y ARCHIVO === */}
                <section>
                  <SectionTitle title='Estado y Documento SUNAT' />
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <Select data={formData.estado} />
                    <Input data={formData.archivoAdjunto} />
                  </div>
                </section>

                {/* === SUBMIT === */}
                <div className='pt-6 flex justify-end border-t border-slate-200'>
                  <Button data={formData.submit} />
                </div>
              </div>
            </FormContent>
          </FormContainer>
        </Formulary>
      </PageContent>
    </PageContainer>
  )
}

export { FacturaCompraMod }

async function getData(uuid: string | undefined, token: string | null) {
  if (token) {
    const facturaCompra =
      uuid && uuid.length > 0
        ? await ApiFecthAuth(endPoints.invoices.retrieve(uuid), token)
        : null
    // Aún sin endpoint real
    return {
      props: {
        facturaCompra: facturaCompra
      },
      revalidate: 3600
    }
  }
  return { props: { facturaCompra: null }, revalidate: 3600 }
}
