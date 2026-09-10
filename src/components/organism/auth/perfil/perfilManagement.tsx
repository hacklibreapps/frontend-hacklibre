'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useAuth } from '@/context/authContext'
import { ApiFecthAuth } from '@/services/auth/axios/apiFetchAuth'
import { ApiPatchAuth } from '@/services/auth/axios/apiPatchAuth'
import PageContent from '@/components/atom/structures/containers/pageContent'
import endPoints from '@/services/auth/endPoints/endPoint'
import { ToastNotification } from '@/components/atom/structures/toast'
import { PerfilInterface } from '@/interfaces/querys/queryInterface'
import { validateImage } from '@/utils/validateImage'
import { Img } from '@/utils/img'
import { MdPhotoCamera } from 'react-icons/md'

// zxcvbn for password strength validation
import { zxcvbn, zxcvbnOptions } from '@zxcvbn-ts/core'
import {
  dictionary as commonDictionary,
  adjacencyGraphs
} from '@zxcvbn-ts/language-common'
import {
  dictionary as esDictionary,
  translations as esTranslations
} from '@zxcvbn-ts/language-es-es'
import { UUIDInterface } from '@/interfaces/structures/uuidInterface'
import { ApiPostAuth } from '@/services/auth/axios/apiPostAuth'
import ResponseFromEdited from '@/utils/responseFromEdited'
import Formulary from '@/components/molecule/auth/structures/formulary'
import FormContainer from '@/components/molecule/auth/structures/formContainer'
import Input from '@/components/atom/structures/input'
import FormContent from '@/components/molecule/auth/structures/formContent'
import { Button } from '@/components/atom/structures/button'
import Select from '@/components/atom/structures/select'
import { KeyValueInterface } from '@/interfaces/structures/keyValueInterface'
import { CheckForm } from '@/utils/checkForm'
import {
  PerfilBodyInterface,
  PerfilChangePasswordBodyInterface
} from '@/interfaces/structures/bodyFormInterface'

// ---------- zxcvbn config ----------
zxcvbnOptions.setOptions({
  dictionary: { ...commonDictionary, ...esDictionary },
  translations: esTranslations,
  graphs: adjacencyGraphs
})

const MIN_SCORE = 3 // Minimum score for a strong password (out of 4)

type ChangePasswordPayload = {
  old_password: string
  new_password: string
  confirm_password: string
}

// Tipado flexible para respuestas de error DRF
type DRFErrorData = {
  detail?: string
  non_field_errors?: string[]
  old_password?: string[]
  oldPassword?: string[]
  new_password?: string[]
  newPassword?: string[]
  confirm_password?: string[]
  confirmPassword?: string[]
  [key: string]: unknown
}

function firstMsg(v: unknown): string | undefined {
  if (Array.isArray(v) && v.length) return String(v[0])
  if (typeof v === 'string') return v
  return undefined
}

function pickDrfError(data?: DRFErrorData | null): string {
  if (!data) return 'No se pudo cambiar la contraseña'
  return (
    data.detail ??
    firstMsg(data.non_field_errors) ??
    firstMsg(data.old_password) ??
    firstMsg(data.oldPassword) ??
    firstMsg(data.new_password) ??
    firstMsg(data.newPassword) ??
    firstMsg(data.confirm_password) ??
    firstMsg(data.confirmPassword) ??
    'No se pudo cambiar la contraseña'
  )
}

