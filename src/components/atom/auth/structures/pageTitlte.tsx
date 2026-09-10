'use client'

import { usePathname } from 'next/navigation'
import React from 'react'

interface PageTitleProps {
  description?: string
  aditionalIcon?: JSX.Element | null
}

export type PageMode = 'Crear' | 'Editar' | 'Visualizar' | 'Administrar'

const PageTitle: React.FC<PageTitleProps> = ({
  description,
  aditionalIcon
}) => {
  const pathname = usePathname()
  const authIndex = pathname.indexOf('/auth')

  const pathFromAuth =
    authIndex !== -1 ? pathname.substring(authIndex + 1) : pathname

  const segments = pathFromAuth.split('/').filter(Boolean)

  const moduleName = segments[1] || ''
  const possibleSub = segments[2] || ''
  const lastSegment = segments[segments.length - 1] || ''
  const secondLast = segments[segments.length - 2] || ''

  const isUUID = /^[0-9a-fA-F-]{6,}$/.test(possibleSub)

  const subModule = isUUID ? '' : possibleSub

  let mode: PageMode = 'Administrar'
  let uuid: string | null = null

  if (lastSegment === 'nuevo') {
    mode = 'Crear'
  } else if (lastSegment === 'editar') {
    mode = 'Editar'
    uuid = secondLast
  } else if (/^[0-9a-fA-F-]{6,}$/.test(lastSegment)) {
    mode = 'Visualizar'
    uuid = lastSegment
  }

  let fullTitle = ''

  if (subModule) {
    fullTitle = `Administrar ${moduleName} - Gestionar ${subModule}`
  } else {
    fullTitle = `Administrar ${moduleName}`
  }

  if (mode !== 'Administrar') {
    fullTitle += ` - ${mode}`
  }

  if (uuid && mode !== 'Administrar') {
    fullTitle = fullTitle
  }

  return (
    <div className='flex flex-col lg:flex-row justify-start items-center w-full'>
      <div className='w-full lg:w-11/12 flex flex-col justify-start items-center lg:items-start text-DarkBlue'>
        <p className='pt-1 font-bold'>{fullTitle}</p>
        {description && (
          <p className='pt-1 font-semibold text-sm text-gray-600'>{description}</p>
        )}
      </div>

      <div className='w-full lg:w-1/12 flex flex-row justify-center pb-3 lg:pb-0 lg:justify-end items-start pt-5 lg:pt-0'>
        {aditionalIcon ?? null}
      </div>
    </div>
  )
}

export default PageTitle
