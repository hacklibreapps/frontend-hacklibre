'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/atom/structures/button'
import Input from '@/components/atom/structures/input'
import { ApiPostAuth } from '@/services/auth/axios/apiPostAuth'
import { useAuth } from '@/context/authContext'
import endPoints from '@/services/auth/endPoints/endPoint'
import ResponseFromCreated from '@/utils/responseFromCreated'
import { CheckForm } from '@/utils/checkForm'
import ResetForm from '@/utils/resetForm'
import { ApiPatchAuth } from '@/services/auth/axios/apiPatchAuth'
import ResponseFromEdited from '@/utils/responseFromEdited'
import { UUIDInterface } from '@/interfaces/structures/uuidInterface'
import { MovimientoBancarioInterface } from '@/interfaces/querys/queryInterface'
import { MovimientoBancarioBodyInterface } from '@/interfaces/structures/bodyFormInterface'
import { ToastNotification } from '@/components/atom/structures/toast'
import { ApiFecthAuth } from '@/services/auth/axios/apiFetchAuth'
import PageContainer from '@/components/atom/structures/containers/pageContainer'
import PageTitle from '@/components/atom/auth/structures/pageTitlte'
import PageContent from '@/components/atom/structures/containers/pageContent'
import Formulary from '@/components/molecule/auth/structures/formulary'
import FormContent from '@/components/molecule/auth/structures/formContent'
import FormContainer from '@/components/molecule/auth/structures/formContainer'
import Select from '@/components/atom/structures/select'
import GoBack from '@/components/atom/goback'
import { prefix } from '@/services/envs/envs'
import TextArea from '@/components/atom/structures/textArea'

