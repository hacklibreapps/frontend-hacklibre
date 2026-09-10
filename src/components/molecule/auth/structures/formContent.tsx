import { ChildrenInterface } from '@/interfaces/structures/childrenInterface'

interface formContentProps extends ChildrenInterface {
  className?: string
  classNameInter?: string
}

const FormContent: React.FC<formContentProps> = ({
  className = '',
  classNameInter = '',
  children
}) => {
  return (
    <div className={`w-full ${className}`}>
      {/* alineado arriba y permite crecer en columna */}
      <div
        className={` ${
          classNameInter
            ? classNameInter
            : 'w-full px-2 flex flex-col justify-center items-start'
        }`}
      >
        {children}
      </div>
    </div>
  )
}

export default FormContent
