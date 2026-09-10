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

import { UUIDInterface } from '@/interfaces/structures/uuidInterface'
import { ApiPatchAuth } from '@/services/auth/axios/apiPatchAuth'
import { ApiPostAuth } from '@/services/auth/axios/apiPostAuth'
import endPoints from '@/services/auth/endPoints/endPoint'
import { prefix } from '@/services/envs/envs'
import { CheckForm } from '@/utils/checkForm'
import ResponseFromCreated from '@/utils/responseFromCreated'
import ResponseFromEdited from '@/utils/responseFromEdited'
import { useEffect, useRef, useState } from 'react'
import { CondicionInterface } from '@/interfaces/querys/queryInterface'
import ResetForm from '@/utils/resetForm'
import { CondicionBodyInterface } from '@/interfaces/structures/bodyFormInterface'
import { ApiFecthAuth } from '@/services/auth/axios/apiFetchAuth'
import TextArea from '@/components/atom/structures/textArea'

const CondicionesMod: React.FC<UUIDInterface> = ({ uuid }) => {
  const { token, enterprise, ready } = useAuth()
  const [submitLoaded, setSubmitLoaded] = useState<boolean>(false)
  const [condicion, setCondicion] = useState<CondicionInterface | null>(null)

  const [contenido, setContenido] = useState<string>('')

  const tituloRef = useRef<HTMLInputElement>(null)
  const estadoRef = useRef<HTMLInputElement>(null)
  const porDefectoRef = useRef<HTMLInputElement>(null)
  const contenidoRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    const fetchData = async () => {
      if (!ready || !token || !enterprise) return
      try {
        const data = await getData(uuid ? uuid : '', token)
        const cond = data.props.condicion
        if (cond) setCondicion(cond)
      } catch (error) {
        ToastNotification('danger', `Ha ocurrido un error - ${error}`)
      }
    }

    if (uuid && token) fetchData()
  }, [uuid, token, ready, enterprise])

  useEffect(() => {
    if (condicion) {
      if (tituloRef.current) tituloRef.current.value = condicion.titulo || ''
      if (estadoRef.current) estadoRef.current.checked = condicion.estado
      if (porDefectoRef.current)
        porDefectoRef.current.checked = condicion.porDefecto
      setContenido(condicion.contenido || '')
    }
  }, [condicion])

  // const ChangeContenido = (
  //   e: React.KeyboardEvent<HTMLTextAreaElement> | string
  // ) => {
  //   setContenido(e.toString())
  // }

  const ChangeContenido = (value: string) => {
    setContenido(value)
  }

  const formData = {
    titulo: {
      name: 'titulo',
      id: 'titulo',
      showLabel: true,
      label: 'Título de Condición',
      ref: tituloRef,
      required: true,
      tiny: true
    },
    contenido: {
      name: 'contenido',
      id: 'contenido',
      showLabel: true,
      ref: contenidoRef,
      required: true,
      label: 'Descripción',
      type: 'tinyMCE',
      row: 300,
      minLen: 100,
      maxLen: 10000,
      value: contenido,
      // defaultValue: condicion ? condicion.contenido : '',
      onChange: (value: string) => ChangeContenido(value)
    },
    por_defecto: {
      name: 'por_defecto',
      id: 'por_defecto',
      showLabel: true,
      label: 'Por defecto',
      ref: porDefectoRef,
      required: true,
      tiny: true,
      type: 'switch'
    },
    estado: {
      name: 'estado',
      id: 'estado',
      showLabel: true,
      label: 'Estado',
      ref: estadoRef,
      required: true,
      type: 'switch',
      value: uuid ? condicion?.estado : true,
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
      { ref: tituloRef, message: 'Debe ingresar el título' },

      {
        ref: contenidoRef,
        message: 'Debe ingresar la descripcion de la condición'
      }
    ]

    const resetFields = [
      {
        refs: [tituloRef, contenidoRef, estadoRef, porDefectoRef],
        resetValues: []
      }
    ]

    const resetAllFields = ResetForm({ resetFields })

    const handlerResetfield = () => {
      resetAllFields()
      setContenido('')

      if (estadoRef.current) {
        estadoRef.current.checked = true
      }
      if (porDefectoRef.current) {
        porDefectoRef.current.checked = true
      }
    }

    if (CheckForm(fields)) {
      const body: CondicionBodyInterface = {
        titulo: tituloRef.current ? tituloRef.current.value : '',
        contenido: contenido,
        estado: estadoRef.current ? !!estadoRef.current.checked : false,
        por_defecto: porDefectoRef.current
          ? !!porDefectoRef.current.checked
          : false
      }

      setSubmitLoaded(true)
      const endPoint = uuid
        ? endPoints.condiciones.patch(uuid)
        : endPoints.condiciones.create

      if (uuid) {
        const response = await ApiPatchAuth(endPoint, token || '', body)
        ResponseFromEdited({
          response,
          returnSuccess: `/generales/condiciones?t=s&m=edit`
        })
      } else {
        const response = await ApiPostAuth(endPoint, token || '', body)
        ResponseFromCreated({
          response,
          successMessage: 'Condición registrada SATISFACTORIAMENTE.',
          handlerResetfield
        })
      }
      setSubmitLoaded(false)
    }
  }

  return (
    <PageContainer>
      <PageTitle description={uuid ? 'Editar condición' : 'Nueva condición'} />
      <GoBack enlace={`${prefix}/generales/condiciones/`} />
      <PageContent>
        <Formulary onSubmit={onSubmit}>
          <FormContainer>
            {/* Título */}
            <FormContent className='w-full'>
              <Input data={formData.titulo} />
            </FormContent>

            {/* Contenido con TinyMCE */}
            <FormContent className='w-full mt-5'>
              <TextArea data={formData.contenido} />
            </FormContent>

            {/* Switches */}
            <FormContent className='w-full xl:w-3/12 xl:pt-5'>
              <Input data={formData.por_defecto} />
            </FormContent>
            <FormContent className='w-full xl:w-3/12 xl:pt-5'>
              <Input data={formData.estado} />
            </FormContent>

            {/* Botón */}
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

export default CondicionesMod

// revisar endpoint
async function getData(uuid: string | undefined, token: string | null) {
  if (token) {
    const condicion =
      uuid && uuid.length > 0
        ? await ApiFecthAuth(endPoints.condiciones.retrieve(uuid), token)
        : null

    return {
      props: { condicion: condicion ? condicion.data : null },
      revalidate: 3600
    }
  } else {
    return {
      props: { condicion: null },
      revalidate: 3600
    }
  }
}