const PerfilManagement: React.FC<UUIDInterface> = ({ uuid }) => {
  const { token } = useAuth()

  const [user, setUser] = useState<PerfilInterface | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  const [pwdValue, setPwdValue] = useState('')
  const [pwdScore, setPwdScore] = useState(0)
  const [pwdFeedback, setPwdFeedback] = useState<string[]>([])

  const [enterpriseOptions, setEnterpriseOptions] = useState<
    KeyValueInterface[]
  >([])

  const [dataEditDocType, setDataEditDocType] = useState<KeyValueInterface>()
  const [dataEditRelationEnterprise, setDataEditRelationEnterprise] =
    useState<KeyValueInterface>()
  const [dataEditContractEnterprise, setDataEditContractEnterprise] =
    useState<KeyValueInterface>()

  // Formdata references for Basic Information
  const firstNameRef = useRef<HTMLInputElement>(null)
  const lastNameRef = useRef<HTMLInputElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)
  const photoRef = useRef<HTMLInputElement>(null)
  const docTypeRef = useRef<HTMLInputElement>(null)
  const docNumberRef = useRef<HTMLInputElement>(null)
  const relationEnterpriseRef = useRef<HTMLInputElement>(null)
  const contractEnterpriseRef = useRef<HTMLInputElement>(null)

  // Formdata2 references for password change
  const oldRef = useRef<HTMLInputElement>(null)
  const newRef = useRef<HTMLInputElement>(null)
  const confirmRef = useRef<HTMLInputElement>(null)

  // onchange para el medidor (tu <Input> debe exponer onChange3)
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value
    setPwdValue(v)
    if (!v) {
      setPwdScore(0)
      setPwdFeedback([])
      return
    }
    const res = zxcvbn(v, ['Empresa'])
    setPwdScore(res.score)
    const fb = [
      res.feedback.warning || '',
      ...(res.feedback.suggestions || [])
    ].filter(Boolean)
    setPwdFeedback(fb)
  }

  const scoreLabel = ['Muy débil', 'Débil', 'Regular', 'Fuerte', 'Muy fuerte'][
    pwdScore
  ]
  const scoreColor =
    pwdScore <= 1
      ? 'text-red-600'
      : pwdScore === 2
      ? 'text-yellow-600'
      : 'text-green-600'

  const barClass = (i: number) =>
    `h-1 flex-1 rounded ${
      i <= pwdScore
        ? pwdScore <= 1
          ? 'bg-red-500'
          : pwdScore === 2
          ? 'bg-yellow-500'
          : 'bg-green-500'
        : 'bg-gray-300'
    }`

  useEffect(() => {
    const fetchEnterprises = async () => {
      if (!token) return
      const resp = await getData(token)
      setEnterpriseOptions(resp.props.enterprises)
    }

    fetchEnterprises()
  }, [token])

  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) {
        setLoading(false)
        setUser(null)
        return
      }

      try {
        const resp = await ApiFecthAuth(
          endPoints.customer.perfilretrieve,
          token
        )
        setUser(resp?.data as PerfilInterface)
      } catch (err) {
        ToastNotification('danger', `No se pudo cargar el perfil - ${err}`)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [token])

  const fullName = useMemo(() => {
    if (!user) return ''
    return `${user.firstName} ${user.lastName}`
  }, [user])

  const photoUrl = user?.photo || null

  const initials = useMemo(() => {
    if (!user) return ''
    const a = user.firstName?.[0] || ''
    const b = user.lastName?.[0] || ''
    return (a + b).toUpperCase()
  }, [user])

  // ===================== FOTO: SELECTOR =====================
  const handlePickPhoto = () => photoRef.current?.click()

  const handlePhotoChange: React.ChangeEventHandler<HTMLInputElement> = async (
    e
  ) => {
    try {
      const file = e.target.files?.[0]
      if (!file) return

      if (!validateImage(file)) {
        ToastNotification('warning', 'Imagen inválida.')
        e.target.value = ''
        return
      }

      const body = { photo: file }
      const resp = await ApiPatchAuth(
        endPoints.customer.perfilretrieve,
        token!,
        body
      )

      const updated = resp?.data as PerfilInterface
      if (updated) setUser(updated)

      ToastNotification('success', 'Foto actualizada correctamente.')
      e.target.value = ''
    } catch (err) {
      ToastNotification('danger', `Error al actualizar foto - ${err}`)
    }
  }

  useEffect(() => {
    if (!user || enterpriseOptions.length === 0) return

    // Empresa contratante
    if (user.contractEnterprise) {
      setDataEditContractEnterprise(user.contractEnterprise)
    }

    // Relación con empresa (usar UUID, NO value)
    if (user.empresas?.length > 0) {
      const rel = enterpriseOptions.find(
        (e) => String(e.key) === String(user.empresas[0].uuid)
      )
      if (rel) setDataEditRelationEnterprise(rel)
    }

    // Tipo de documento
    if (user.docType) {
      setDataEditDocType({
        key: user.docType,
        value: user.docType
      })
    }

    // Inputs simples
    if (firstNameRef.current) firstNameRef.current.value = user.firstName || ''
    if (lastNameRef.current) lastNameRef.current.value = user.lastName || ''
    if (emailRef.current) emailRef.current.value = user.email || ''
    if (docNumberRef.current) docNumberRef.current.value = user.docNumber || ''
  }, [user, enterpriseOptions])

  useEffect(() => {
    if (dataEditRelationEnterprise && relationEnterpriseRef.current) {
      relationEnterpriseRef.current.value = String(
        dataEditRelationEnterprise.key
      )
    }

    if (dataEditContractEnterprise && contractEnterpriseRef.current) {
      contractEnterpriseRef.current.value = String(
        dataEditContractEnterprise.key
      )
    }
  }, [dataEditRelationEnterprise, dataEditContractEnterprise])

  const formData = {
    firstName: {
      name: 'firstName',
      id: 'firstName',
      label: 'Nombres',
      showLabel: true,
      value: user?.firstName || '',
      required: true,
      ref: firstNameRef,
      tiny: true
    },
    lastName: {
      name: 'lastName',
      id: 'lastName',
      label: 'Apellidos',
      showLabel: true,
      value: user?.lastName || '',
      required: true,
      ref: lastNameRef,
      tiny: true
    },
    email: {
      name: 'email',
      id: 'email',
      label: 'Correo electrónico',
      showLabel: true,
      value: user?.email || '',
      required: true,
      ref: emailRef,
      tiny: true
    },
    docType: {
      name: 'docType',
      id: 'docType',
      label: 'Tipo de documento',
      showLabel: true,
      value: user?.docType || '',
      required: true,
      ref: docTypeRef,
      tiny: true,
      editData: dataEditDocType
    },
    docNumber: {
      name: 'docNumber',
      id: 'docNumber',
      label: 'Número de documento',
      showLabel: true,
      value: user?.docNumber || '',
      required: true,
      ref: docNumberRef,
      tiny: true
    },
    relationEnterprise: {
      name: 'relationEnterprise',
      id: 'relationEnterprise',
      label: 'Relación con Empresa',
      showLabel: true,
      defaultValue: user?.empresas?.[0]?.razonSocial || '',
      required: false,
      ref: relationEnterpriseRef,
      tiny: true,
      type: 'multiSelect',
      data: enterpriseOptions,
      editData: dataEditRelationEnterprise
    },
    contractEnterprise: {
      name: 'contractEnterprise',
      id: 'contractEnterprise',
      label: 'Empresa contratante',
      showLabel: true,
      required: true,
      ref: contractEnterpriseRef,
      tiny: true,
      data: enterpriseOptions,
      editData: dataEditContractEnterprise
    },
    submit: {
      name: 'actualizarinformacion',
      id: 'actualizarinformacion',
      label: 'Actualizar Información',
      showLabel: false,
      type: 'submit',
      buttonName: 'Guardar',
      disabled: loading,
      loaded: loading
    }
  }

  // === FORM DATA 2 ===
  const formData2 = {
    current: {
      name: 'old_password',
      id: 'old_password',
      label: 'Contraseña actual',
      ref: oldRef,
      showLabel: true,
      required: true,
      type: 'password'
    },
    newPassword: {
      name: 'new_password',
      id: 'new_password',
      label: 'Nueva contraseña',
      ref: newRef,
      showLabel: true,
      required: true,
      type: 'password',
      onChange3: handlePasswordChange
    },
    confirmPassword: {
      name: 'confirm_password',
      id: 'confirm_password',
      label: 'Confirmar contraseña',
      ref: confirmRef,
      showLabel: true,
      required: true,
      type: 'password'
    },
    submit: {
      name: 'submit',
      id: 'submit',
      label: 'Guardar',
      showLabel: false,
      type: 'submit',
      buttonName: 'Cambiar Contraseña',
      disabled: loading,
      loaded: loading
    }
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validar campos requeridos
    const fields = [
      { ref: docTypeRef, message: 'Debe seleccionar el tipo de documento' },
      {
        ref: relationEnterpriseRef,
        message: 'Debe seleccionar la relación con la empresa'
      },
      {
        ref: contractEnterpriseRef,
        message: 'Debe seleccionar la empresa contratante'
      }
    ]

    // Verifica si todos los campos requeridos están llenos
    if (!CheckForm(fields)) return

    if (!token) {
      ToastNotification('warning', 'Sesión expirada. Vuelve a iniciar sesión.')
      return
    }

    const perfilBody: PerfilBodyInterface = {
      first_name: firstNameRef.current ? firstNameRef.current.value : '',
      last_name: lastNameRef.current ? lastNameRef.current.value : '',
      email: emailRef.current ? emailRef.current.value : '',
      doc_type: docTypeRef.current ? docTypeRef.current.value : '',
      doc_number: docNumberRef.current ? docNumberRef.current.value : '',
      relation_enterprise: relationEnterpriseRef.current
        ? relationEnterpriseRef.current.value
        : '',
      contract_enterprise: contractEnterpriseRef.current
        ? contractEnterpriseRef.current.value
        : '',
      // Si el usuario sube una nueva foto
      photo: photoRef.current?.files?.[0] || null
    }
    try {
      setLoading(true)
      const response = await ApiPatchAuth(
        endPoints.customer.put(user?.uuid || ''),
        token!,
        perfilBody,
        undefined,
        'application/json'
      )

      if (response.status === 200) {
        ToastNotification('success', 'Perfil actualizado correctamente.')
        setUser(response.data)
      } else {
        ToastNotification('danger', 'Error al actualizar perfil.')
      }
    } catch {
      ToastNotification('danger', 'Error al actualizar perfil.')
    } finally {
      setLoading(false)
    }

    // ===================== ACTUALIZAR CONTRASEÑA =====================

    const changePasswordBody: PerfilChangePasswordBodyInterface = {
      old_password: oldRef.current ? oldRef.current.value : '',
      new_password: newRef.current ? newRef.current.value : '',
      confirm_password: confirmRef.current ? confirmRef.current.value : ''
    }

    try {
      setLoading(true)
      const response = await ApiPatchAuth(
        endPoints.customer.perfilretrieve, // endpoint correspondiente para cambiar la contraseña
        token!,
        changePasswordBody,
        undefined,
        'application/json'
      )

      if (response.status === 200) {
        ToastNotification('success', 'Contraseña cambiada correctamente.')
      } else {
        ToastNotification('danger', 'Error al cambiar la contraseña.')
      }
    } catch {
      // Captura cualquier error que ocurra en el bloque try
      ToastNotification('danger', 'Error inesperado al cambiar la contraseña')
    } finally {
      // Este bloque siempre se ejecuta, tanto si hubo un error o no
      setLoading(false)
    }

    const userUuid = uuid
    if (!userUuid) {
      ToastNotification(
        'danger',
        'No se encontró el usuario para cambiar la contraseña'
      )
      return
    }

    const current = (oldRef.current?.value || '').trim()
    const newPass = (newRef.current?.value || '').trim()
    const confirm = (confirmRef.current?.value || '').trim()

    if (!current || !newPass || !confirm) {
      ToastNotification('warning', 'Complete todos los campos')
      return
    }

    if (newPass === current) {
      ToastNotification(
        'warning',
        'La nueva contraseña no puede ser igual a la anterior'
      )
      return
    }

    if (newPass !== confirm) {
      ToastNotification('danger', 'Las contraseñas no coinciden')
      return
    }

    const strength = zxcvbn(newPass, ['Empresa'])
    if (strength.score < MIN_SCORE) {
      ToastNotification(
        'warning',
        'La contraseña es débil. Use una frase más larga con variaciones.'
      )
      return
    }

    try {
      setLoading(true)

      const payload: ChangePasswordPayload = {
        old_password: current,
        new_password: newPass,
        confirm_password: confirm
      }

      const response = await ApiPostAuth(
        endPoints.customer.put(user?.uuid || ''),
        token || '',
        payload,
        undefined,
        'application/json'
      )

      if (response.status >= 200 && response.status < 300) {
        if (oldRef.current) oldRef.current.value = ''
        if (newRef.current) newRef.current.value = ''
        if (confirmRef.current) confirmRef.current.value = ''
        setPwdValue('')
        setPwdScore(0)
        setPwdFeedback([])

        ResponseFromEdited({
          response,
          returnSuccess: '/setting/perfil/?t=s&m=edit'
        })
      } else {
        const msg = pickDrfError(response.data as DRFErrorData)
        ToastNotification('danger', msg)
        console.error('[changePwd] HTTP', response.status, response.data)
      }
    } catch (err) {
      console.error('[changePwd] unexpected error:', err)
      ToastNotification('danger', 'Error inesperado al cambiar la contraseña')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='w-full mt-20'>
      <PageContent>
        {/* === PROFILE INFORMATION CARD === */}
        <div className='w-full max-w-5xl mx-auto bg-white shadow-xl rounded-2xl p-8'>
          {/* Profile photo and info */}
          <div className='flex items-center gap-6'>
            <div className='relative'>
              {photoUrl ? (
                <Img
                  src={photoUrl}
                  alt='Foto'
                  className='h-20 w-20 rounded-full object-cover ring-4 ring-white shadow-md'
                />
              ) : (
                <div className='h-20 w-20 rounded-full bg-Cian7 text-white flex items-center justify-center text-xl font-bold ring-4 ring-white'>
                  {initials || 'U'}
                </div>
              )}
              <button
                onClick={handlePickPhoto}
                className='absolute bottom-0 right-0 h-7 w-7 rounded-full bg-white shadow flex items-center justify-center text-Cian7'
              >
                <MdPhotoCamera size={16} />
              </button>
              <input
                ref={photoRef}
                type='file'
                accept='image/*'
                className='hidden'
                onChange={handlePhotoChange}
              />
            </div>

            <div>
              <h1 className='text-2xl font-semibold text-Charcoal'>
                {fullName || '—'}
              </h1>
              <span className='text-sm text-Greys'>Usuario registrado</span>
            </div>
          </div>

          {/* === Information Fields === */}
          <div className='w-full h-px bg-Greys my-8' />
          <h2 className='text-lg font-semibold text-Charcoal mb-6'>
            Información Básica
          </h2>
          <Formulary onSubmit={async () => {}}>
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
              <FormContent className='w-full xl:w-4/12'>
                <Select data={formData.docType} />
              </FormContent>
              <FormContent className='w-full xl:w-4/12'>
                <Input data={formData.docNumber} />
              </FormContent>
              <FormContent className='w-full xl:w-4/12'>
                <Select data={formData.relationEnterprise} />
              </FormContent>
              <FormContent className='w-full xl:w-4/12'>
                <Select data={formData.contractEnterprise} />
              </FormContent>
              <div className='w-full flex justify-center items-center'>
                <div className='w-full xl:w-1/3'>
                  <Button data={formData.submit} />
                </div>
              </div>
            </FormContainer>
          </Formulary>

          {/* <div className='mt-10 flex justify-center'>
            <Link
              href={`${prefix}/administrador/perfil/editar`}
              className='px-6 py-3 bg-gradient-to-r from-Cian8 to-Cian4 text-white rounded-full shadow hover:opacity-90'
            >
              Editar perfil
            </Link>
          </div> */}
        </div>

        {/* === PASSWORD CHANGE CARD === */}
        <div className='w-full max-w-5xl mx-auto bg-white shadow-xl rounded-2xl p-8 mt-5'>
          <h2 className='text-lg font-semibold text-Charcoal mb-6'>
            Cambiar Contraseña
          </h2>
          <Formulary onSubmit={onSubmit}>
            <FormContainer>
              <FormContent className='w-full xl:w-4/12'>
                <Input data={formData2.current} />
              </FormContent>
              <FormContent className='w-full xl:w-4/12'>
                <div className='w-full flex flex-col'>
                  <Input data={formData2.newPassword} />
                  <div className='mt-2 py-2'>
                    {pwdValue && (
                      <>
                        <div className='flex gap-1 w-full'>
                          {[0, 1, 2, 3, 4].map((i) => (
                            <span key={i} className={barClass(i)} />
                          ))}
                        </div>
                        <div className={`mt-1 text-sm ${scoreColor}`}>
                          Fortaleza: {scoreLabel}
                        </div>
                        {pwdFeedback.length > 0 && (
                          <ul className='mt-1 text-xs text-gray-600 list-disc list-inside'>
                            {pwdFeedback.map((s, idx) => (
                              <li key={idx}>{s}</li>
                            ))}
                          </ul>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </FormContent>
              <FormContent className='w-full xl:w-4/12'>
                <Input data={formData2.confirmPassword} />
              </FormContent>
              <div className='w-full flex justify-center items-center'>
                <div className='w-full xl:w-1/3'>
                  <Button data={formData2.submit} />
                </div>
              </div>
            </FormContainer>
          </Formulary>
        </div>
      </PageContent>
    </div>
  )
}

export default PerfilManagement

async function getData(token: string | null) {
  if (token) {
    const response = await ApiFecthAuth(
      endPoints.empresa.publica.empresaNoPaged,
      token
    )
    return {
      props: {
        enterprises: response.data
      },
      revalidate: 3600
    }
  }
  return {
    props: {
      enterprises: null
    },
    revalidate: 3600
  }
}
