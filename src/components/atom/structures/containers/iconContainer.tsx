import { PlacesType } from 'react-tooltip'

interface ICInterface {
  children: React.ReactNode
  toolTipPlace?: PlacesType
  toolTipContent?: string
  pointer?: boolean
  className?: string
  onClick?: () => void
  onMouseEnter?: () => void
  onMouseLeave?: () => void
}
const IconContainer: React.FC<ICInterface> = ({
  children,
  toolTipPlace,
  toolTipContent,
  pointer,
  className,
  onClick,
  onMouseEnter,
  onMouseLeave
}) => {
  const ttPlace: PlacesType = toolTipPlace || 'left'
  const pointerP = pointer ? pointer : true
  const ttContent = toolTipContent ? toolTipContent : ''
  return (
    <div
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={`px-2 relative ${className} ${
        pointerP ? 'cursor-pointer' : ''
      }`}
    >
      <div
        data-tooltip-id='tooltip'
        data-tooltip-place={ttPlace}
        data-tooltip-content={ttContent}
      >
        {children}
      </div>
    </div>
  )
}
export { IconContainer }
