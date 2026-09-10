'use client'

import PageTitle from '@/components/atom/auth/structures/pageTitlte'
import GoBack from '@/components/atom/goback'
import { Button } from '@/components/atom/structures/button'
import PageContainer from '@/components/atom/structures/containers/pageContainer'
import PageContent from '@/components/atom/structures/containers/pageContent'
import Input from '@/components/atom/structures/input'
import { ToastNotification } from '@/components/atom/structures/toast'
import FormContainer from '@/components/molecule/auth/structures/formContainer'
import FormContent from '@/components/molecule/auth/structures/formContent'
import Formulary from '@/components/molecule/auth/structures/formulary'
import { useAuth } from '@/context/authContext'
import { UnidadMedidaInterface } from '@/interfaces/querys/queryInterface'
import { UnidadMedidaBodyInterface } from '@/interfaces/structures/bodyFormInterface'
import { UUIDInterface } from '@/interfaces/structures/uuidInterface'
import { ApiFecthAuth } from '@/services/auth/axios/apiFetchAuth'
import { ApiPatchAuth } from '@/services/auth/axios/apiPatchAuth'
import { ApiPostAuth } from '@/services/auth/axios/apiPostAuth'
import endPoints from '@/services/auth/endPoints/endPoint'
import { prefix } from '@/services/envs/envs'
import { CheckForm } from '@/utils/checkForm'
import ResetForm from '@/utils/resetForm'
import ResponseFromCreated from '@/utils/responseFromCreated'
import ResponseFromEdited from '@/utils/responseFromEdited'
import { useEffect, useRef, useState } from 'react'

const UnidadesMod: React.FC<UUIDInterface> = ({ uuid }) => {
  const { token, enterprise, ready } = useAuth()
  const [submitLoaded, setSubmitLoaded] = useState<boolean>(false)
  const [unidad, setUnidad] = useState<UnidadMedidaInterface | null>(null)

  const nombreRef = useRef<HTMLInputElement>(null)
  const abreviaturaRef = useRef<HTMLInputElement>(null)
  const estadoRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const fetchData = async () => {
      if (!ready || !token || !enterprise) return
      try {
        const data = await getData(uuid, token)
        const unidad = data.props.unidad
        if (unidad) setUnidad(unidad)
      } catch (error) {
        ToastNotification('danger', `Error cargando unidad - ${error}`)
      }
    }
    if (uuid && token) fetchData()
  }, [uuid, token, ready, enterprise])

  useEffect(() => {
    if (unidad) {
      if (nombreRef.current) nombreRef.current.value = unidad.name
      if (abreviaturaRef.current) abreviaturaRef.current.value = unidad.abbr
    }
  }, [unidad])

  const formData = {
    nombre: {
      name: 'nombre',
      id: 'nombre',
      showLabel: true,
      label: 'Nombre',
      ref: nombreRef,
      required: true,
      tiny: true
    },
    abreviatura: {
      name: 'abreviatura',
      id: 'abreviatura',
      showLabel: true,
      label: 'Abreviatura',
      ref: abreviaturaRef,
      required: true,
      tiny: true
    },
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

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const fields = [{ ref: nombreRef, message: 'Debe ingresar el nombre' }]

    const resetFields = [
      {
        refs: [nombreRef, abreviaturaRef],
        resetValues: []
      }
    ]

    const resetAllFields = ResetForm({ resetFields })

    const handlerResetfield = () => {
      resetAllFields()
      if (estadoRef.current) estadoRef.current.checked = true
    }

    if (CheckForm(fields)) {
      const body: UnidadMedidaBodyInterface = {
        name: nombreRef.current?.value || '',
        abbr: abreviaturaRef.current?.value || ''
      }

      setSubmitLoaded(true)
      const endPoint = uuid
        ? endPoints.mainData.unidadMedida.patch(uuid)
        : endPoints.mainData.unidadMedida.create

      if (uuid) {
        const response = await ApiPatchAuth(endPoint, token || '', body)
        ResponseFromEdited({
          response,
          returnSuccess: `/generales/unidadmedida?t=s&m=edit`
        })
      } else {
        const response = await ApiPostAuth(endPoint, token || '', body)
        ResponseFromCreated({
          response,
          successMessage: 'Unidad registrada SATISFACTORIAMENTE.',
          handlerResetfield
        })
      }
      setSubmitLoaded(false)
    }
  }

  return (
    <PageContainer>
      <PageTitle description={uuid ? 'Editar unidad' : 'Nueva unidad'} />
      <GoBack enlace={`${prefix}/generales/unidadmedida/`} />
      <PageContent>
        <Formulary onSubmit={onSubmit}>
          <FormContainer>
            <FormContent className='w-full xl:w-3/12'>
              <Input data={formData.nombre} />
            </FormContent>
            <FormContent className='w-full xl:w-3/12'>
              <Input data={formData.abreviatura} />
            </FormContent>
            <FormContent
              className='w-full'
              classNameInter='flex flex-row justify-center items-center'
            >
              <div className='w-full xl:w-1/3 pt-5'>
                <Button data={formData.submit} />
              </div>
            </FormContent>
          </FormContainer>
        </Formulary>
      </PageContent>
    </PageContainer>
  )
}

export default UnidadesMod

async function getData(uuid: string | undefined, token: string | null) {
  if (token) {
    const unidad =
      uuid && uuid.length > 0
        ? await ApiFecthAuth(
            endPoints.mainData.unidadMedida.retrieve(uuid),
            token
          )
        : null
    return { props: { unidad: unidad ? unidad.data : null }, revalidate: 3600 }
  }
  return { props: { unidad: null }, revalidate: 3600 }
}
