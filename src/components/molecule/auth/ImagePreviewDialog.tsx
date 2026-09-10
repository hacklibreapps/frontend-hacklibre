'use client'

import { useEffect, useState } from 'react'
import { Img } from '@/utils/img'
import { FiHeart, FiDownload, FiShare2, FiX } from 'react-icons/fi'

type DialogSize = 'sm' | 'md' | 'lg' | 'xl' | 'full'

export interface ImagePreviewDialogProps {
  /** Miniatura que se muestra en la card */
  thumbnailSrc: string
  /** Imagen grande dentro del modal (si no se pasa, usa thumbnailSrc) */
  fullSrc?: string
  alt: string

  /** Clases extra para la card */
  className?: string

  /** Header del modal */
  avatarSrc?: string
  title?: string
  subtitle?: string

  /** Acciones del header */
  showLike?: boolean
  onLike?: () => void
  downloadable?: boolean
  downloadLabel?: string
  onShare?: () => void

  /** Estadísticas del footer del modal */
  stats?: Array<{ label: string; value: string | number }>

  /** Tamaño del modal */
  modalSize?: DialogSize
  /** Alto del contenedor de imagen en el modal */
  imgHeightClass?: string
}

const sizeClassMap: Record<DialogSize, string> = {
  sm: 'w-1/3 max-w-xl',
  md: 'w-1/2 max-w-3xl',
  lg: 'w-3/5 max-w-4xl',
  xl: 'w-3/4 max-w-5xl',
  full: 'w-screen h-screen'
}

export default function ImagePreviewDialog({
  thumbnailSrc,
  fullSrc,
  alt,
  className,
  avatarSrc,
  title,
  subtitle,
  showLike = true,
  onLike,
  downloadable = true,
  downloadLabel = 'Free Download',
  onShare,
  stats,
  modalSize = 'lg',
  imgHeightClass = 'h-[30rem]'
}: ImagePreviewDialogProps) {
  const [open, setOpen] = useState(false)
  const bigSrc = fullSrc ?? thumbnailSrc

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <>
      {/* Card de preview */}
      <div
        role='button'
        aria-label='Abrir previsualización'
        onClick={() => setOpen(true)}
        className={[
          'relative flex h-64 w-96 cursor-pointer flex-col overflow-hidden rounded-lg bg-white shadow-sm transition-opacity hover:opacity-90',
          className || ''
        ].join(' ')}
      >
        <Img
          alt={alt}
          src={thumbnailSrc}
          className='h-full w-full object-cover object-center'
        />
      </div>

      {/* Modal */}
      {open && (
        <div
          className='fixed inset-0 z-[999] grid h-screen w-screen place-items-center bg-black/60 backdrop-blur-sm'
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setOpen(false)
          }}
        >
          <div
            role='dialog'
            aria-modal='true'
            className={`relative m-4 rounded-lg bg-white shadow-sm dark:bg-slate-900 ${sizeClassMap[modalSize]}`}
          >
            {/* Header */}
            <div className='flex items-center justify-between p-4'>
              {avatarSrc || title || subtitle ? (
                <div className='flex items-center gap-3'>
                  {avatarSrc ? (
                    <Img
                      alt='avatar'
                      src={avatarSrc}
                      className='h-9 w-9 rounded-full object-cover object-center ring-1 ring-slate-200'
                    />
                  ) : null}
                  {(title || subtitle) && (
                    <div className='-mt-px flex flex-col'>
                      {title ? (
                        <p className='text-sm font-medium text-slate-800 dark:text-slate-100'>
                          {title}
                        </p>
                      ) : null}
                      {subtitle ? (
                        <p className='text-xs text-slate-500'>{subtitle}</p>
                      ) : null}
                    </div>
                  )}
                </div>
              ) : (
                <div />
              )}

              <div className='flex items-center gap-2'>
                {showLike && (
                  <button
                    type='button'
                    className='rounded-md p-2.5 text-slate-600 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800'
                    aria-label='Me gusta'
                    onClick={onLike}
                  >
                    <FiHeart className='h-4 w-4' />
                  </button>
                )}

                {downloadable && (
                  <a
                    href={bigSrc}
                    download
                    className='inline-flex items-center gap-2 rounded-md bg-slate-800 px-4 py-2 text-sm text-white shadow-md transition hover:shadow-lg hover:bg-slate-700 focus:bg-slate-700 active:bg-slate-700'
                  >
                    <FiDownload className='h-4 w-4' />
                    {downloadLabel}
                  </a>
                )}

                {onShare && (
                  <button
                    type='button'
                    onClick={onShare}
                    className='inline-flex items-center gap-2 rounded-md border border-slate-300 px-4 py-2 text-sm text-slate-600 shadow-sm transition hover:border-slate-800 hover:bg-slate-800 hover:text-white focus:bg-slate-800 focus:text-white active:bg-slate-800 dark:border-slate-700 dark:text-slate-200'
                  >
                    <FiShare2 className='h-4 w-4' />
                    Share
                  </button>
                )}

                <button
                  type='button'
                  aria-label='Cerrar'
                  onClick={() => setOpen(false)}
                  className='ml-1 rounded-md p-2.5 text-slate-600 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800'
                >
                  <FiX className='h-4 w-4' />
                </button>
              </div>
            </div>

            {/* Imagen grande */}
            <div className='border-y border-slate-200 p-0 dark:border-slate-700'>
              <Img
                alt={alt}
                src={bigSrc}
                className={`${imgHeightClass} w-full object-cover object-center`}
              />
            </div>

            {/* Footer */}
            {(stats && stats.length > 0) || onShare ? (
              <div className='flex flex-wrap items-center justify-between gap-4 p-4'>
                {stats && stats.length > 0 ? (
                  <div className='flex items-center gap-10'>
                    {stats.map((s, i) => (
                      <div key={`${s.label}_${i}`}>
                        <p className='text-sm text-slate-500'>{s.label}</p>
                        <p className='font-medium text-slate-800 dark:text-slate-100'>
                          {s.value}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div />
                )}

                {!onShare ? null : (
                  <button
                    type='button'
                    onClick={onShare}
                    className='inline-flex items-center gap-2 rounded-md border border-slate-300 px-4 py-2 text-sm text-slate-600 shadow-sm transition hover:border-slate-800 hover:bg-slate-800 hover:text-white focus:bg-slate-800 focus:text-white active:bg-slate-800 dark:border-slate-700 dark:text-slate-200'
                  >
                    <FiShare2 className='h-4 w-4' />
                    Share
                  </button>
                )}
              </div>
            ) : null}
          </div>
        </div>
      )}
    </>
  )
}
