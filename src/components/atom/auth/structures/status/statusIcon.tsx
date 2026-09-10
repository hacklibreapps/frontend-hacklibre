interface statusInterface {
  status: boolean | string
  labelActivo?: string
  labelInactivo?: string
  full?: boolean
  className?: string
  onClick?: () => void
}
const StatusIcon: React.FC<statusInterface> = ({
  status,
  labelActivo,
  labelInactivo
}) => {
  const activo = labelActivo ? labelActivo : 'Activo'
  const inactivo = labelInactivo ? labelInactivo : 'Inactivo'
  return (
    <span
      className={`inline-flex rounded-full px-2 py-0.5 text-xs ${
        status ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
      }`}
    >
      {status ? activo : inactivo}
    </span>
  )
}
const StatusIconStates: React.FC<statusInterface> = ({
  status,
  labelActivo,
  full,
  className,
  onClick
}) => {
  const STATUS_COLORS: Record<string, string> = {
    DRAFT: 'bg-gray-100 text-gray-700',
    SENT: 'bg-blue-100 text-blue-700',
    CONFIRM: 'bg-green-100 text-green-700',
    ACCEPTED: 'bg-green-500 text-black',
    COMPLETED: 'bg-green-500 text-black',
    REJECTED: 'bg-red-100 text-red-700',
    EXPIRED: 'bg-orange-100 text-orange-700',
    CLOSED: 'bg-gray-500 text-white',
    VOID: 'bg-black text-white'
  }

  return full ? (
    <div
      className={` px-2 w-full py-1 rounded-md text-xs font-semibold ${
        STATUS_COLORS[status as string]
      }`}
    >
      {labelActivo}
    </div>
  ) : (
    <span
      onClick={onClick}
      className={`${className} px-2 py-1 rounded-md text-xs font-semibold ${
        STATUS_COLORS[status as string]
      }`}
    >
      {labelActivo}
    </span>
  )
}
export { StatusIcon, StatusIconStates }
