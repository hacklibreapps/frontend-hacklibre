'use client'

import { useEffect, useRef, useState } from 'react'
import { MdFilterList } from 'react-icons/md'
import Select from '@/components/atom/structures/select'
import { months } from '@/services/data/months'

interface FiltrosFacturacionMenuProps {
  tipoComprobante: string
  setTipoComprobante: (val: string) => void
  selectedMonth: number
  selectedYear: number
  onChangeMonthYear: (month: number, year: number) => void
  actualYear: number
  empresa: string
  setEmpresa: (val: string) => void
}

const FiltrosFacturacionMenu: React.FC<FiltrosFacturacionMenuProps> = ({
  tipoComprobante,
  setTipoComprobante,
  selectedMonth,
  selectedYear,
  onChangeMonthYear,
  empresa,
  setEmpresa
}) => {
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const tipoRef = useRef<HTMLInputElement>(null)
  const empresaRef = useRef<HTMLInputElement>(null)
  const monthRef = useRef<HTMLInputElement>(null)
  const yearRef = useRef<HTMLInputElement>(null)

  // === Estados temporales ===
  const [resetTipo, setResetTipo] = useState(false)
  const [resetEmpresa, setResetEmpresa] = useState(false)
  const [resetMonth, setResetMonth] = useState(false)
  const [resetYear, setResetYear] = useState(false)

  const [tempTipoComprobante, setTempTipoComprobante] =
    useState(tipoComprobante)
  const [tempEmpresa, setTempEmpresa] = useState(empresa)
  const [tempMonth, setTempMonth] = useState(selectedMonth)
  const [tempYear, setTempYear] = useState(selectedYear)

  // === Fecha actual ===
  const currentDate = new Date()
  const currentMonth = currentDate.getMonth() + 1
  const currentYear = currentDate.getFullYear()

  // === Lista de meses ===
  const monthsFiltered =
    tempYear === currentYear
      ? months.filter((m) => parseInt(m.key.toString()) <= currentMonth)
      : months

  // === Lista de años válidos ===
  const years = Array.from({ length: 6 }, (_, i) => {
    const y = currentYear - i
    return { key: y.toString(), value: y.toString() }
  })

  // === Cierra el menú al hacer clic fuera ===
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node))
        setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleApplyFilters = (e: React.FormEvent) => {
    e.preventDefault()

    const newTipo = tipoRef.current?.value || ''
    const newEmpresa = empresaRef.current?.value || ''
    const newMonth = monthRef.current?.value
      ? parseInt(monthRef.current.value)
      : selectedMonth
    const newYear = yearRef.current?.value
      ? parseInt(yearRef.current.value)
      : selectedYear

    setTipoComprobante(newTipo)
    setEmpresa(newEmpresa)
    onChangeMonthYear(newMonth, newYear)

    setOpen(false)
  }

  // === Reset filtros ===
  const handleResetFilters = () => {
    const now = new Date()
    const currMonth = now.getMonth() + 1
    const currYear = now.getFullYear()

    setTipoComprobante('')
    setEmpresa('')
    setTempTipoComprobante('')
    setTempEmpresa('')
    setTempMonth(currMonth)
    setTempYear(currYear)
    onChangeMonthYear(currMonth, currYear)

    if (tipoRef.current) tipoRef.current.value = ''
    if (empresaRef.current) empresaRef.current.value = ''

    setResetTipo(true)
    setResetEmpresa(true)
    setResetMonth(true)
    setResetYear(true)

    setTimeout(() => {
      setResetTipo(false)
      setResetEmpresa(false)
      setResetMonth(false)
      setResetYear(false)
    }, 200)
  }

  useEffect(() => {
    if (tipoRef.current) tipoRef.current.value = tipoComprobante || ''
    if (empresaRef.current) empresaRef.current.value = empresa || ''

    if (monthRef.current) monthRef.current.value = selectedMonth.toString()
    if (yearRef.current) yearRef.current.value = selectedYear.toString()

    setTempTipoComprobante(tipoComprobante)
    setTempEmpresa(empresa)
    setTempMonth(selectedMonth)
    setTempYear(selectedYear)
  }, [tipoComprobante, empresa, selectedMonth, selectedYear])

  return (
    <div className='relative inline-block text-left' ref={menuRef}>
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
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Tipo de comprobante
            </label>
            <Select
              data={{
                id: 'tipoComprobante',
                name: 'tipoComprobante',
                label: '',
                ref: tipoRef,
                tiny: true,
                // value: '',
                showLabel: false,
                data: [
                  { key: 'todos', value: 'Seleccione' },
                  { key: 'factura_venta', value: 'Factura de venta' },
                  { key: 'factura_compra', value: 'Factura de compra' },
                  { key: 'boleta_compra', value: 'Boleta de compra' },
                  { key: 'recibo_honorarios', value: 'Recibo por honorarios' }
                ],
                editData:
                  tempTipoComprobante !== undefined &&
                  tempTipoComprobante !== ''
                    ? {
                        key: tempTipoComprobante,
                        value:
                          [
                            { key: '', value: 'Seleccione' },
                            { key: 'factura_venta', value: 'Factura de venta' },
                            {
                              key: 'factura_compra',
                              value: 'Factura de compra'
                            },
                            { key: 'boleta_compra', value: 'Boleta de compra' },
                            {
                              key: 'recibo_honorarios',
                              value: 'Recibo por honorarios'
                            }
                          ].find((o) => o.key === tempTipoComprobante)?.value ||
                          'Seleccione'
                      }
                    : undefined,
                resetSignal: resetTipo,
                resetHandler: () => setResetTipo(false),
                onChange: (val: string) => setTempTipoComprobante(val),
                noDeleteOption: true
              }}
            />
          </div>

          {/* === Empresa / Cliente === */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Empresa / Cliente
            </label>
            <Select
              data={{
                id: 'empresa',
                name: 'empresa',
                label: '',
                ref: empresaRef,
                tiny: true,
                value: tempEmpresa,
                showLabel: false,
                data: [
                  { key: 'todos', value: 'Seleccione' },
                  { key: 'Hacklibre', value: 'Hacklibre' },
                  { key: 'Caparazon', value: 'Caparazón' },
                  { key: 'Otros', value: 'Otros' }
                ],
                editData:
                  tempEmpresa !== undefined && tempEmpresa !== ''
                    ? {
                        key: tempEmpresa,
                        value:
                          [
                            { key: '', value: 'Seleccione' },
                            { key: 'Hacklibre', value: 'Hacklibre' },
                            { key: 'Caparazon', value: 'Caparazón' },
                            { key: 'Otros', value: 'Otros' }
                          ].find((o) => o.key === tempEmpresa)?.value ||
                          'Seleccione'
                      }
                    : undefined,
                resetSignal: resetEmpresa,
                resetHandler: () => setResetEmpresa(false),
                onChange: (val: string) => setTempEmpresa(val),
                noDeleteOption: true
              }}
            />
          </div>

          {/* === Fecha (Mes y Año) === */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Fecha
            </label>
            <div className='flex gap-2'>
              {/* === Mes === */}
              <div className='w-1/2'>
                <label className='text-xs text-gray-600 ml-1'>Mes</label>
                <Select
                  data={{
                    id: 'monthSelect',
                    name: 'monthSelect',
                    label: '',
                    ref: monthRef,
                    tiny: true,
                    value: tempMonth ? tempMonth.toString() : '',
                    showLabel: false,
                    data: monthsFiltered,
                    editData: {
                      key: tempMonth.toString(),
                      value:
                        monthsFiltered.find(
                          (m) => m.key.toString() === tempMonth.toString()
                        )?.value || ''
                    },
                    resetSignal: resetMonth,
                    resetHandler: () => setResetMonth(false),
                    onChange: (val: string) => {
                      const newMonth = parseInt(val)
                      if (!isNaN(newMonth)) setTempMonth(newMonth)
                    },
                    noDeleteOption: true
                  }}
                />
              </div>

              {/* === Año === */}
              <div className='w-1/2'>
                <label className='text-xs text-gray-600 ml-1'>Año</label>
                <Select
                  data={{
                    id: 'yearSelect',
                    name: 'yearSelect',
                    label: '',
                    ref: yearRef,
                    tiny: true,
                    value: tempYear ? tempYear.toString() : '',
                    showLabel: false,
                    data: years.filter((y) => parseInt(y.key) <= currentYear),
                    editData: {
                      key: tempYear.toString(),
                      value:
                        years.find(
                          (y) => y.key.toString() === tempYear.toString()
                        )?.value || ''
                    },
                    resetSignal: resetYear,
                    resetHandler: () => setResetYear(false),
                    onChange: (val: string) => {
                      const newYear = parseInt(val)
                      if (!isNaN(newYear)) setTempYear(newYear)
                    },
                    noDeleteOption: true
                  }}
                />
              </div>
            </div>
          </div>

          {/* === Botones === */}
          <div className='flex gap-2'>
            <button
              type='button'
              onClick={handleApplyFilters}
              className='w-1/2 bg-cyan-900 text-white py-2 rounded-md hover:bg-cyan-800 transition text-sm font-semibold'
            >
              Aplicar filtros
            </button>

            <button
              type='button'
              onClick={handleResetFilters}
              className='w-1/2 bg-gray-200 text-gray-700 py-2 rounded-md hover:bg-gray-300 transition text-sm font-semibold'
            >
              Reset
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default FiltrosFacturacionMenu
