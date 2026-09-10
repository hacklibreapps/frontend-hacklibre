/* eslint-disable @next/next/no-img-element */
'use client'

import { forwardRef } from 'react'

type ImgProps = {
  src: string
  className?: string
  alt?: string
  onLoad?: () => void
}

// forwardRef permite recibir el ref correctamente
const Img = forwardRef<HTMLImageElement, ImgProps>(
  ({ src, className, alt, onLoad }, ref) => {
    const classs = className ?? 'w-auto h-auto'
    const textAlt = alt ?? 'Hacklibre'

    return (
      <img
        ref={ref}
        src={src}
        onLoad={onLoad}
        className={classs}
        alt={textAlt}
        loading='lazy'
      />
    )
  }
)

Img.displayName = 'Img' // necesario para evitar warnings en dev

export { Img }
