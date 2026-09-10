'use client'

import { useRouter } from 'next/navigation'
import { FiSettings, FiLogOut, FiKey, FiUser } from 'react-icons/fi'
import { useAuth } from '@/context/authContext'
import React, { useState, useRef, useEffect } from 'react'
import CompanyPicker from '@/components/atom/auth/CompanyPicker'
import TipoCambioDia from '../auth/tipocambio/tipoCambioDia'
import { VATDeductionCalculator } from '@/components/atom/auth/vatDeductionCalculator'
import { Notifications } from '@/components/molecule/auth/notifications/notifications'
import { IconButton } from '@/components/atom/auth/iconButton'

export default function TopBar() {
  const router = useRouter()
  const { logout } = useAuth()

  const [openConfig, setOpenConfig] = useState(false)
  const menuRef = useRef<HTMLDivElement | null>(null)

  const goProfile = () => router.push('/auth/settings/perfil')
  const goPassword = () => router.push('/auth/cambiar-contrasena')
  const doLogout = () => {
    logout()
    router.replace('/login')
  }

  /** 🔥 CLICK OUTSIDE para cerrar menú */
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenConfig(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <header
      className='
        sticky top-0 z-50 flex flex-col sm:flex-row md:h-14 items-center justify-between
        border-b border-Cian2/30 bg-white/85 px-4 backdrop-blur 
      '
    >
      {/* Lado izquierdo */}
      <div className='order-2 sm:order-1 pl-0 sm:pl-8 lg:pl-0 flex items-center pb-2 sm:pb-0'>
        <TipoCambioDia />
      </div>

      {/* Lado derecho */}
      <div
        ref={menuRef}
        className='order-1 sm:order-2 flex items-center gap-2 relative'
      >
        <VATDeductionCalculator />
        <CompanyPicker />

        {/* === BOTÓN NOTIFICACIONES === */}
        <Notifications />
        <IconButton
          title='Configuración'
          onClick={() => setOpenConfig(!openConfig)}
        >
          <FiSettings className='h-5 w-5' />
        </IconButton>

        {/* === SUBMENÚ DESPLEGABLE === */}
        {openConfig && (
          <div
            className='
            absolute right-0 top-10 w-48 bg-white border border-gray-200 shadow-lg 
            rounded-md text-sm text-gray-700 flex flex-col z-50 animate-fadeIn
          '
          >
            <button
              onClick={() => {
                setOpenConfig(false)
                goProfile()
              }}
              className='flex items-center px-4 py-2 hover:bg-gray-100'
            >
              <FiUser className='mr-2 h-4 w-4' /> Mi perfil
            </button>

            <button
              onClick={() => {
                setOpenConfig(false)
                goPassword()
              }}
              className='flex items-center px-4 py-2 hover:bg-gray-100'
            >
              <FiKey className='mr-2 h-4 w-4' /> Cambiar contraseña
            </button>

            <div className='border-t my-1' />

            {/* <button
              onClick={() => {
                setOpenConfig(false)
                doLogout()
              }}
              className='flex items-center px-4 py-2 hover:bg-gray-100 text-red-600'
            >
            </button> */}
          </div>
        )}

        {/* Botón logout directo */}
        <IconButton title='Cerrar sesión' onClick={doLogout}>
          <FiLogOut className='h-4 w-4' />
        </IconButton>
      </div>
    </header>
  )
}
