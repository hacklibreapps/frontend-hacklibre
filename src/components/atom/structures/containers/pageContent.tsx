import { CSSProperties } from "react"

interface pageContainerInterface {
  children: React.ReactNode
  className?: string
  styleInside?: CSSProperties
}
const PageContent: React.FC<pageContainerInterface> = ({
  children,
  className,
  styleInside
}) => {
  return (
    <div className={`w-full text-DarkBlue rounded-none p-0 lg:pt-4 ${className}`} style={styleInside}>
      {children}
    </div>
  )
}
export default PageContent
