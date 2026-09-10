import React from 'react'

interface HeaderItemsInterface {
  title: React.ReactNode | string
  value: React.ReactNode | string
  toRight?: boolean
  noSeparator?: boolean
  wSeparator?: string[]
}
const HeaderQuotationItem: React.FC<HeaderItemsInterface> = ({
  title,
  value,
  toRight,
  noSeparator,
  wSeparator
}) => {
  return (
    <div
      className={`w-full flex flex-row ${
        toRight ? 'justify-start md:justify-end' : 'justify-center'
      } py-1 items-stretch`}
    >
      <div
        className={`${
          noSeparator
            ? wSeparator && wSeparator.length > 0
              ? wSeparator[0]
              : 'w-4/12 md:w-auto'
            : 'w-4/12'
        } flex flex-row justify-start items-center pr-2`}
      >
        {title}
      </div>
      <div
        className={`${
          noSeparator
            ? wSeparator && wSeparator.length > 0
              ? wSeparator[1]
              : 'w-8/12 md:w-auto'
            : 'w-8/12'
        } flex flex-row justify-start font-medium items-center pl-2`}
      >
        {value}
      </div>
    </div>
  )
}

export { HeaderQuotationItem }
