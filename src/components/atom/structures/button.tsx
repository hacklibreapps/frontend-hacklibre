/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC } from 'react'
import { AiOutlineLoading } from 'react-icons/ai'
import { ButtonProps } from '@/interfaces/structures/inputInterface'
import InputContainer from './containers/inputcontainer'

const Button: FC<ButtonProps> = ({ data }) => {
  const allowedTypes = ['button', 'submit', 'reset'] as const

  const typeData: 'button' | 'submit' | 'reset' = allowedTypes.includes(
    data.type as any
  )
    ? (data.type as 'button' | 'submit' | 'reset')
    : 'button'

  const disabled = data.disabled ? true : false

  return (
    <InputContainer tiny={data.tiny} centeredTiny={data.tiny}>
      {data.showLabel ? (
        <label className='text-md font-bold pb-1' htmlFor={data.id}>
          {data.label}
        </label>
      ) : (
        ''
      )}

      <button
        name={data.name}
        id={data.id}
        className={`border hover:shadow-xl transition-all duration-300 ease-in-out ${
          !disabled ? 'cursor-pointer' : ''
        }  ${
          data.tiny ? 'w-1/2' : 'py-3 w-full'
        } rounded-lg text-lg font-medium ${
          disabled
            ? 'border-gray-300 bg-gray-200  text-DarkBlue/60'
            : typeData === 'submit'
            ? 'border-cyan-950 hover:bg-cyan-700 bg-cyan-800 text-white active:bg-cyan-900'
            : 'border-green-600/90 hover:bg-green-600 bg-green-600/90 text-White active:bg-green-600/90'
        } `}
        disabled={data.loaded ? true : disabled ? true : false}
        type={typeData}
      >
        <div
          className={`relative flex flex-row justify-center items-center ${
            data.compact ? 'min-h-2' : 'min-h-9'
          }`}
        >
          <span className='relative z-10'>{data.buttonName}</span>
          {data.loaded ? (
            <span className={`absolute right-3 pl-3 text-white`}>
              <AiOutlineLoading
                size={data.tiny ? '24' : '32'}
                className='animate-spin text-DarkBlue'
              />
            </span>
          ) : null}
        </div>
      </button>
    </InputContainer>
  )
}

export { Button }
