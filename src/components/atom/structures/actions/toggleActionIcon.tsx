// src/components/atom/structures/actions/ToggleActionIcon.tsx
//COMPONENE PARA ACTIVAR Y DESACTIVAR
'use client'
import { RiToggleLine } from 'react-icons/ri'

type Size = 'sm' | 'md' | 'lg'
const sizeClass = (s: Size) =>
  s === 'sm' ? 'p-1 text-base' : s === 'lg' ? 'p-3 text-2xl' : 'p-2 text-xl'

interface Props {
  active: boolean // estado actual (true=activo)
  onClick?: () => void
  titleActive?: string // tooltip cuando está activo (acción: desactivar)
  titleInactive?: string // tooltip cuando está inactivo (acción: activar)
  disabled?: boolean
  className?: string
  size?: Size
}

const ToggleActionIcon: React.FC<Props> = ({
  active,
  onClick,
  titleActive = 'Desactivar',
  titleInactive = 'Activar',
  disabled = false,
  className = '',
  size = 'md'
}) => {
  const title = active ? titleActive : titleInactive
  const palette = active
    ? 'text-red-700 focus:ring-rose-300'
    : 'text-Green9 focus:ring-emerald-300'

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
      className={`disabled:opacity-50 disabled:pointer-events-none ${palette} ${sizeClass(
        size
      )} ${className}`}
    >
      <RiToggleLine />
    </button>
  )
}

export default ToggleActionIcon
