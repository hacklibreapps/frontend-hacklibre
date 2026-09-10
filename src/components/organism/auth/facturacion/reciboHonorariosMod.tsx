/* eslint-disable @typescript-eslint/no-unused-vars */
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
import TextArea from '@/components/atom/structures/textArea'
import { Button } from '@/components/atom/structures/button'

import { prefix } from '@/services/envs/envs'
import endPoints from '@/services/auth/endPoints/endPoint'

import { useAuth } from '@/context/authContext'
import { ReciboHonorariosBodyInterface } from '@/interfaces/structures/bodyFormInterface'

import { ApiPostAuth } from '@/services/auth/axios/apiPostAuth'
import { ApiFecthAuth } from '@/services/auth/axios/apiFetchAuth'

import { ToastNotification } from '@/components/atom/structures/toast'
import ResponseFromCreated from '@/utils/responseFromCreated'
import { CheckForm } from '@/utils/checkForm'
import ResetForm from '@/utils/resetForm'
import { KeyValueInterface } from '@/interfaces/structures/keyValueInterface'
import { useReciboHonorariosCalc } from '@/modules/invoice/useReciboHonorariosCalc'

const ReciboHonorariosMod: React.FC = () => {
  const { token, enterprise, enterpriseName, ruc } = useAuth()

  const [submitLoaded, setSubmitLoaded] = useState(false)

  const [clienteUUID, setClienteUUID] = useState<string>('')

  const [formaPagoData, setFormaPagoData] = useState<KeyValueInterface[]>([])
  const [incisosData, setIncisosData] = useState<KeyValueInterface[]>([])
  const [aplicaRetencion, setAplicaRetencion] = useState<boolean>(true)

  const [montoBruto, setMontoBruto] = useState<number>(0)
  const [money, setMoney] = useState<'PEN' | 'USD'>('PEN')

  const { bruto, retencion, neto, letras } = useReciboHonorariosCalc(
    montoBruto,
    money,
    aplicaRetencion
  )

  const SectionTitle = ({ title }: { title: string }) => (
    <h3 className='text-sm font-semibold text-slate-600 uppercase tracking-wide border-b border-slate-200 pb-2 mb-4'>
      {title}
    </h3>
  )

  type ClientByRucResponse = {
    uuid: string
    completeCompanyName: string
    ruc: string
    address: string
    email: string
  }

  const numeroRef = useRef<HTMLInputElement>(null)
  const dniRucClienteRef = useRef<HTMLInputElement>(null)
  const fechaEmisionRef = useRef<HTMLInputElement>(null)
  const montoRef = useRef<HTMLInputElement>(null)
  const archivoAdjuntoRef = useRef<HTMLInputElement>(null)
  const totalHonorariosRef = useRef<HTMLInputElement>(null)
  const retencionRef = useRef<HTMLInputElement>(null)
  const totalNetoRef = useRef<HTMLInputElement>(null)
  const totalLetrasRef = useRef<HTMLInputElement>(null)
  const formaPagoRef = useRef<HTMLInputElement>(null)
  const incisoRef = useRef<HTMLInputElement>(null)
  const observacionRef = useRef<HTMLTextAreaElement>(null)
  const conceptoRef = useRef<HTMLInputElement>(null)
  const recibiDeRef = useRef<HTMLInputElement>(null)
  const clienteNombreRef = useRef<HTMLInputElement>(null)
  const clienteDireccionRef = useRef<HTMLInputElement>(null)
  const clientecorreoRef = useRef<HTMLInputElement>(null)
  const rucEmpresaRef = useRef<HTMLInputElement>(null)
  const domiciliadoEnRef = useRef<HTMLInputElement>(null)
  const tieneRetencionRef = useRef<HTMLInputElement>(null)

  const handleBuscarCliente = async () => {
    const doc = dniRucClienteRef.current?.value?.trim()
    if (!doc || (doc.length !== 8 && doc.length !== 11)) return

    try {
      const res = await ApiFecthAuth(endPoints.clients.byRuc(doc), token ?? '')
      const data: ClientByRucResponse | undefined = res?.data

      if (!data) {
        ToastNotification('warning', 'Cliente no encontrado')
        return
      }

      if (clienteNombreRef.current) {
        clienteNombreRef.current.value = data.completeCompanyName ?? ''
      }

      if (clienteDireccionRef.current) {
        clienteDireccionRef.current.value = data.address ?? ''
      }

      if (clientecorreoRef.current) {
        clientecorreoRef.current.value = data.email ?? ''
      }

      setClienteUUID(data.uuid)
    } catch {
      ToastNotification('warning', 'Cliente no encontrado')
    }
  }

  useEffect(() => {
    if (retencionRef.current) retencionRef.current.value = retencion.toFixed(2)

    if (totalNetoRef.current) totalNetoRef.current.value = neto.toFixed(2)

    if (totalLetrasRef.current) totalLetrasRef.current.value = letras
  }, [retencion, neto, letras])

  /* === FORM DATA === */
  const formData = {
    numero: {
      label: 'Número de Recibo',
      showLabel: true,
      name: 'numero',
      id: 'numero',
      ref: numeroRef,
      required: true,
      tiny: true
    },

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
    dniRucCliente: {
      label: 'DNI o RUC del Cliente',
      showLabel: true,
      name: 'dni_ruc_cliente',
      id: 'dni_ruc_cliente',
      ref: dniRucClienteRef,
      required: true,
      tiny: true,
      onChange: (value: string) => {
        if (value.length === 8 || value.length === 11) {
          handleBuscarCliente()
        }
      }
    },

    recibiDe: {
      label: 'Recibí de',
      showLabel: true,
      name: 'recibi_de',
      id: 'recibi_de',
      ref: recibiDeRef,
      readOnly: true,
      value: enterpriseName,
      tiny: true
    },

    ruc: {
      label: 'RUC',
      showLabel: true,
      name: 'ruc',
      id: 'ruc',
      ref: rucEmpresaRef,
      readOnly: true,
      value: ruc ?? '',
      tiny: true
    },

    domiciliadoEn: {
      label: 'Domiciliado en',
      showLabel: true,
      name: 'domiciliado_en',
      id: 'domiciliado_en',
      ref: domiciliadoEnRef,
      readOnly: true,
      // value: domiciliadoEn,
      tiny: true
    },

    clienteNombre: {
      label: 'Nombre / Razón Social',
      showLabel: true,
      name: 'cliente_nombre',
      id: 'cliente_nombre',
      ref: clienteNombreRef,
      readOnly: true,
      tiny: true
    },

    clienteDireccion: {
      label: 'Dirección',
      showLabel: true,
      name: 'cliente_direccion',
      id: 'cliente_direccion',
      ref: clienteDireccionRef,
      readOnly: true,
      tiny: true
    },

    clientecorreo: {
      label: 'Correo electronico',
      showLabel: true,
      name: 'cliente_correo',
      id: 'cliente_correo',
      ref: clientecorreoRef,
      readOnly: true,
      tiny: true
    },

    concepto: {
      label: 'Por concepto de',
      showLabel: true,
      name: 'concepto',
      id: 'concepto',
      ref: conceptoRef,
      required: true,
      tiny: true
    },

    totalHonorarios: {
      label: 'Total por Honorarios',
      showLabel: true,
      name: 'total_honorarios',
      id: 'total_honorarios',
      ref: totalHonorariosRef,
      type: 'number',
      required: true,
      tiny: true,
      onChange: (value: string) => setMontoBruto(Number(value || 0))
    },

    tieneretencion: {
      label: '¿Aplica retención 8%?',
      showLabel: true,
      name: 'tiene_retencion',
      id: 'tiene_retencion',
      ref: tieneRetencionRef,
      type: 'switch',
      value: aplicaRetencion,
      tiny: true,
      onChange: (value: string) => {
        setAplicaRetencion(value === 'true')
      }
    },

    retencion: {
      label: 'Retención (8%) IR',
      showLabel: true,
      name: 'retencion_ir',
      id: 'retencion_ir',
      ref: retencionRef,
      tiny: true,
      readOnly: true,
      value: retencion.toFixed(2),
      disabled: true
    },

    totalNeto: {
      label: 'Total Neto Recibido',
      showLabel: true,
      name: 'total_neto',
      id: 'total_neto',
      ref: totalNetoRef,
      readOnly: true,
      tiny: true,
      value: neto.toFixed(2),
      disabled: true
    },

    totalLetras: {
      label: 'La suma de',
      showLabel: true,
      name: 'total_letras',
      id: 'total_letras',
      ref: totalLetrasRef,
      readOnly: true,
      tiny: true,
      disabled: true,
      value: letras
    },

    formaPago: {
      label: 'Forma de Pago',
      showLabel: true,
      name: 'forma_pago',
      id: 'forma_pago',
      ref: formaPagoRef,
      data: formaPagoData,
      required: true,
      tiny: true,
      noDeleteOption: true
      // onChange: (key: string) => {
      //   setMoney(key as 'PEN' | 'USD')
      // }
    },

    inciso: {
      label: 'Inciso',
      showLabel: true,
      name: 'inciso',
      id: 'inciso',
      ref: incisoRef,
      data: incisosData,
      required: true,
      tiny: true,
      noDeleteOption: true
    },

    observacion: {
      label: 'Observaciones',
      showLabel: true,
      name: 'observacion',
      id: 'observacion',
      ref: observacionRef,
      row: 4,
      maxLen: 5000,
      tiny: true
    },

    archivoAdjunto: {
      label: 'Adjuntar PDF (SUNAT)',
      showLabel: true,
      name: 'archivo_adjunto',
      id: 'archivo_adjunto',
      ref: archivoAdjuntoRef,
      type: 'file',
      accept: '.pdf',
      required: true,
      tiny: true
    },

    /* === ACCIÓN === */
    submit: {
      name: 'submit',
      id: 'submit',
      label: 'submit',
      showLabel: false,
      type: 'submit',
      buttonName: 'Registrar Recibo',
      disabled: submitLoaded,
      loaded: submitLoaded,
      tiny: true
    }
  }

  /* === SUBMIT HANDLER === */
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const fields = [
      {
        ref: numeroRef,
        message: 'Debe ingresar el número del recibo'
      },
      {
        ref: dniRucClienteRef,
        message: 'Debe ingresar el DNI o RUC del cliente'
      },
      {
        ref: fechaEmisionRef,
        message: 'Debe ingresar la fecha de emisión'
      },
      {
        ref: montoRef,
        message: 'Debe ingresar el monto del recibo'
      },
      {
        ref: archivoAdjuntoRef,
        message: 'Debe adjuntar el PDF del recibo'
      }
    ]

    if (!CheckForm(fields)) return

    if (!token || !enterprise) {
      ToastNotification('danger', 'No hay sesión activa.')
      return
    }

    const resetFields = [
      {
        refs: [
          numeroRef,
          dniRucClienteRef,
          fechaEmisionRef,
          montoRef,
          archivoAdjuntoRef,
          observacionRef
        ],
        resetValues: ['']
      }
    ]

    const body: ReciboHonorariosBodyInterface = {
      tipo_comprobante: 'RECIBO POR HONORARIOS',
      numero: numeroRef.current?.value ?? '',

      dni_ruc_emisor: dniRucClienteRef.current?.value ?? '',
      nombre_emisor: clienteNombreRef.current?.value ?? '',
      direccion_emisor: clienteDireccionRef.current?.value ?? '',
      correo_emisor: clientecorreoRef.current?.value ?? '',

      empresa: enterprise,
      client: clienteUUID,
      recibi_de: enterpriseName ?? '',
      fecha_emision: fechaEmisionRef.current?.value ?? '',
      concepto: conceptoRef.current?.value ?? '',
      observacion: observacionRef.current?.value || null,
      inciso: incisoRef.current?.value ?? 'A',
      total_honorarios: bruto,
      retencion_ir: retencion,
      total_neto: neto,
      total_letras: letras,
      forma_pago: formaPagoRef.current?.value ?? '',
      archivo_adjunto: archivoAdjuntoRef.current?.files?.[0] || null,
      status: true
    }
    console.log(body)

    const resetAllFields = ResetForm({ resetFields })
    const handlerResetfield = () => {
      resetAllFields()
    }

    const endPoint = endPoints.invoices.create

    try {
      setSubmitLoaded(true)
      const response = await ApiPostAuth(endPoint, token, body)
      ResponseFromCreated({
        response,
        successMessage: 'Recibo por Honorarios registrado SATISFACTORIAMENTE.',
        handlerResetfield
      })
    } catch (err) {
      console.error('[RECIBO HONORARIOS] submit error:', err)
      ToastNotification(
        'danger',
        'No se pudo procesar el recibo por honorarios.'
      )
    } finally {
      setSubmitLoaded(false)
    }
  }

  /* === RENDER === */
  return (
    <PageContainer className='w-full' styleInside={{ padding: '0px' }}>
      <PageTitle description='Nuevo recibo por honorarios' />
      <GoBack enlace={`${prefix}/facturacion`} />

      <PageContent className='w-full' styleInside={{ padding: '0px' }}>
        <Formulary onSubmit={onSubmit}>
          <FormContainer>
            <FormContent className='w-full'>
              <div className='w-full bg-white border border-slate-300 rounded-lg p-6 space-y-8'>
                {/* === IDENTIFICACIÓN === */}
                <section>
                  <SectionTitle title='Identificación del Recibo' />
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <Input data={formData.numero} />
                    <Input data={formData.fechaEmision} />
                    <Input data={formData.recibiDe} />
                    <Input data={formData.ruc} />
                    <Input data={formData.domiciliadoEn} />
                  </div>
                </section>

                {/* === CLIENTE === */}
                <section>
                  <SectionTitle title='Datos del Cliente' />
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <Input data={formData.dniRucCliente} />
                  </div>

                  {/* Datos informativos (solo lectura) */}
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-4'>
                    <Input data={formData.clienteNombre} />
                    <Input data={formData.clientecorreo} />

                    <div className='md:col-span-2'>
                      <Input data={formData.clienteDireccion} />
                    </div>
                  </div>
                </section>

                {/* === CONCEPTO === */}
                <section>
                  <SectionTitle title='Servicio' />
                  <Input data={formData.concepto} />
                </section>

                {/* === IMPORTES === */}
                <section>
                  <SectionTitle title='Información de Pago' />
                  <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                    <Select data={formData.formaPago} />
                    <Input data={formData.tieneretencion} />
                    <Input data={formData.totalHonorarios} />
                    <Input data={formData.retencion} />
                    <Input data={formData.totalNeto} />
                  </div>
                  <div className='mt-4'>
                    <Input data={formData.totalLetras} />
                  </div>
                </section>

                {/* === PAGO === */}
                <section>
                  <SectionTitle title='Indique el tipo de Renta de Cuarta Categoría, de acuerdo al inciso aplicable del artículo 33 LIR:' />
                  <div className='w-full  md:grid-cols-2 gap-4'>
                    <Select data={formData.inciso} />
                  </div>
                </section>

                {/* === OBSERVACIONES === */}
                <section>
                  <TextArea data={formData.observacion} />
                </section>

                {/* === ADJUNTO === */}
                <section>
                  <SectionTitle title='Documento Adjunto' />
                  <Input data={formData.archivoAdjunto} />
                </section>

                {/* === ACCIÓN === */}
                <div className='pt-6 flex justify-end'>
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

export { ReciboHonorariosMod }

// async function getData(uuid: string | null, token: string) {
//   const reciboHonorarios = uuid
//     ? (await ApiFecthAuth(endPoints.invoices.retrieve(uuid), token))?.data?.data
//     : null

//   const serial = await ApiFecthAuth(endPoints.quotations.nextSerial, token)

//   return {
//     reciboHonorarios,
//     serial: serial?.data ?? null
//   }
// }
