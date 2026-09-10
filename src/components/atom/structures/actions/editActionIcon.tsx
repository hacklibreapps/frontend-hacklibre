// src/components/atom/structures/actions/EditActionIcon.tsx
'use client'
import { RiEditLine } from 'react-icons/ri'

type Size = 'sm' | 'md' | 'lg'
const sizeClass = (s: Size) =>
  s === 'sm' ? 'p-1 text-base' : s === 'lg' ? 'p-3 text-2xl' : 'p-2 text-xl'

interface Props {
  onClick?: () => void
  title?: string
  disabled?: boolean
  className?: string
  size?: Size
}

const EditActionIcon: React.FC<Props> = ({
  onClick,
  title = 'Editar',
  disabled = false,
  className = '',
  size = 'md'
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
      className={`rounded-full text-Green9 disabled:opacity-50 disabled:pointer-events-none ${sizeClass(
        size
      )} ${className}`}
    >
      <RiEditLine />
    </button>
  )
}

export default EditActionIcon
