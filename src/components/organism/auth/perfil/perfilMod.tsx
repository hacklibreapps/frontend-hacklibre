'use client'

import { useEffect, useRef, useState } from 'react'
import PageTitle from '@/components/atom/auth/structures/pageTitlte'
import Formulary from '@/components/molecule/auth/structures/formulary'
import FormContainer from '@/components/molecule/auth/structures/formContainer'
import FormContent from '@/components/molecule/auth/structures/formContent'
import { CheckForm } from '@/utils/checkForm'
import ResponseFromEdited from '@/utils/responseFromEdited'
import { ApiFecthAuth } from '@/services/auth/axios/apiFetchAuth'
import { ApiPatchAuth } from '@/services/auth/axios/apiPatchAuth'
import { useAuth } from '@/context/authContext'
import { prefix } from '@/services/envs/envs'
import GoBack from '@/components/atom/goback'
import { Button } from '@/components/atom/structures/button'
import Input from '@/components/atom/structures/input'
import PageContent from '@/components/atom/structures/containers/pageContent'
import PageContainer from '@/components/atom/structures/containers/pageContainer'
import { ToastNotification } from '@/components/atom/structures/toast'
import endPoints from '@/services/auth/endPoints/endPoint'
import { PerfilBodyInterface } from '@/interfaces/structures/bodyFormInterface'
import { PerfilInterface } from '@/interfaces/querys/queryInterface'

const PerfilMod: React.FC = () => {
  const { token, enterprise, ready } = useAuth()
  const [submitLoaded, setSubmitLoaded] = useState(false)
  const [userData, setUserData] = useState<PerfilInterface | null>(null)
  const [validEmail, setValidEmail] = useState(true)

  const firstnameRef = useRef<HTMLInputElement>(null)
  const lastnameRef = useRef<HTMLInputElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)

  const doctypeRef = useRef<HTMLInputElement>(null)
  const docnumberRef = useRef<HTMLInputElement>(null)
  const relationenterpriseRef = useRef<HTMLInputElement>(null)
  const contractenterpriseRef = useRef<HTMLInputElement>(null)
  const photoRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const fetchProfile = async () => {
      if (!ready || !token || !enterprise) return

      try {
        const data = await getData(token)
        const usuario = data.props.usuario as PerfilInterface | null
        setUserData(usuario)
      } catch (err) {
        ToastNotification('danger', `No se pudo cargar el perfil - ${err}`)
      }
    }
    fetchProfile()
  }, [enterprise, ready, token])

  useEffect(() => {
    if (!userData) return
    if (firstnameRef.current)
      firstnameRef.current.value = userData.firstName || ''
    if (lastnameRef.current) lastnameRef.current.value = userData.lastName || ''
    if (emailRef.current) emailRef.current.value = userData.email || ''
  }, [userData])

  // ==== Validaciones ====
  const emailAllowedChars: React.FormEventHandler<HTMLInputElement> = (e) => {
    const input = e.currentTarget
    const regex = /^[a-zA-Z0-9._%+-@]*$/
    if (!regex.test(input.value)) {
      input.value = input.value.replace(/[^a-zA-Z0-9._%+-@]/g, '')
    }
  }

  //   const emailFormatCheckKeyUp: React.KeyboardEventHandler<HTMLInputElement> = (
  //     e
  //   ) => {
  //     const value = e.currentTarget.value.trim()
  //     const isValid = value.length > 0 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
  //     setValidEmail(isValid)
  //   }

  const emailFormatCheckKeyUp = (
    e: string | React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (typeof e === 'string') return // ignorar si llega string

    const value = e.currentTarget.value.trim()
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
    setValidEmail(isValid)
  }

  const formData = {
    firstName: {
      name: 'firstName',
      id: 'firstName',
      label: 'Nombres',
      showLabel: true,
      ref: firstnameRef,
      type: 'text',
      required: true
    },
    lastName: {
      name: 'lastName',
      id: 'lastName',
      label: 'Apellidos',
      showLabel: true,
      ref: lastnameRef,
      type: 'text',
      required: true
    },
    email: {
      name: 'email',
      id: 'email',
      label: 'Correo Electrónico',
      showLabel: true,
      ref: emailRef,
      type: 'email',
      onInput: emailAllowedChars,
      onKeyUp: emailFormatCheckKeyUp,
      required: true,
      validInput: validEmail
    },
    submit: {
      name: 'submit',
      id: 'submit',
      label: 'submit',
      showLabel: false,
      type: 'submit',
      buttonName: 'Guardar Cambios',
      disabled: submitLoaded,
      loaded: submitLoaded
    }
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const required = [
      { ref: firstnameRef, message: 'Debe ingresar sus nombres' },
      { ref: lastnameRef, message: 'Debe ingresar sus apellidos' },
      { ref: emailRef, message: 'Debe ingresar su correo electrónico' }
    ]
    if (!CheckForm(required)) return

    const emailValue = emailRef.current?.value.trim() || ''
    const emailOk =
      emailValue.length > 0 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue)
    if (!emailOk) {
      setValidEmail(false)
      ToastNotification('warning', 'Ingrese un correo electrónico válido')
      return
    }

    const body: PerfilBodyInterface = {
      first_name: firstnameRef.current ? firstnameRef.current.value : '',
      last_name: lastnameRef.current ? lastnameRef.current.value : '',
      email: emailRef.current ? emailRef.current.value : '',

      doc_type: doctypeRef.current ? doctypeRef.current.value : '',
      doc_number: docnumberRef.current ? docnumberRef.current.value : '',
      relation_enterprise: relationenterpriseRef.current
        ? relationenterpriseRef.current.value
        : '',
      contract_enterprise: contractenterpriseRef.current
        ? contractenterpriseRef.current.value
        : '',
      photo: photoRef.current?.files?.[0] ?? null
    }

    try {
      setSubmitLoaded(true)
      const response = await ApiPatchAuth(
        endPoints.customer.perfilretrieve,
        token ?? '',
        body
      )
      ResponseFromEdited({
        response,
        returnSuccess: `/administrador/perfil?t=s&m=edit`
      })
    } catch (err) {
      ToastNotification('danger', `No se pudo actualizar el perfil - ${err}`)
    } finally {
      setSubmitLoaded(false)
    }
  }

  return (
    <PageContainer>
      <PageTitle description='Editar mi perfil' />
      <GoBack enlace={`${prefix}/`} />
      <PageContent>
        <Formulary onSubmit={onSubmit}>
          <FormContainer>
            <FormContent className='w-full xl:w-4/12'>
              <Input data={formData.firstName} />
            </FormContent>
            <FormContent className='w-full xl:w-4/12'>
              <Input data={formData.lastName} />
            </FormContent>
            <FormContent className='w-full xl:w-4/12'>
              <Input data={formData.email} />
            </FormContent>
            <FormContent className='w-full'>
              <div className='w-full xl:w-1/3 flex flex-row justify-center items-center pt-5'>
                <Button data={formData.submit} />
              </div>
            </FormContent>
          </FormContainer>
        </Formulary>
      </PageContent>
    </PageContainer>
  )
}

export default PerfilMod

async function getData(token: string | null) {
  if (!token) return { props: { usuario: null }, revalidate: 3600 }

  const resp = await ApiFecthAuth(endPoints.customer.perfilretrieve, token)
  return {
    props: { usuario: resp?.data ?? null },
    revalidate: 3600
  }
}
