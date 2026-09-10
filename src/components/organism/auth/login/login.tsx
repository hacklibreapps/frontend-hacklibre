// src/app/auth/login/page.tsx
'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/authContext'
import { LoginResponse, TokenLogin } from '@/services/auth/auth'
import { ToastNotification } from '@/components/atom/structures/toast'
import Input from '@/components/atom/structures/input'
import { Button } from '@/components/atom/structures/button'
import TechBackground from '@/components/molecule/backgrounds/teschBackground'
import { ApiFetch } from '@/services/auth/axios/apiFetch'
import endPoints from '@/services/auth/endPoints/endPoint'
import React from 'react'

interface EnterpriseInterface {
  uuid: string
  razonSocial: string
  logo: string
  icon: string
  detractionAccount: string
  detractionPercent: number
  ruc: string
}

export default function SignIn() {
  const { token, enterprise, ready, login, setEnterpriseList } = useAuth()
  const router = useRouter()

  const userRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(false)
  const [enterprises, setEnterprises] = useState<EnterpriseInterface[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getData()
        setEnterprises(data.props.empresas)
      } catch (error) {
        ToastNotification('danger', `Ha ocurrido un error - ${error}`)
      }
    }
    fetchData()
  }, [enterprise, ready, token])

  // empresa elegida
  const [enterpriseId, setEnterpriseId] = useState<string>('')
  useEffect(() => {
    if (enterprises.length > 0) {
      // Seleccionar la primera empresa por defecto
      const firstEnterprise = enterprises[0]
      setEnterpriseId(firstEnterprise.uuid) // Establece el primer enterpriseId
    }
  }, [enterprises]) // Esto se ejecuta una vez que las empresas se cargan

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const username = userRef.current?.value?.trim() ?? ''
      const password = passwordRef.current?.value ?? ''

      if (!username || !password) {
        ToastNotification('danger', 'Completa usuario y contraseña')
        return
      }

      // Llamada a TokenLogin con la empresa seleccionada
      const token = await TokenLogin(username, password, enterpriseId)
      if ('error' in token) {
        ToastNotification('danger', token.error)
        return
      }

      const data: LoginResponse = token

      // Si el back devuelve enterprises, úsalo
      if (Array.isArray(data.enterprises) && data.enterprises.length > 0) {
        const list = data.enterprises.map((e) => ({
          uuid: e.uuid,
          name: e.name,
          logo: e.logo,
          icon: e.icon,
          detractionAccount: e.detractionAccount,
          detractionPercent: e.detractionPercent,
          ruc: e.ruc
        }))
        const active = data.active_enterprise?.id ?? list[0].uuid
        const activeName =
          data.active_enterprise?.name ??
          list.find((e) => e.uuid === active)?.name ??
          list[0].name
        const activeLogo =
          data.active_enterprise?.logo ??
          list.find((e) => e.uuid === active)?.logo ??
          list[0].logo
        const activeIcon =
          data.active_enterprise?.icon ??
          list.find((e) => e.uuid === active)?.icon ??
          list[0].icon
        const activeDetraction =
          data.active_enterprise?.detractionAccount ??
          list.find((e) => e.uuid === active)?.detractionAccount ??
          list[0].detractionAccount
        const activeDetractionPercent =
          data.active_enterprise?.detractionPercent ??
          list.find((e) => e.uuid === active)?.detractionPercent ??
          list[0].detractionPercent

        const activeRuc =
          data.active_enterprise?.ruc ??
          list.find((e) => e.uuid === active)?.ruc ??
          list[0].ruc

        login(
          data.access,
          active,
          activeName,
          activeLogo,
          activeIcon,
          activeDetraction,
          activeDetractionPercent,
          activeRuc,
          data.permissions,
          data.groups
        )

        setEnterpriseList(list, active)
      } else {
        // Fallback: la empresa elegida en el combo
        const chosen =
          enterprises.find((e) => e.uuid === enterpriseId) ?? enterprises[0]
        login(
          data.access,
          chosen.uuid,
          chosen.razonSocial,
          chosen.logo,
          chosen.icon,
          chosen.detractionAccount,
          chosen.detractionPercent,
          chosen.ruc,
          data.permissions,
          data.groups
        )
        setEnterpriseList(
          enterprises.map(
            ({
              uuid,
              razonSocial,
              logo,
              icon,
              detractionAccount,
              detractionPercent,
              ruc
            }) => ({
              uuid: uuid,
              name: razonSocial,
              logo: logo,
              icon: icon,
              detractionAccount: detractionAccount,
              detractionPercent: detractionPercent,
              ruc: ruc
            })
          ),
          chosen.uuid
        )
      }

      // ToastNotification('success', 'Sesión iniciada correctamente')
      router.replace('/auth/dashboard')
    } catch {
      ToastNotification('danger', 'No se pudo autenticar. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  const formData = {
    user: {
      name: 'user',
      id: 'user',
      label: 'Usuario',
      ref: userRef,
      required: true,
      showLabel: false,
      placeHolder: 'Usuario'
    },
    passwd: {
      name: 'password',
      id: 'password',
      type: 'password' as const,
      label: 'Contraseña',
      ref: passwordRef,
      required: true,
      showLabel: false,
      placeHolder: 'Contraseña'
    },
    submit: {
      name: 'submit',
      id: 'submit',
      showLabel: false,
      buttonName: loading ? 'Iniciando sesión…' : 'Ingresar',
      label: 'Ingresar',
      type: 'submit',
      disabled: loading,
      loaded: loading
    }
  } as const
  const handleEnterpriseChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value
    setEnterpriseId(selectedId) // Actualiza el estado enterpriseId
  }

  return (
    <div className='relative flex min-h-screen w-full items-center justify-center bg-Charcoal/90'>
      <TechBackground variant='constellation' opacity={0.9} />

      <div className='flex h-full w-11/12 max-w-6xl flex-col items-center justify-center xl:flex-row'>
        <div className='order-1 relative flex w-full items-center justify-center py-10 xl:order-0 xl:w-1/2 xl:py-0'>
          {/* Encabezado con icono de empresa */}
          <div className='pointer-events-none absolute left-1/2 -top-10 z-10 -translate-x-1/2'>
            <div className='relative h-[80px] w-[360px] rounded-[14px] bg-gradient-to-b from-Cian7 to-zinc-600 text-white shadow-2xl ring-1 ring-white/10'>
              <div className='flex h-full items-center justify-center gap-2 px-6'>
                <h2 className='text-3xl font-semibold'>Login</h2>
              </div>
            </div>
          </div>

          {/* Card del formulario */}
          <div className='relative w-full max-w-md overflow-hidden rounded-2xl bg-white/95 shadow-xl ring-1 ring-Cian2/50 backdrop-blur'>
            <div className='px-6 pb-6 pt-14'>
              <form
                autoComplete='off'
                onSubmit={handleSubmit}
                className='space-y-4'
                method='POST'
              >
                {/* Combo de empresa */}
                <div>
                  <select
                    value={enterpriseId}
                    onChange={handleEnterpriseChange}
                    required
                    className='form-select w-full h-11 rounded-md border border-Cian2 bg-white px-3 text-sm text-Charcoal shadow-sm outline-none focus:border-Cian4 focus:ring-2 focus:ring-Cian2/50'
                    aria-label='Selecciona la empresa'
                  >
                    {enterprises.map((opt) => (
                      <option key={opt.uuid} value={opt.uuid}>
                        {opt.razonSocial}
                      </option>
                    ))}
                  </select>
                </div>

                <Input data={formData.user} />
                <Input data={formData.passwd} />

                <Button data={formData.submit} />
              </form>

              <p className='mt-5 text-center text-sm text-Charcoal/80'>
                ¿No tienes una cuenta?{' '}
                <Link
                  href='/signup'
                  className='font-semibold text-Red7 hover:text-Red8'
                >
                  Crea una cuenta
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
async function getData() {
  const response = await ApiFetch(endPoints.empresa.publica.list)
  if (response) {
    return {
      props: {
        empresas: response.data
      },
      revalidate: 3600
    }
  } else {
    return {
      props: {
        empresas: []
      },
      revalidate: 3600
    }
  }
}
