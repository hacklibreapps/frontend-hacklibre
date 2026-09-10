'use client'
import React from 'react'

export default function Card({
  title,
  children
}: {
  title?: string
  children: React.ReactNode
}) {
  return (
    <div className='rounded-xl border border-Cian2 bg-Greys p-4 shadow-sm'>
      {title ? (
        <h3 className='mb-3 text-sm font-semibold uppercase tracking-wide text-Charcoal/70'>
          {title}
        </h3>
      ) : null}
      {children}
    </div>
  )
}
