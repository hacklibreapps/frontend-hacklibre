import { CSSProperties } from "react"

interface pageContainerInterface {
  children: React.ReactNode
  width?: string
  className?: string
  styleInside?: CSSProperties
}
const PageContainer: React.FC<pageContainerInterface> = ({
  children,
  width,
  className,
  styleInside
}) => {
  return (
    <div
      className={`${
        width ? width : 'w-full'
      } flex flex-col justify-center items-center p-0 lg:p-3 ${className}`}
    >
      <div className='w-full rounded-lg bg-slate-200 shadow-lg top-0 lg:p-5 flex flex-col justify-center items-center' style={styleInside}>
        {children}
      </div>
    </div>
  )
}
export default PageContainer
