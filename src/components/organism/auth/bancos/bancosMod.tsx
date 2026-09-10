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
import { BancoInterface } from '@/interfaces/querys/queryInterface'
import { BancosBodyInterface } from '@/interfaces/structures/bodyFormInterface'
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

const BancosMod: React.FC<UUIDInterface> = ({ uuid }) => {
  const { token, enterprise, ready } = useAuth()
  const [submitLoaded, setSubmitLoaded] = useState<boolean>(false)

  const [banco, setBanco] = useState<BancoInterface | null>(null)

  const nameRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const fetchData = async () => {
      if (!ready || !token || !enterprise) return // ⬅️ evita disparar sin header
      try {
        const data = await getData(uuid ? uuid : '', token)
        const banco = data.props.banco

        if (banco) {
          setBanco(banco)
        }
      } catch (error) {
        ToastNotification('danger', `Ha ocurrido un error - ${error}`)
      }
    }
    if (uuid && token) {
      fetchData()
    }
  }, [uuid, token, ready, enterprise])

  useEffect(() => {
    if (banco) {
      if (nameRef.current) {
        nameRef.current.value = banco.name || ''
      }
    }
  }, [banco])

  const formData = {
    nombre_banco: {
      name: 'nombre_banco',
      id: 'nombre_banco',
      showLabel: true,
      label: 'Nombre del banco',
      ref: nameRef,
      required: true
    },
    submit: {
      name: 'submit',
      id: 'submit',
      label: 'submit',
      showLabel: false,
      type: 'submit',
      buttonName: `${uuid ? 'Guardar' : 'Registrar'}`,
      disabled: submitLoaded,
      loaded: submitLoaded
    }
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const fields = [
      {
        ref: nameRef,
        message: 'Debe ingresar el nombre del producto'
      }
    ]

    const resetFields = [
      {
        refs: [nameRef],
        resetValues: []
      }
    ]

    const resetAllFields = ResetForm({ resetFields })

    const handlerResetfield = () => {
      resetAllFields()
    }

    if (CheckForm(fields)) {
      const body: BancosBodyInterface = {
        name: nameRef.current ? nameRef.current.value : ''
      }

      setSubmitLoaded(true)
      const endPoint = uuid
        ? endPoints.mainData.bancos.patch(uuid)
        : endPoints.mainData.bancos.create

      if (uuid) {
        const response = await ApiPatchAuth(endPoint, token ? token : '', body)
        ResponseFromEdited({
          response,
          returnSuccess: `/generales/bancos?t=s&m=edit`
        })
      } else {
        const response = await ApiPostAuth(endPoint, token ? token : '', body)
        ResponseFromCreated({
          response,
          successMessage: 'Bancos registrado SATISFACTORIAMENTE.',
          handlerResetfield
        })
      }

      setSubmitLoaded(false)
    }
  }

  return (
    <PageContainer>
      <PageTitle description={`${uuid ? 'Editar Banco' : 'Registrar Banco'}`} />
      <GoBack enlace={`${prefix}/generales/bancos/`} />

      <PageContent>
        <Formulary onSubmit={onSubmit}>
          <FormContainer>
            <FormContent className='w-full xl:w-3/12'>
              <Input data={formData.nombre_banco} />
            </FormContent>
            <FormContent
              className='w-full '
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

export default BancosMod

async function getData(uuid: string | undefined, token: string | null) {
  if (token) {
    const banco =
      uuid && uuid.length > 0
        ? await ApiFecthAuth(endPoints.mainData.bancos.retrieve(uuid), token)
        : null

    return {
      props: {
        banco: banco ? banco.data : null
      },
      revalidate: 3600
    }
  } else {
    return {
      props: {
        banco: null
      },
      revalidate: 3600
    }
  }
}
