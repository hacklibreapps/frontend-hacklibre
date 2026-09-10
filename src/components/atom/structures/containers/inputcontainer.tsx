import { FC } from 'react'
interface InputContainerTinnyProps {
  children: React.ReactNode
  tiny?: boolean
  centeredTiny?: boolean
}
const InputContainer: FC<InputContainerTinnyProps> = ({
  children,
  tiny,
  centeredTiny
}) => {
  return (
    <div
      className={`w-full py-2 flex flex-row ${
        tiny && centeredTiny ? 'justify-center' : 'justify-start'
      }  items-center`}
    >
      <div
        className={`relative w-full flex ${tiny ? 'flex-row' : 'flex-col'} ${
          tiny && centeredTiny ? 'justify-center' : 'justify-start'
        } ${tiny ? 'items-center' : 'items-start'}`}
      >
        {children}
      </div>
    </div>
  )
}
export default InputContainer
