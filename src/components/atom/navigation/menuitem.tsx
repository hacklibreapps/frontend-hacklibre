'use client'
import React from 'react'

export default function MenuItem({
  icon,
  label,
  onClick
}: {
  icon: React.ReactNode
  label: string
  onClick?: () => void
}) {
  return (
    <li role='none'>
      <button
        role='menuitem'
        onClick={onClick}
        className='flex w-full cursor-pointer items-center rounded-md p-3 text-left text-sm text-Charcoal transition-colors hover:bg-Cian2'
      >
        {icon}
        <span className='ml-2 font-medium'>{label}</span>
      </button>
    </li>
  )
}
