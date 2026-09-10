'use client'
import React from 'react'

export default function Section({
  title,
  subtitle,
  children
}: {
  title: string
  subtitle?: string
  children: React.ReactNode
}) {
  return (
    <section className='space-y-4'>
      <header>
        <h2 className='text-xl font-semibold text-white'>{title}</h2>
        {subtitle ? <p className='text-sm text-Cian4'>{subtitle}</p> : null}
      </header>
      {children}
    </section>
  )
}
