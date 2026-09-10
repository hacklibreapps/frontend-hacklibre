'use client'

import React, { useRef, useState } from 'react'
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
import { BoletaCompraBodyInterface } from '@/interfaces/structures/bodyFormInterface'
import { ApiPatchAuth } from '@/services/auth/axios/apiPatchAuth'
import { ApiPostAuth } from '@/services/auth/axios/apiPostAuth'
import { ApiFecthAuth } from '@/services/auth/axios/apiFetchAuth'
import { ToastNotification } from '@/components/atom/structures/toast'
import ResponseFromCreated from '@/utils/responseFromCreated'
import ResponseFromEdited from '@/utils/responseFromEdited'
import { CheckForm } from '@/utils/checkForm'

const BoletaCompraMod: React.FC<UUIDInterface> = ({ uuid }) => {
  const { token } = useAuth()
  const [submitLoaded, setSubmitLoaded] = useState(false)

  // temporal - eliminar al terminar - REVISAR
  const tmp = getData(uuid, token)
  console.log(tmp)
  // fin temporal

  // === refs ===
  const serieRef = useRef<HTMLInputElement>(null)
  const numeroRef = useRef<HTMLInputElement>(null)
  const dniRucEmisorRef = useRef<HTMLInputElement>(null)
  const nombreEmisorRef = useRef<HTMLInputElement>(null)
  const fechaEmisionRef = useRef<HTMLInputElement>(null)
  const monedaRef = useRef<HTMLInputElement>(null)
  const importeTotalRef = useRef<HTMLInputElement>(null)
  const gravadoBaseRef = useRef<HTMLInputElement>(null)
  const igvRef = useRef<HTMLInputElement>(null)
  const tipoGastoRef = useRef<HTMLInputElement>(null)
  const centroCostoRef = useRef<HTMLInputElement>(null)
  const archivoAdjuntoRef = useRef<HTMLInputElement>(null)
  const estadoRef = useRef<HTMLInputElement>(null)

  const SectionTitle = ({ title }: { title: string }) => (
    <h3 className='text-sm font-semibold text-slate-600 uppercase tracking-wide border-b border-slate-200 pb-2 mb-4'>
      {title}
    </h3>
  )

  /* === FORM DATA === */
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
    dniRucEmisor: {
      label: 'DNI o RUC del Emisor',
      showLabel: true,
      name: 'dni_o_ruc_emisor',
      id: 'dni_o_ruc_emisor',
      ref: dniRucEmisorRef,
      required: true,
      tiny: true
    },
    nombreEmisor: {
      label: 'Nombre o Razón Social del Emisor',
      showLabel: true,
      name: 'nombre_emisor',
      id: 'nombre_emisor',
      ref: nombreEmisorRef,
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
    moneda: {
      label: 'Moneda',
      showLabel: true,
      name: 'moneda',
      id: 'moneda',
      ref: monedaRef,
      required: true,
      data: [
        { key: 'PEN', value: 'Soles' },
        { key: 'USD', value: 'Dólares' }
      ],
      tiny: true
    },
    importeTotal: {
      label: 'Importe Total',
      showLabel: true,
      name: 'importe_total',
      id: 'importe_total',
      ref: importeTotalRef,
      required: true,
      type: 'number',
      tiny: true
    },

    gravadoBase: {
      label: 'Valor Gravado (Base)',
      showLabel: true,
      name: 'gravado_base',
      id: 'gravado_base',
      ref: gravadoBaseRef,
      required: false,
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
      required: false,
      type: 'number',
      tiny: true,
      readOnly: true
    },

    tipoGasto: {
      label: 'Tipo de Gasto',
      showLabel: true,
      name: 'tipo_gasto',
      id: 'tipo_gasto',
      ref: tipoGastoRef,
      required: false,
      tiny: true
    },
    centroCosto: {
      label: 'Centro de Costo',
      showLabel: true,
      name: 'centro_costo',
      id: 'centro_costo',
      ref: centroCostoRef,
      required: false,
      tiny: true
    },
    archivoAdjunto: {
      label: 'Archivo Adjunto (PDF)',
      showLabel: true,
      name: 'archivo_adjunto',
      id: 'archivo_adjunto',
      ref: archivoAdjuntoRef,
      type: 'file',
      accept: '.pdf',
      tiny: true
    },
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

  /* === SUBMIT HANDLER === */
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const fields = [
      { ref: serieRef, message: 'Debe ingresar la serie de la boleta' },
      { ref: numeroRef, message: 'Debe ingresar el número de boleta' },
      {
        ref: dniRucEmisorRef,
        message: 'Debe ingresar el DNI o RUC del emisor'
      },
      { ref: nombreEmisorRef, message: 'Debe ingresar el nombre del emisor' },
      { ref: fechaEmisionRef, message: 'Debe ingresar la fecha de emisión' },
      { ref: importeTotalRef, message: 'Debe ingresar el importe total' }
    ]

    if (!CheckForm(fields)) return
    if (!token) {
      ToastNotification('danger', 'No hay sesión activa.')
      return
    }

    const resetFields = [
      {
        refs: [
          serieRef,
          numeroRef,
          dniRucEmisorRef,
          nombreEmisorRef,
          fechaEmisionRef,
          importeTotalRef
        ],
        resetValues: ['']
      }
    ]

    const body: BoletaCompraBodyInterface = {
      empresa: '', // cuando se asocie el uuid empresa
      tipo_comprobante: 'BOLETA',
      serie: serieRef.current?.value || '',
      numero: numeroRef.current?.value || '',
      dni_o_ruc_emisor: dniRucEmisorRef.current?.value || '',
      nombre_emisor: nombreEmisorRef.current?.value || '',
      fecha_emision: fechaEmisionRef.current?.value || null,
      moneda: (monedaRef.current?.value as 'PEN' | 'USD') || 'PEN',
      importe_total: importeTotalRef.current?.value || '0.00',
      gravado_base: gravadoBaseRef.current?.value || '0.00',
      igv: igvRef.current?.value || '0.00',
      tipo_gasto: tipoGastoRef.current?.value || '',
      centro_costo: centroCostoRef.current?.value || '',
      archivo_adjunto: archivoAdjuntoRef.current?.value || '',
      estado:
        (estadoRef.current?.value as 'registrada' | 'pagada' | 'anulada') ||
        'registrada',
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
          returnSuccess: `/boletas-compra?t=s&m=edit`
        })
      } else {
        const response = await ApiPostAuth(endPoint, token, body)
        ResponseFromCreated({
          response,
          successMessage: 'Boleta de Compra registrada SATISFACTORIAMENTE.',
          handlerResetfield
        })
      }
    } catch (err) {
      console.error('[BOLETA COMPRA] submit error:', err)
      ToastNotification('danger', 'No se pudo procesar la boleta de compra.')
    } finally {
      setSubmitLoaded(false)
    }
  }

  // if (!gravadoBaseRef.current?.value || !igvRef.current?.value) {
  //   ToastNotification(
  //     'warning',
  //     'El IGV y la base gravada deben calcularse automáticamente.'
  //   )
  //   return
  // }

  const calcularImpuestos = (value: string) => {
    const total = parseFloat(value)

    if (isNaN(total) || total <= 0) {
      if (gravadoBaseRef.current) gravadoBaseRef.current.value = ''
      if (igvRef.current) igvRef.current.value = ''
      return
    }

    const base = total / 1.18
    const igv = total - base

    if (gravadoBaseRef.current) {
      gravadoBaseRef.current.value = base.toFixed(2)
    }

    if (igvRef.current) {
      igvRef.current.value = igv.toFixed(2)
    }
  }

  /* === RENDER === */
  return (
    <PageContainer>
      <PageTitle description='Nueva boleta de compra' />
      <GoBack enlace={`${prefix}/facturacion`} />

      <PageContent>
        <Formulary onSubmit={onSubmit}>
          <FormContainer>
            <FormContent>
              <div className='w-full bg-white border border-slate-300 rounded-lg p-6 shadow-sm space-y-8'>
                {/* === IDENTIFICACIÓN === */}
                <section>
                  <SectionTitle title='Identificación de la Boleta' />
                  <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                    <Input data={formData.serie} />
                    <Input data={formData.numero} />
                    <Input data={formData.fechaEmision} />
                  </div>
                </section>

                {/* === PROVEEDOR === */}
                <section>
                  <SectionTitle title='Datos del Proveedor' />
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <Input data={formData.dniRucEmisor} />
                    <Input data={formData.nombreEmisor} />
                  </div>
                </section>

                {/* === IMPORTES === */}
                <section>
                  <SectionTitle title='Importes Tributarios' />
                  <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                    <Input data={formData.gravadoBase} />
                    <Input data={formData.igv} />

                    <Input
                      data={{
                        ...formData.importeTotal,
                        onChange: calcularImpuestos
                      }}
                    />
                  </div>
                </section>

                {/* === CLASIFICACIÓN === */}
                <section>
                  <SectionTitle title='Clasificación Contable' />
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <Input data={formData.tipoGasto} />
                    <Input data={formData.centroCosto} />
                  </div>
                </section>

                {/* === ESTADO === */}
                <section>
                  <SectionTitle title='Estado del Comprobante' />
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <Select data={formData.estado} />
                    <Select data={formData.moneda} />
                  </div>
                </section>

                {/* === DOCUMENTO === */}
                {/* <section>
                  <SectionTitle title='Documento Adjunto' />
                  <div className='border border-dashed border-slate-300 rounded-md p-4 bg-slate-50'>
                    <Input data={formData.archivoAdjunto} />
                    <p className='text-xs text-slate-500 mt-2'>
                      Adjunte la boleta escaneada o comprobante electrónico
                      (PDF).
                    </p>
                  </div>
                </section> */}

                <section>
                  <SectionTitle title='Documento Adjunto' />
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <Input data={formData.archivoAdjunto} />
                  </div>
                </section>

                {/* === ACCIÓN === */}
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

export { BoletaCompraMod }

/* === FUTURE FETCH FUNCTION (endpoint aún no creado) === */
async function getData(uuid: string | undefined, token: string | null) {
  if (token) {
    const boletaCompra =
      uuid && uuid.length > 0
        ? await ApiFecthAuth(endPoints.invoices.retrieve(uuid), token)
        : null
    return {
      props: {
        boletaCompra: boletaCompra
      },
      revalidate: 3600
    }
  }
  return { props: { boletaCompra: null }, revalidate: 3600 }
}
