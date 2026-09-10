'use client'
import { RiAddLine } from 'react-icons/ri'
import React from 'react'

type Size = 'sm' | 'md' | 'lg'
const sizeClass = (s: Size) =>
  s === 'sm' ? 'p-1 text-base' : s === 'lg' ? 'p-3 text-2xl' : 'p-2 text-xl'

interface Props {
  onClick?: () => void
  title?: string
  disabled?: boolean
  className?: string
  size?: Size
  asBorder?: boolean
  asWhite?: boolean
  border?: string
}

const AddActionIcon: React.FC<Props> = ({
  onClick,
  title = 'Agregar',
  disabled = false,
  className = '',
  size = 'md',
  asBorder,
  asWhite,
  border
}) => {
  return (
    <button
      type='button'
      onClick={onClick}
      disabled={disabled}
      aria-label={title}
      title={title}
      data-tooltip-id='tooltip'
      data-tooltip-place='left'
      data-tooltip-content={title}
      className={`rounded-full ${asBorder ? 'border' : null} ${border ? border : 'border-white'} ${asWhite ? 'text-white' : 'text-Cian7'} focus:outline-none disabled:opacity-50 ${sizeClass(
        size
      )} ${className}`}
    >
      <RiAddLine size='26' />
    </button>
  )
}

export default AddActionIcon
