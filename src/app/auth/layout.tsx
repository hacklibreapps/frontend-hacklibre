'use client'

import React, { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import Sidebar from '@/components/organism/navigations/siderBar'
import TopBar from '@/components/organism/navigations/topBar'
import { FiMenu } from 'react-icons/fi'

export default function AuthLayout({
  children
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const hideChrome = pathname === '/auth/signin' || pathname === '/auth/login'
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  if (hideChrome) return <>{children}</>

  return (
    // <div className='min-h-screen bg-gray-100 flex'>
    <div className='h-screen bg-gray-100 flex overflow-hidden'>
      {/* Desktop (lg+) */}

      <Sidebar mode='desktop' />

      {/* Drawer (xs–lg) */}
      <aside
        className={[
          'fixed inset-y-0 left-0 z-[100] w-72 bg-white shadow-lg border border-transparent',
          'transform transition-transform duration-300 lg:hidden',
          open ? 'translate-x-0' : '-translate-x-full'
        ].join(' ')}
        aria-hidden={!open}
        aria-label='Navegación lateral'
      >
        <Sidebar
          mode='drawer'
          className='h-full relative'
          onLinkClick={() => setOpen(false)}
          onRequestClose={() => setOpen(false)}
          showClose={open} // 👈 la X sólo cuando está abierto
        />
      </aside>

      {/* Backdrop */}
      {open && (
        <button
          aria-label='Cerrar menú'
          onClick={() => setOpen(false)}
          className='fixed inset-0 z-[90] bg-black/30 lg:hidden'
        />
      )}

      {/* Botón hamburguesa: sólo cuando está cerrado */}
      {!open && (
        <button
          type='button'
          aria-label='Abrir menú'
          onClick={() => setOpen(true)}
          className='lg:hidden fixed left-2 top-7 -translate-y-1/2 z-[110]
               inline-flex items-center justify-center w-10 h-10
               bg-transparent text-slate-700
               focus:outline-none'
          title='Abrir menú'
        >
          <FiMenu />
        </button>
      )}

      <div className='flex-1 flex flex-col min-w-0'>
        <TopBar />
        {/* <main className='flex-1 p-4'>{children}</main> */}
        <main className='flex-1 overflow-y-auto p-4'>{children}</main>
      </div>
    </div>
  )
}
