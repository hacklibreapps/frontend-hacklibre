import { ChildrenInterface } from '@/interfaces/structures/childrenInterface'

const FormContainer: React.FC<ChildrenInterface> = ({ children }) => {
  return (
    <div className='w-full flex flex-row flex-wrap'>
      {children}
    </div>
  )
}
export default FormContainer
