'use client'

import { FC, useCallback, useEffect, useRef, useState } from 'react'
import { RiArrowDownSLine, RiArrowUpSLine } from 'react-icons/ri'
import { FaTimes } from 'react-icons/fa'
import { InputProps } from '@/interfaces/structures/inputInterface'
import { KeyValueInterface } from '@/interfaces/structures/keyValueInterface'
import { GrCheckbox, GrCheckboxSelected } from 'react-icons/gr'
import InputContainer from './containers/inputcontainer'
import { HiChevronDown, HiChevronUp } from 'react-icons/hi2'

const Select: FC<InputProps> = ({ data }) => {
  const placeHolder = data.placeHolder ? data.placeHolder : 'Seleccione'
  const [key, setKey] = useState<string | number>('')
  const [value, setValue] = useState<string>(placeHolder)
  const [showSelect, setShowSelect] = useState<boolean>(false)
  const [filteredData, SetFilteredData] = useState<KeyValueInterface[]>([])
  const [editDone, setEditDone] = useState<boolean>(false)
  const [selectedItems, setSelectedItems] = useState<KeyValueInterface[]>([]) // multiselect
  useEffect(() => {
    if (data.data) {
      SetFilteredData(data.data)
    }
  }, [data.data])

  const inputType = data.type ? data.type : 'select'
  const selectWrapperRef = useRef<HTMLDivElement>(null)

  const containerResizeRef = useRef<HTMLDivElement>(null)
  const [containerResizeHeight, setContainerResize] = useState<number>(42)
  useEffect(() => {
    if (containerResizeRef.current) {
      setContainerResize(
        containerResizeRef.current.getBoundingClientRect().height
      )
    }
  }, [selectedItems, showSelect])

  const handleMultiSelectItem = useCallback(
    (item: KeyValueInterface) => {
      setSelectedItems((prev) => {
        const alreadySelected = prev.find((sel) => sel.key === item.key)
        let updated: KeyValueInterface[]
        if (alreadySelected) {
          updated = prev.filter((sel) => sel.key !== item.key)
        } else {
          updated = [...prev, item]
        }

        if (data.ref.current && data.ref.current instanceof HTMLInputElement) {
          data.ref.current.value = updated.map((sel) => sel.key).join(',')
          if (data.onChange) {
            data.onChange(data.ref.current.value)
          }
        }
        return updated
      })
    },
    [data]
  )

  const handleClearAllMulti = useCallback(() => {
    setSelectedItems([])
    if (data.ref.current) {
      data.ref.current.value = ''
    }
    if (data.onChange) {
      data.onChange('')
    }
    if (data.onClick) {
      data.onClick('')
    }
    if (data.resetHandler) {
      data.resetHandler()
    }
  }, [data])

  // Cerrar si se hace click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectWrapperRef.current &&
        !selectWrapperRef.current.contains(event.target as Node)
      ) {
        setShowSelect(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handlerToogleSelect = () => {
    setShowSelect(!showSelect)
  }

  const searchRef = useRef<HTMLInputElement>(null)

  const HandleSelectedItem = useCallback(
    (item: KeyValueInterface) => {
      setKey(item.key)
      setValue(item.value)
      if (
        data.ref.current &&
        data.ref.current instanceof HTMLInputElement &&
        data.ref.current.type === 'hidden'
      ) {
        data.ref.current.value = item.key.toString()
        if (data.onChange) {
          data.onChange(item.key.toString())
        }
        if (data.onClick) {
          data.onClick(item.key.toString())
        }
      } else {
        console.warn('Unexpected ref type or input type:', data.ref.current)
      }
      setShowSelect(false)
    },
    [data]
  )

  const handleBorrarSeleccion = useCallback(() => {
    setKey('')
    setValue(placeHolder)

    if (data.ref.current) {
      data.ref.current.value = ''
    }

    if (data.onChange) {
      data.onChange('')
    }

    if (data.onClick) {
      data.onClick('')
    }
    if (data.resetHandler) {
      data.resetHandler()
    }
    setShowSelect(false)
  }, [placeHolder, data])

  useEffect(() => {
    if (data.resetSignal) {
      handleBorrarSeleccion()
    }
  }, [data, data.resetSignal, handleBorrarSeleccion])

  const hasClearedRef = useRef(false)

  useEffect(() => {
    if (filteredData.length === 0 && !hasClearedRef.current) {
      handleBorrarSeleccion()
      hasClearedRef.current = true
    } else if (filteredData.length > 0) {
      hasClearedRef.current = false
    }
  }, [filteredData, handleBorrarSeleccion])

  useEffect(() => {
    if (!editDone) {
      if (data.editData) {
        HandleSelectedItem(data.editData)
        setEditDone(true)
      }
    }
  }, [HandleSelectedItem, data.editData, editDone])

  const handleSearch = () => {
    const searchValue = searchRef.current?.value.toLowerCase() || ''
    if (data.onChangeSearch && inputType === 'searchSelect') {
      data.onChangeSearch(searchValue)
    }
    const filtered = data.data
      ? data.data.filter((item) =>
          item.value.toLowerCase().includes(searchValue)
        )
      : []
    SetFilteredData(filtered)
  }

  const label = data.required
    ? `${data.label}<span class="text-Red7">*</span>`
    : data.label

  switch (inputType) {
    case 'multiSelect':
      return (
        <InputContainer>
          <div ref={selectWrapperRef}>
            <input type='hidden' ref={data.ref} name={data.name} />
            {data.showLabel ? (
              <label
                dangerouslySetInnerHTML={{ __html: label }}
                className='text-md font-medium pl-1 pb-1 text-Cian8'
                htmlFor={data.id}
              ></label>
            ) : null}

            <div
              ref={containerResizeRef}
              className={`relative bg-white w-full ${
                showSelect
                  ? 'border-t-2 border-l-2 border-r-2 border-b-0 border-Orangevivido'
                  : 'border border-Cian7/50'
              } cursor-pointer flex flex-row justify-start items-center ${
                data.tiny ? 'min-h-11 h-11 py-0.5' : 'min-h-11 p-1'
              }  ${!showSelect ? '' : ''}`}

              //
            >
              {selectedItems.length > 0 && (
                <div
                  className='absolute -right-2 rounded-full -top-2 h-4 w-4 flex flex-row justify-center items-center text-Red7 bg-white'
                  data-tooltip-id='tooltip'
                  data-tooltip-place='left'
                  data-tooltip-content='Borrar Selección'
                  onClick={handleClearAllMulti}
                >
                  <FaTimes
                    size={18}
                    className='text-Red7 bg-WhiteBone  rounded-xl'
                  />
                </div>
              )}
              <div
                className={`w-full  flex flex-wrap gap-1`}
                onClick={handlerToogleSelect}
              >
                {selectedItems.length > 0 ? (
                  selectedItems.map((sel) => (
                    //
                    <span
                      className={`text-Cian8 border border-black bg-black/10 rounded flex items-center gap-1
                      ${data.tiny ? 'px-1 py-0 text-xs' : 'px-2 py-1 text-sm'}
                     `}
                      key={sel.key}
                    >
                      {sel.value}
                      <FaTimes
                        size={data.tiny ? 10 : 12}
                        className='cursor-pointer text-Red7'
                        onClick={(e) => {
                          e.stopPropagation()
                          handleMultiSelectItem(sel)
                        }}
                      />
                    </span>
                  ))
                ) : (
                  <span className='text-Cian8 pl-2'>{placeHolder}</span>
                )}
                <div className='absolute right-2 bottom-1'>
                  {showSelect ? (
                    <RiArrowUpSLine size={data.tiny ? 22 : 30} />
                  ) : (
                    <RiArrowDownSLine size={data.tiny ? 22 : 30} />
                  )}
                </div>
              </div>

              {showSelect && (
                <div
                  className={`${
                    showSelect
                      ? 'border-2 border-Orangevivido'
                      : 'border border-Cian7/50'
                  } w-full absolute left-0 max-h-48 overflow-y-auto bg-Cian2 z-[99999]`}
                  // style={{ top: `${containerResizeHeight - 3}px` }}
                  style={{
                    top: data.tiny
                      ? `${containerResizeHeight - 6}px`
                      : `${containerResizeHeight - 3}px`
                  }}
                >
                  <div className='w-full border-b border-b-Cian4 h-8'>
                    <input
                      type='text'
                      className={`w-full text-Cian8 outline-none ring-0 placeholder:text-Cian8/50 border-b ${data.tiny ? 'h-6 px-2 text-xs' : 'h-full px-3'}`}
                      onKeyUp={handleSearch}
                      ref={searchRef}
                      placeholder='Ingrese dato a buscar'
                    />
                  </div>
                  {data.disabled
                    ? ''
                    : filteredData.length > 0 &&
                      filteredData.map((item, index) => {
                        const isSelected = selectedItems.some(
                          (sel) => sel.key === item.key
                        )
                        return (
                          <div
                            onClick={() => handleMultiSelectItem(item)}
                            key={index}
                            className={`p-2 even:bg-gray-100 text-Cian8 hover:bg-Greys/50 w-full min-h-8 border-WhiteBone flex justify-between ${
                              isSelected ? 'bg-Cian8/20 hover:bg-Cian8/20' : ''
                            }`}
                          >
                            <div className='flex flex-row items-center'>
                              <span className='pr-1'>
                                {isSelected ? (
                                  <GrCheckboxSelected
                                    className='text-Green8'
                                    size={14}
                                  />
                                ) : (
                                  <GrCheckbox size={14} />
                                )}
                              </span>
                              {item.value}
                            </div>
                            {isSelected && (
                              <FaTimes className='text-Red7' size={14} />
                            )}
                          </div>
                        )
                      })}
                </div>
              )}
            </div>
          </div>
        </InputContainer>
      )
    default:
      return (
        <InputContainer>
          <div ref={selectWrapperRef} className='w-full'>
            <input type='hidden' ref={data.ref} name={data.name} />
            <div className='w-auto pb-1'>
              {data.showLabel ? (
                <label
                  dangerouslySetInnerHTML={{ __html: label }}
                  className={`text-md font-medium pl-1 pb-1 text-Cian8`} // TEXTO TITULO
                  htmlFor={data.id}
                ></label>
              ) : (
                ''
              )}
            </div>

            <div
              className={`relative ${data.readOnly ? 'bg-Greys' : 'bg-white'} ${
                showSelect
                  ? 'border-t border-l border-r border-b-0 border-Cian7/50'
                  : 'border border-Cian7/50'
              } w-full cursor-pointer flex flex-row justify-start items-center ${
                data.tiny ? 'h-8' : 'h-11'
              }`}
            >
              <div
                className={`w-full h-full flex flex-row z-40 justify-start items-center overflow-hidden text-left`}
                onClick={handlerToogleSelect}
              >
                {/* TEXTO DENTRO DEL COMBOBOX */}
                <div className='w-full h-full flex flex-row justify-start sticky top-0 items-center mr-8 overflow-hidden text-cyan-900 text-left px-2 whitespace-nowrap text-ellipsis text-md'>
                  {value}
                </div>
              </div>
              <div className='absolute right-2'>
                {!data.readOnly ? (
                  showSelect ? (
                    <HiChevronUp size={20} />
                  ) : (
                    <HiChevronDown size={20} />
                  )
                ) : null}
              </div>

              {!data.readOnly ? (
                showSelect ? (
                  <div
                    onMouseDown={(e) => e.stopPropagation()}
                    className={`${
                      showSelect
                        ? 'border border-Cian7/50'
                        : 'border border-Cian7/50'
                    }  w-full mx-0 absolute ${
                      data.tiny ? 'top-[32px]' : 'top-[42px]'
                    } left-0 max-h-48 overflow-y-auto bg-Cian2 z-[99999]`}
                  >
                    <div className='w-full h-8'>
                      <input
                        type='text'
                        className='w-full h-full px-3 border-b'
                        onKeyUp={handleSearch}
                        ref={searchRef}
                        placeholder='Ingrese dato a buscar'
                      />
                    </div>
                    {key && !data.noDeleteOption && !data.readOnly ? (
                      <div
                        className='p-2 bg-white even:bg-gray-100 hover:bg-Greys/50 w-full text-left min-h-8 border-WhiteBone text-Cian8'
                        onClick={handleBorrarSeleccion}
                      >
                        Seleccione
                      </div>
                    ) : null}
                    {data.disabled
                      ? ''
                      : filteredData.length > 0
                        ? filteredData.map((item, index) => (
                            <div
                              onClick={() => HandleSelectedItem(item)}
                              key={index}
                              className='p-2 bg-white even:bg-gray-100 hover:bg-Greys/50 w-full text-left min-h-8 border-WhiteBone text-Cian8'
                            >
                              {item.value}
                            </div>
                          ))
                        : ''}
                  </div>
                ) : (
                  ''
                )
              ) : null}
            </div>
          </div>
        </InputContainer>
      )
  }
}

export default Select
