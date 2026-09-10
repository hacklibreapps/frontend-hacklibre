'use client'

import React, { useId, useState } from 'react'

type ColorVariant = 'cian' | 'red' | 'green' | 'neutral'

export interface CheckboxFancyProps {
  /** Texto a la derecha del checkbox */
  label?: string
  /** Icono centrado que aparece al estar checked */
  icon?: React.ReactNode
  /** Controlado */
  checked?: boolean
  /** No controlado (valor inicial) */
  defaultChecked?: boolean
  /** Cambios de valor */
  onChange?: (checked: boolean) => void
  /** Paleta */
  color?: ColorVariant
  /** id del input (si no, se genera) */
  id?: string
  /** Deshabilitar */
  disabled?: boolean
  /** Clases extra al wrapper */
  className?: string
}

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ')
}

const colorClasses: Record<
  ColorVariant,
  { box: string; ring?: string; text?: string }
> = {
  cian: {
    box: 'border-Cian2 bg-Cian2 checked:border-Cian8 checked:bg-Cian8',
    ring: 'focus:ring-Cian4',
    text: 'text-Charcoal'
  },
  red: {
    box: 'border-Red8 bg-Red8 checked:border-Red10 checked:bg-Red10',
    ring: 'focus:ring-Red7',
    text: 'text-Charcoal'
  },
  green: {
    box: 'border-Green8 bg-Green8 checked:border-Green10 checked:bg-Green10',
    ring: 'focus:ring-Green7',
    text: 'text-Charcoal'
  },
  neutral: {
    box: 'border-slate-300 bg-slate-200 checked:border-slate-700 checked:bg-slate-700',
    ring: 'focus:ring-slate-400',
    text: 'text-slate-800'
  }
}

const CheckboxFancy: React.FC<CheckboxFancyProps> = ({
  label,
  icon,
  checked,
  defaultChecked,
  onChange,
  color = 'cian',
  id,
  disabled,
  className
}) => {
  const autoId = useId()
  const inputId = id ?? autoId

  // Soporta controlado y no controlado
  const isControlled = typeof checked === 'boolean'
  const [internal, setInternal] = useState<boolean>(defaultChecked ?? false)
  const value = isControlled ? checked! : internal

  const palette = colorClasses[color] ?? colorClasses.cian

  return (
    <label
      htmlFor={inputId}
      className={cx(
        'inline-flex select-none items-center gap-3 cursor-pointer',
        disabled && 'opacity-60 cursor-not-allowed',
        className
      )}
    >
      {/* Contenedor visual cuadrado */}
      <span className='relative grid h-6 w-6 place-items-center'>
        <input
          id={inputId}
          type='checkbox'
          disabled={disabled}
          className={cx(
            'peer absolute inset-0 h-full w-full appearance-none rounded transition-all hover:shadow-md',
            'border shadow',
            palette.box,
            'focus:outline-none focus:ring-2',
            palette.ring
          )}
          checked={value}
          onChange={(e) => {
            if (!isControlled) setInternal(e.target.checked)
            onChange?.(e.target.checked)
          }}
          aria-label={label ?? 'custom checkbox'}
        />
        {/* Icono centrado */}
        <span className='pointer-events-none absolute inset-0 grid place-items-center text-white opacity-0 transition-opacity duration-150 peer-checked:opacity-100'>
          {icon}
        </span>
      </span>

      {label ? (
        <span className={cx('text-sm', palette.text)}>{label}</span>
      ) : null}
    </label>
  )
}

export default CheckboxFancy
