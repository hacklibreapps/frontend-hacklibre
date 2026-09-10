'use client'

import { FC, useState } from 'react'
import { TextAreaProps } from '@/interfaces/structures/inputInterface'
import InputContainer from './containers/inputcontainer'
import TinyEditor from '@/services/tinyEditor'
import GrapesEditor from '@/services/grapesEditor'

const TextArea: FC<TextAreaProps> = ({ data }) => {
  const [hasRegexError] = useState(false)

  const label = data.required
    ? `${data.label}<span class="text-Red7">*</span>`
    : data.label

  const inputClass = [
    `peer form-input w-full ${!data.tiny ? 'rounded-md' : ''} shadow-sm`,
    'border border-Cian7/50 text-Charcoal placeholder:text-Charcoal/50',
    'focus:outline-none focus:border-Cian4 focus:ring-2 focus:ring-Cian2/50',
    'placeholder:opacity-70 focus:placeholder:opacity-0 placeholder:transition-opacity text-sm px-3 ',
    data.readOnly ? 'bg-Greys cursor-not-allowed' : 'bg-white',
    hasRegexError ? 'border-Red8 focus:border-Red8 focus:ring-Red8/40' : '',
    data.className ?? ''
  ]
    .filter(Boolean)
    .join(' ')
  switch (data.type) {
    case 'tinyMCE':
      return (
        <InputContainer>
          <div className='w-full flex flex-col justify-start items-start'>
            {data.showLabel && (
              <label
                htmlFor={data.id}
                className='text-md font-medium pl-1 pb-1 text-Cian8'
                dangerouslySetInnerHTML={{ __html: label }}
              ></label>
            )}
            <TinyEditor
              value={data.value as string}
              onChange={data.onChange as (content: string) => void}
              height={data.row ? data.row : 600}
              tinyMceRef={data.tinyMceRef}
            />
          </div>
        </InputContainer>
      )
    case 'grapesjs':
      return (
        <InputContainer>
          <div className='w-full flex flex-col justify-start items-start'>
            {data.showLabel && (
              <label
                htmlFor={data.id}
                className='text-md font-medium pl-1 pb-1 text-Cian8'
                dangerouslySetInnerHTML={{ __html: label }}
              ></label>
            )}
            <GrapesEditor
              value={data.value as string}
              onChange={(html, css) => {
                if (data.onChange) {
                  // guardamos ambos valores como JSON
                  const payload = JSON.stringify({ html, css })
                  data.onChange(payload)
                }
              }}
              height={data.row ?? 600}
            />
          </div>
        </InputContainer>
      )
    default:
      return (
        <InputContainer>
          <div className='w-auto pb-1'>
            {data.showLabel && (
              <label
                htmlFor={data.id}
                className='text-md pb-1 text-Cian8'
                dangerouslySetInnerHTML={{ __html: label }}
              ></label>
            )}
          </div>
          <textarea
            id={data.id}
            ref={data.ref}
            required={data.required}
            minLength={data.minLen}
            maxLength={data.maxLen}
            readOnly={data.readOnly}
            placeholder={data.placeHolder}
            rows={data.row ? data.row : 2}
            className={`${inputClass} ${
              data.type === 'password' ? 'pr-12' : ''
            }`}
            defaultValue={data.value ? data.value.toString() : ''}
          ></textarea>
        </InputContainer>
      )
  }
}

export default TextArea
