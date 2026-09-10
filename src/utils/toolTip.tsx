import { PlacesType, VariantType } from 'react-tooltip'
import 'react-tooltip/dist/react-tooltip.css'
const ToolTip = ({
  place = 'left',
  content = 'tooltip',
  time = 0,
  variant = 'dark',
  className = '',
  children
}: {
  place?: PlacesType
  content?: string
  time?: number
  variant?: VariantType
  className?: string
  children: React.ReactNode
}) => {
  const ttPlace: PlacesType = place
  return (
    <div
      className={className}
      data-tooltip-id='tooltip'
      data-tooltip-variant={variant}
      data-tooltip-place={ttPlace}
      data-tooltip-content={content}
      data-tooltip-delay-hide={time}
    >
      {children}
    </div>
  )
}
export { ToolTip }
