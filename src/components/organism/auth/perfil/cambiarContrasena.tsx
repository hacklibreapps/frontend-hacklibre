'use client'

import PageTitle from '@/components/atom/auth/structures/pageTitlte'

import FormContainer from '@/components/molecule/auth/structures/formContainer'
import FormContent from '@/components/molecule/auth/structures/formContent'
import Formulary from '@/components/molecule/auth/structures/formulary'
import { useAuth } from '@/context/authContext'
import { ApiPostAuth } from '@/services/auth/axios/apiPostAuth'
import ResponseFromEdited from '@/utils/responseFromEdited'
import { useRef, useState } from 'react'

// zxcvbn-ts
import { zxcvbn, zxcvbnOptions } from '@zxcvbn-ts/core'
import {
  dictionary as commonDictionary,
  adjacencyGraphs
} from '@zxcvbn-ts/language-common'
import {
  dictionary as esDictionary,
  translations as esTranslations
} from '@zxcvbn-ts/language-es-es'

import GoBack from '@/components/atom/goback'
import { prefix } from '@/services/envs/envs'
import { UUIDInterface } from '@/interfaces/structures/uuidInterface'
import PageContainer from '@/components/atom/structures/containers/pageContainer'
import PageContent from '@/components/atom/structures/containers/pageContent'
import { Button } from '@/components/atom/structures/button'
import Input from '@/components/atom/structures/input'
import { ToastNotification } from '@/components/atom/structures/toast'
import endPoints from '@/services/auth/endPoints/endPoint'

// ---------- zxcvbn config ----------
zxcvbnOptions.setOptions({
  dictionary: { ...commonDictionary, ...esDictionary },
  translations: esTranslations,
  graphs: adjacencyGraphs
})

const MIN_SCORE = 3 // 0..4

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

const CambiarContrasena: React.FC<UUIDInterface> = ({ uuid }) => {
  const { token } = useAuth()
  const [loading, setLoading] = useState(false)

  const oldRef = useRef<HTMLInputElement>(null)
  const newRef = useRef<HTMLInputElement>(null)
  const confirmRef = useRef<HTMLInputElement>(null)

  const [pwdValue, setPwdValue] = useState('')
  const [pwdScore, setPwdScore] = useState(0)
  const [pwdFeedback, setPwdFeedback] = useState<string[]>([])

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

  const formData = {
    current: {
      name: 'old_password',
      id: 'old_password',
      label: 'Contraseña actual',
      ref: oldRef,
      showLabel: true,
      required: true,
      type: 'password'
    },
    password: {
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
      label: 'submit',
      showLabel: false,
      type: 'submit',
      buttonName: 'Guardar',
      disabled: loading,
      loaded: loading
    }
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!token) {
      ToastNotification('warning', 'Sesión expirada. Vuelve a iniciar sesión.')
      return
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
        endPoints.usuarios.changepasswordUser(userUuid),
        token,
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
          returnSuccess: '/administrador/usuarios?t=s&m=pass'
        })
      } else {
        // 4xx/5xx: muestra mensaje del backend
        const msg = pickDrfError(response.data as DRFErrorData)
        ToastNotification('danger', msg)
        console.error('[changePwd] HTTP', response.status, response.data)
      }
    } catch (err) {
      // Si axios llegara a lanzar igualmente
      console.error('[changePwd] unexpected error:', err)
      ToastNotification('danger', 'Error inesperado al cambiar la contraseña')
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageContainer>
      <PageTitle description='Cambiar contraseña' />
      <GoBack enlace={`${prefix}/administrador/usuarios/`} />
      <PageContent>
        <Formulary onSubmit={onSubmit}>
          <FormContainer>
            <FormContent className='w-full xl:w-4/12'>
              <Input data={formData.current} />
            </FormContent>
            <FormContent className='w-full xl:w-4/12'>
              <div className='w-full flex flex-col'>
                <Input data={formData.password} />
                {/* Mantiene altura fija para que no mueva el layout */}
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
              <Input data={formData.confirmPassword} />
            </FormContent>
            <div className='w-full flex justify-center items-center'>
              <div className='w-full xl:w-1/3'>
                <Button data={formData.submit} />
              </div>
            </div>
          </FormContainer>
        </Formulary>
      </PageContent>
    </PageContainer>
  )
}

export default CambiarContrasena
