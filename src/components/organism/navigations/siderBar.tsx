'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { ADMIN_NAV } from '@/services/data/adminNav'
import { NavItem } from '@/interfaces/navigation'
import { MdKeyboardArrowDown } from 'react-icons/md'
import { LiaTimesSolid } from 'react-icons/lia'
import { useAuth } from '@/context/authContext'
import * as GiIcons from 'react-icons/gi'
import React from 'react'
type Mode = 'desktop' | 'drawer'

function isActive(pathname: string, href?: string) {
  if (!href) return false

  // ✅ Escritorio SOLO activo en /auth exacto
  if (href === '/auth') {
    return pathname === '/auth'
  }

  // ✅ Para el resto (Generales, etc.)
  return pathname === href || pathname.startsWith(href + '/')
}

export default function Sidebar({
  mode = 'desktop',
  className = '',
  onLinkClick,
  onRequestClose,
  showClose = false //  NUEVO: controla visibilidad de la X
}: {
  mode?: Mode
  className?: string
  onLinkClick?: () => void
  onRequestClose?: () => void
  showClose?: boolean
}) {
  const { enterpriseIcon, enterpriseName } = useAuth()
  const pathname = usePathname()
  const [open, setOpen] = useState<Record<string, boolean>>({})
  const toggle = (key: string) => setOpen((s) => ({ ...s, [key]: !s[key] }))
  const items = useMemo(() => ADMIN_NAV, [])
  const [currentIcon, setCurrentIcon] = useState<React.ComponentType | null>(
    null
  )
  const visibility = mode === 'desktop' ? 'hidden lg:block' : 'block lg:hidden'
  useEffect(() => {
    const IconComponent = GiIcons[enterpriseIcon as keyof typeof GiIcons]
    setCurrentIcon(() => IconComponent || GiIcons.GiAmethyst)
  }, [enterpriseIcon])

  return (
    <aside
      className={[
        visibility,
        'w-64 shrink-0 border-r border-Cian2/40 bg-white/90 backdrop-blur-lg shadow-sm',
        className
      ].join(' ')}
    >
      {/* Header */}
      <div className='relative flex h-16 items-center justify-start  px-4'>
        <div className='flex flex-row items-center justify-center gap-2'>
          {currentIcon &&
            React.createElement(
              currentIcon as React.ComponentType<React.SVGProps<SVGSVGElement>>,
              { className: 'text-Cian8 text-2xl' }
            )}
          <span className='font-semibold text-Charcoal'>{enterpriseName}</span>
        </div>

        {/* la X sólo cuando es drawer y showClose=true */}
        {mode === 'drawer' && showClose && (
          <button
            type='button'
            aria-label='Cerrar menú'
            onClick={onRequestClose}
            className='absolute -right-10 top-2 translate-x-1/2
               inline-flex items-center justify-center
               w-9 h-9 rounded  bg-white
               border border-white text-slate-700
               hover:bg-slate-50'
            title='Cerrar'
          >
            <span className='text-lg leading-none'>
              <LiaTimesSolid />
            </span>
          </button>
        )}
      </div>

      <nav className='px-2 pb-4'>
        <ul className='space-y-1'>
          {items.map((item) => {
            const key = item.label
            const hasChildren = !!item.children?.length
            const active = isActive(pathname, item.href)
            return (
              <li key={key}>
                <div
                  className={[
                    'group flex items-center rounded-md px-3 py-2 text-sm transition-colors',
                    active
                      ? 'bg-Cian2/50 text-Charcoal ring-1 ring-Cian4/40'
                      : 'text-Charcoal/80 hover:bg-Cian2/40'
                  ].join(' ')}
                >
                  <span className='mr-2 grid place-items-center'>
                    {item.icon}
                  </span>

                  {hasChildren ? (
                    <button
                      type='button'
                      onClick={() => toggle(key)}
                      className='flex w-full items-center justify-between'
                    >
                      <span>{item.label}</span>
                      <MdKeyboardArrowDown
                        className={[
                          'transition-transform',
                          open[key] ? 'rotate-180' : ''
                        ].join(' ')}
                      />
                    </button>
                  ) : (
                    <Link
                      href={item.href ?? '#'}
                      className='flex-1'
                      onClick={onLinkClick}
                    >
                      {item.label}
                    </Link>
                  )}
                </div>

                {hasChildren && open[key] && (
                  <ul className='mt-1 space-y-1 pl-7'>
                    {item.children!.map((c: NavItem) => {
                      const subActive = isActive(pathname, c.href)
                      return (
                        <li key={c.label}>
                          <Link
                            href={c.href ?? '#'}
                            onClick={onLinkClick}
                            className={[
                              'block rounded-md px-3 py-2 text-sm transition-colors',
                              subActive
                                ? 'bg-Cian2/50 text-Charcoal ring-1 ring-Cian4/40'
                                : 'text-Charcoal/70 hover:bg-Cian2/40'
                            ].join(' ')}
                          >
                            {c.label}
                          </Link>
                        </li>
                      )
                    })}
                  </ul>
                )}
              </li>
            )
          })}
        </ul>
      </nav>
    </aside>
  )
}
