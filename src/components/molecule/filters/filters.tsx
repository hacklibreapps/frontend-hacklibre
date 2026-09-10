'use client'

import { useEffect, useRef, useState } from 'react'
import { MdFilterList } from 'react-icons/md'
import Select from '@/components/atom/structures/select'
import { InputInterface } from '@/interfaces/structures/inputInterface'
import Input from '@/components/atom/structures/input'

interface FiltrosFacturacionMenuProps {
  config: Record<string, InputInterface>
  align?: string
  aplicarFiltros: () => string
  limpiarFiltros: () => void
  listFiltros: string[]
}
const Filters: React.FC<FiltrosFacturacionMenuProps> = ({
  config,
  align,
  aplicarFiltros,
  limpiarFiltros,
  listFiltros
}) => {
  const [open, setOpen] = useState(false)
  const alignment = align ? align : 'left'
  const menuRef = useRef<HTMLDivElement>(null)

  // === Cierra el menú al hacer clic fuera ===
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node))
        setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleApplyFilters = () => {
    setOpen(false)
    aplicarFiltros()
  }
  const handleResetFilters = () => {
    setOpen(false)
    limpiarFiltros()
  }

  return (
    <div
      className={`flex flex-col lg:flex-row  ${
        alignment === 'left'
          ? 'justify-center align-start lg:justify-start lg:items-center'
          : alignment === 'center'
          ? 'justify-center items-center'
          : alignment === 'right'
          ? 'justify-center items-end lg:justify-end lg:items-center'
          : 'justify-center items-center'
      } mb-3`}
    >
      {listFiltros.length > 0 ? (
        <div
          className={`${
            alignment === 'left' ? 'order-2 pl-2' : 'order-1 pr-2'
          } flex flex-row justify-center items-center uppercase `}
        >
          <small>
            <span className='font-semibold'>Filtrado por: </span>
            {listFiltros.join(', ')}
          </small>
        </div>
      ) : null}

      <div
        className={`${
          alignment === 'left' ? 'order-1' : 'order-2'
        }  relative inline-block text-left`}
        ref={menuRef}
      >
        {/* === Botón Filtros === */}

        <button
          type='button'
          onClick={() => setOpen(!open)}
          className='flex items-center gap-2 px-4 py-2 bg-cyan-900 text-white rounded-md text-sm font-semibold hover:bg-cyan-800 transition'
        >
          <MdFilterList className='text-lg' />
          Filtros
        </button>

        {/* === Menú desplegable === */}
        {open && (
          <div className='absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-5 space-y-4 animate-fadeIn'>
            {/* === Tipo de comprobante === */}
            {Object.entries(config).map(([key, inputData]) => {
              const dataType = inputData.type ? inputData.type : ''
              return (
                <div key={key} className='flex flex-col '>
                  {['radio', 'checkbox', 'switch', 'input'].includes(
                    dataType
                  ) ? (
                    <Input data={inputData} />
                  ) : ['multiSelect', 'select'].includes(dataType) ? (
                    <Select data={inputData} />
                  ) : null}
                </div>
              )
            })}

            {/* === Botón Aplicar === */}
            <button
              type='button'
              onClick={handleApplyFilters}
              className='w-full bg-cyan-900 text-white py-2 rounded-md hover:bg-cyan-800 transition text-sm font-semibold'
            >
              Aplicar filtros
            </button>
            <button
              type='button'
              onClick={handleResetFilters}
              className='w-full bg-Green8 text-white py-2 rounded-md hover:bg-Green7 transition text-sm font-semibold'
            >
              Limpiar filtros
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export { Filters }