const MovimientoBancarioMod: React.FC<UUIDInterface> = ({ uuid }) => {
  const { token, enterprise, ready } = useAuth()
  const [submitLoaded, setSubmitLoaded] = useState(false)
  const [movimientoBancario, setMovimientoBancario] =
    useState<MovimientoBancarioInterface | null>(null)

  // === Referencias del formulario ===
  const enterpriseRef = useRef<HTMLInputElement>(null)
  const conceptRef = useRef<HTMLInputElement>(null)
  const bankRef = useRef<HTMLInputElement>(null)
  const currencyRef = useRef<HTMLInputElement>(null)
  const operationNumberRef = useRef<HTMLInputElement>(null)
  const operationDateRef = useRef<HTMLInputElement>(null)
  const processDateRef = useRef<HTMLInputElement>(null)
  const incomeRef = useRef<HTMLInputElement>(null)
  const egressRef = useRef<HTMLInputElement>(null)
  const observationRef = useRef<HTMLTextAreaElement>(null)

  const SectionTitle = ({ title }: { title: string }) => (
    <h3 className='text-sm font-semibold text-slate-600 uppercase tracking-wide border-b border-slate-200 pb-2 mb-4'>
      {title}
    </h3>
  )

  useEffect(() => {
    const fetchData = async () => {
      if (!ready || !token || !enterprise) return
      try {
        const data = await getData(uuid ? uuid : '', token)

        if (uuid && uuid.length > 0) {
          setMovimientoBancario(data.props.movimientoBancario)
        }
      } catch (error) {
        ToastNotification('danger', `Ha ocurrido un error - ${error}`)
      }
    }
    fetchData()
  }, [uuid, token, ready, enterprise])

  useEffect(() => {
    if (movimientoBancario) {
      if (enterpriseRef.current) {
        enterpriseRef.current.value = movimientoBancario.enterprise || ''
      }

      if (conceptRef.current) {
        conceptRef.current.value = movimientoBancario.concept || ''
      }

      if (bankRef.current) {
        bankRef.current.value = movimientoBancario.bank || ''
      }

      if (currencyRef.current) {
        currencyRef.current.value = movimientoBancario.currency || ''
      }

      if (operationNumberRef.current) {
        operationNumberRef.current.value =
          movimientoBancario.operationNumber || ''
      }

      if (operationDateRef.current) {
        operationDateRef.current.value = movimientoBancario.operationDate || ''
      }

      if (processDateRef.current) {
        processDateRef.current.value = movimientoBancario.processDate || ''
      }

      if (incomeRef.current) {
        incomeRef.current.value =
          movimientoBancario.income !== undefined
            ? movimientoBancario.income.toString()
            : ''
      }

      if (egressRef.current) {
        egressRef.current.value =
          movimientoBancario.egress !== undefined
            ? movimientoBancario.egress.toString()
            : ''
      }

      if (observationRef.current) {
        observationRef.current.value = movimientoBancario.observation || ''
      }
    }
  }, [movimientoBancario])

  const formData = {
    enterprise: {
      name: 'enterprise',
      id: 'enterprise',
      label: 'Empresa Relacionada',
      showLabel: true,
      ref: enterpriseRef,
      required: true,
      tiny: true
    },
    concept: {
      name: 'concept',
      id: 'concept',
      label: 'Concepto de Movimiento',
      showLabel: true,
      ref: conceptRef,
      required: true,
      tiny: true
    },
    bank: {
      name: 'bank',
      id: 'bank',
      label: 'Banco',
      showLabel: true,
      ref: bankRef,
      required: true,
      tiny: true
    },
    currency: {
      name: 'currency',
      id: 'currency',
      label: 'Moneda',
      showLabel: true,
      ref: currencyRef,
      required: true,
      tiny: true
    },
    operation_number: {
      name: 'operation_number',
      id: 'operation_number',
      label: 'Número de Operación',
      showLabel: true,
      ref: operationNumberRef,
      required: true,
      tiny: true
    },
    operation_date: {
      name: 'operation_date',
      id: 'operation_date',
      label: 'Fecha de Operación',
      showLabel: true,
      ref: operationDateRef,
      required: true,
      type: 'date',
      placeHolder: 'Elija la fecha de operación',
      tiny: true
    },
    process_date: {
      name: 'process_date',
      id: 'process_date',
      label: 'Fecha de Proceso',
      showLabel: true,
      ref: processDateRef,
      required: true,
      type: 'date',
      placeHolder: 'Elija la fecha de proceso',
      tiny: true
    },
    income: {
      name: 'income',
      id: 'income',
      label: 'Ingreso',
      showLabel: true,
      ref: incomeRef,
      required: true,
      type: 'number',
      tiny: true
    },
    egress: {
      name: 'egress',
      id: 'egress',
      label: 'Egreso',
      showLabel: true,
      ref: egressRef,
      required: true,
      type: 'number',
      tiny: true
    },
    observation: {
      name: 'observation',
      id: 'observation',
      label: 'Observación',
      showLabel: true,
      ref: observationRef,
      required: false,
      row: 5,
      minLen: 1,
      maxLen: 10000,

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
      { ref: conceptRef, message: 'Debe ingresar el concepto' },
      { ref: bankRef, message: 'Debe ingresar el banco' },
      { ref: currencyRef, message: 'Debe seleccionar una moneda' },
      {
        ref: operationNumberRef,
        message: 'Debe ingresar el número de operación'
      },
      { ref: operationDateRef, message: 'Debe ingresar la fecha de operación' },
      { ref: processDateRef, message: 'Debe ingresar la fecha de proceso' },
      { ref: incomeRef, message: 'Debe ingresar el monto de ingreso' },
      { ref: egressRef, message: 'Debe ingresar el monto de egreso' }
    ]

    const resetFields = [
      {
        refs: [
          enterpriseRef,
          conceptRef,
          bankRef,
          currencyRef,
          operationNumberRef,
          operationDateRef,
          processDateRef,
          incomeRef,
          egressRef,
          observationRef
        ],
        resetValues: ['', '', '', '', '', '', '', '', '', '']
      }
    ]

    const resetAllFields = ResetForm({ resetFields })

    const handlerResetfield = () => {
      resetAllFields()
    }

    if (CheckForm(fields)) {
      const body: MovimientoBancarioBodyInterface = {
        enterprise: enterpriseRef.current ? enterpriseRef.current.value : '',
        concept: conceptRef.current ? conceptRef.current.value : '',
        bank: bankRef.current ? bankRef.current.value : '',
        currency: currencyRef.current ? currencyRef.current.value : '',
        operation_number: operationNumberRef.current
          ? operationNumberRef.current.value
          : '',
        operation_date: operationDateRef.current
          ? operationDateRef.current.value
          : '',
        process_date: processDateRef.current
          ? processDateRef.current.value
          : '',
        income: incomeRef.current
          ? parseFloat(incomeRef.current.value) || 0
          : 0,
        egress: egressRef.current
          ? parseFloat(egressRef.current.value) || 0
          : 0,
        observation: observationRef.current ? observationRef.current.value : ''
      }

      setSubmitLoaded(true)

      const endPoint = uuid
        ? `${endPoints.bankMovements.patch(uuid)}`
        : endPoints.clients.postClientes

      if (uuid) {
        const response = await ApiPatchAuth(endPoint, token ? token : '', body)
        ResponseFromEdited({
          response,
          returnSuccess: '/movimientos/?t=s&m=edit'
        })
      } else {
        const response = await ApiPostAuth(endPoint, token ? token : '', body)
        ResponseFromCreated({
          response,
          successMessage: 'Movimiento Bancario registrado SATISFACTORIAMENTE.',
          handlerResetfield
        })
      }
      setSubmitLoaded(false)
    }
  }

  return (
    <PageContainer>
      <PageTitle description='Agregar Movimiento Bancario' />
      <GoBack enlace={`${prefix}/movimientos/`} />
      <PageContent>
        <Formulary onSubmit={onSubmit}>
          <FormContainer>
            <div className='w-full bg-white border border-slate-300 rounded-lg p-6 shadow-sm space-y-8'>
              {/* === CONTEXTO GENERAL === */}
              <section>
                <SectionTitle title='Contexto del Movimiento' />
                <div className='flex flex-wrap gap-4'>
                  <FormContent className='w-full md:w-6/12 xl:w-3/12'>
                    <Select data={formData.enterprise} />
                  </FormContent>

                  <FormContent className='w-full md:w-6/12 xl:w-3/12'>
                    <Select data={formData.bank} />
                  </FormContent>

                  <FormContent className='w-full md:w-6/12 xl:w-3/12'>
                    <Select data={formData.currency} />
                  </FormContent>
                </div>
              </section>

              {/* === DATOS DE LA OPERACIÓN === */}
              <section>
                <SectionTitle title='Datos de la Operación' />
                <div className='flex flex-wrap gap-4'>
                  <FormContent className='w-full md:w-6/12 xl:w-3/12'>
                    <Input data={formData.concept} />
                  </FormContent>

                  <FormContent className='w-full md:w-6/12 xl:w-3/12'>
                    <Input data={formData.operation_number} />
                  </FormContent>

                  <FormContent className='w-full md:w-6/12 xl:w-3/12'>
                    <Input data={formData.operation_date} />
                  </FormContent>

                  <FormContent className='w-full md:w-6/12 xl:w-3/12'>
                    <Input data={formData.process_date} />
                  </FormContent>
                </div>
              </section>

              {/* === IMPORTES === */}
              <section>
                <SectionTitle title='Importes del Movimiento' />
                <div className='flex flex-wrap gap-4'>
                  <FormContent className='w-full md:w-6/12 xl:w-3/12'>
                    <Input
                      data={{ ...formData.income, className: 'text-green-700' }}
                    />
                  </FormContent>

                  <FormContent className='w-full md:w-6/12 xl:w-3/12'>
                    <Input
                      data={{ ...formData.egress, className: 'text-red-700' }}
                    />
                  </FormContent>
                </div>
              </section>

              {/* === OBSERVACIÓN === */}
              <section>
                <SectionTitle title='Observación' />
                <div className='flex flex-wrap gap-4'>
                  <FormContent className='w-full'>
                    <TextArea data={formData.observation} />
                  </FormContent>
                </div>
              </section>

              {/* === ACCIÓN === */}
              <div className='pt-6 flex justify-end border-t border-slate-200'>
                <div className='w-full md:w-1/3'>
                  <Button data={formData.submit} />
                </div>
              </div>
            </div>
          </FormContainer>
        </Formulary>
      </PageContent>
    </PageContainer>
  )
}

export default MovimientoBancarioMod

async function getData(uuid: string | undefined, token: string | null) {
  if (token) {
    const movimientoBancario =
      uuid && uuid.length > 0
        ? await ApiFecthAuth(endPoints.bankMovements.retrieve(uuid), token)
        : null

    return {
      props: {
        movimientoBancario: movimientoBancario ? movimientoBancario.data : null
      },
      revalidate: 3600
    }
  }
  return { props: { cliente: null }, revalidate: 3600 }
}
