'use client'

import { FC, useState, ChangeEvent } from 'react'
import { ImEye, ImEyeBlocked } from 'react-icons/im'
import { InputProps } from '@/interfaces/structures/inputInterface'
import InputContainer from './containers/inputcontainer'
import Link from 'next/link'

const Input: FC<InputProps> = ({ data }) => {
  const [showPassword, setShowPassword] = useState(false)
  const [hasRegexError] = useState(false)

  const inputType =
    data.type === 'password' && showPassword ? 'text' : data.type || 'text'
  const placeHolder = data.placeHolder ?? ''
  const label = data.required
    ? `${data.label}<span class="text-Red7">*</span>`
    : data.label

  const inputClass = [
    `peer form-input w-full ${!data.tiny ? 'rounded-md' : ''} shadow-sm`,
    `border border-Cian7/50 ${
      data.type === 'file' ? 'py-[2px] pl-[2px]' : null
    } text-Charcoal placeholder:text-Charcoal/50`,
    'focus:outline-none focus:border-Cian4 focus:ring-2 focus:ring-Cian2/50',
    'placeholder:opacity-70 focus:placeholder:opacity-0 placeholder:transition-opacity text-sm px-3 ',
    data.tiny ? 'h-8 ' : 'h-11 ',
    data.readOnly ? 'bg-Greys cursor-not-allowed' : 'bg-white',
    hasRegexError ? 'border-Red8 focus:border-Red8 focus:ring-Red8/40' : '',
    data.type === 'password' ? 'pr-10' : '',
    data.className ?? ''
  ]
    .filter(Boolean)
    .join(' ')

  switch (inputType) {
    case 'radio':
      return (
        <InputContainer>
          <div className='flex flex-row justify-start pl-3 items-center h-11'>
            <div className='flex flex-row justify-center items-center'>
              <input
                type='radio'
                name={data.name}
                id={data.id}
                className='w-5 h-5 accent-Cian7 bg-Cian8 text-Cian7'
                ref={data.ref}
                defaultChecked={data.value === true ? data.value : false}
                onChange={data.onChange ? () => data.onChange : undefined}
              />
            </div>
            <div>
              <label
                dangerouslySetInnerHTML={{ __html: label }}
                className='text-md font-medium pl-1 pb-1 text-Cian8'
                htmlFor={data.id}
              />
            </div>
          </div>
        </InputContainer>
      )
    case 'checkbox':
      return (
        <InputContainer centeredTiny tiny>
          <div className='flex flex-row justify-start pl-3 items-center h-11'>
            <div className='flex flex-row justify-center items-center'>
              <input
                type='checkbox'
                name={data.name}
                id={data.id}
                className={`${data.className} w-5 h-5 accent-Cian7 bg-Cian7 text-Cian7`}
                ref={data.ref}
                defaultChecked={data.checked}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  if (data.onChange) {
                    data.onChange(e.target.checked.toString())
                  }

                  if (data.onChange2) {
                    data.onChange2(e)
                  }
                }}
              />
            </div>
            <div>
              <label
                dangerouslySetInnerHTML={{ __html: label }}
                className='text-md font-medium pl-1 pb-1 text-Cian8'
                htmlFor={data.id}
              />
            </div>
          </div>
        </InputContainer>
      )
    case 'switch':
      return (
        <div className='flex flex-row justify-start pl-3 items-center h-16'>
          <div className='flex flex-row justify-center items-center'>
            <label className='inline-flex items-center cursor-pointer'>
              <input
                type='checkbox'
                name={data.name}
                id={data.id}
                className='w-5 h-5 accent-Cian4 bg-Cian4 text-Cian4 sr-only peer'
                ref={data.ref}
                defaultChecked={
                  data.value !== undefined
                    ? data.value === true
                      ? true
                      : false
                    : true
                }
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  data.onChange?.(e.target.checked.toString())
                }}
              />
              <div
                className={`relative w-11 h-6 bg-White border border-Cian8 peer-focus:outline-none peer-focus:ring-0 peer-focus:ring-Cian4 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-Cian8 after:content-[''] after:absolute after:top-[1px] after:start-[1px] after:bg-Cian8 after:border-Cian8 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-Cian8/40`}
              />
              <span
                dangerouslySetInnerHTML={{ __html: label }}
                className='ms-3 text-sm text-Cian8 font-medium'
              />
            </label>
          </div>
        </div>
      )
    default:
      return (
        <InputContainer>
          {data.showLabel && (
            <div className='w-auto pb-1'>
              <label
                dangerouslySetInnerHTML={{ __html: label }}
                className='text-md font-medium pl-1 pb-1 text-Cian8'
                htmlFor={data.id}
              />
              {inputType === 'file' && data.value ? (
                <Link
                  href={data.value.toString()}
                  className='ml-3 border-t border-b mb-1 text-Red7'
                  target='_blank'
                >
                  Ver adjunto
                </Link>
              ) : null}
            </div>
          )}
          <input
            autoComplete='off'
            id={data.id}
            type={inputType}
            ref={data.ref}
            min={data.minLen}
            max={data.maxLen}
            required={data.required}
            minLength={data.minLen}
            maxLength={data.maxLen}
            readOnly={data.readOnly}
            step={data.step}
            pattern={data.pattern}
            {...(data.type !== 'file' && {
              defaultValue:
                data.value !== null && typeof data.value !== 'boolean'
                  ? data.value
                  : undefined
            })}
            className={`${inputClass} ${
              data.type === 'password' ? 'pr-12' : ''
            }`}
            placeholder={placeHolder}
            onKeyUp={data.onKeyUp}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              const value = e.target.value
              data.onChange?.(value)
              data.onChange2?.(e)
            }}
            onClick={data.onClick ? () => data.onClick : undefined}
          />
          {data.type === 'password' && (
            <div
              onClick={() => setShowPassword(!showPassword)}
              className='px-3 text-Cian4 cursor-pointer absolute bottom-2 right-1'
            >
              {showPassword ? <ImEyeBlocked size={20} /> : <ImEye size={20} />}
            </div>
          )}
        </InputContainer>
      )
  }
}

export default Input
