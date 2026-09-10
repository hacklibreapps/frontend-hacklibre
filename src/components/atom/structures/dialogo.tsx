// src/components/atom/structures/dialogo.tsx
'use client'

import { ModalSize } from '@/interfaces/querys/queryInterface'
import * as React from 'react'

type Props = {
  open: boolean
  onClose: () => void
  onConfirm?: () => void
  size?: ModalSize
  title?: React.ReactNode
  confirmText?: string
  cancelText?: string
  children: React.ReactNode
}

const SIZE_CLASS: Record<ModalSize, string> = {
  xs: 'w-full max-w-sm',
  sm: 'w-full max-w-md',
  md: 'w-full max-w-lg',
  lg: 'w-full max-w-2xl',
  xl: 'w-full max-w-3xl',
  xxl: 'w-[min(1200px,98vw)] h-[min(90vh,calc(100vh-2rem))] max-h-[calc(100vh-2rem)]'
}

export default function Dialogs({
  open,
  onClose,
  onConfirm,
  size = 'md',
  title,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  children
}: Props) {
  const titleId = React.useId()

  React.useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className='fixed inset-0 z-[999] flex h-screen w-screen items-center justify-center bg-black/60 backdrop-blur-sm'
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        role='dialog'
        aria-modal='true'
        aria-labelledby={title ? titleId : undefined}
        className={`relative m-4 rounded-lg bg-white p-4 shadow-sm animate-[fadeIn_120ms_ease-out] ${SIZE_CLASS[size]}`}
      >
        {title ? (
          <h2 id={titleId} className='pb-4 text-xl font-medium text-Charcoal'>
            {title}
          </h2>
        ) : null}

        <div className='border-t border-Cian2 py-4 font-light leading-normal text-Charcoal/80'>
          {children}
        </div>

        <div className='mt-6 flex flex-col-reverse gap-3 px-2 pb-2 sm:flex-row sm:justify-end sm:px-0 sm:pb-0'>
          <button
            onClick={onClose}
            className='rounded-md px-4 py-2 text-center text-sm text-Charcoal transition-all hover:bg-Cian2'
            type='button'
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm ?? onClose}
            className='rounded-md border border-transparent bg-Green8 px-4 py-2 text-center text-sm text-white shadow-md transition-all hover:bg-Green7'
            type='button'
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}
