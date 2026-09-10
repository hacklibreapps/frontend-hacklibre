import Link from 'next/link'
import { AiOutlineLoading3Quarters, AiOutlinePlusCircle } from 'react-icons/ai'
import { IconContainer } from '../../structures/containers/iconContainer'

interface InterfaceNewPath {
  link?: string
  icon?: JSX.Element
  tooltip?: string
  onClick?: () => void
  className?: string
  noLink?: boolean
  loading?: boolean
}
const NewPath: React.FC<InterfaceNewPath> = ({
  link,
  icon,
  tooltip,
  onClick,
  className,
  noLink,
  loading
}) => {
  const iconPath = icon ? icon : <AiOutlinePlusCircle />
  return link ? (
    <IconContainer
      toolTipContent={tooltip ? tooltip : 'Nuevo'}
      className={`text-GreenPNP text-2xl ${className}`}
      onClick={onClick}
    >
      <Link href={link}>
        {loading ? <AiOutlineLoading3Quarters className='animate-spin text-Cian7' /> : iconPath}
      </Link>
    </IconContainer>
  ) : noLink ? (
    <IconContainer
      toolTipContent={tooltip ? tooltip : 'Nuevo'}
      className={`text-GreenPNP text-2xl ${className}`}
      onClick={onClick}
    >
      {loading ? '' : iconPath}
    </IconContainer>
  ) : null
}
export default NewPath
