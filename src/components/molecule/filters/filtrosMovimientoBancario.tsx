'use client'

import { useEffect, useRef, useState } from 'react'
import { MdFilterList } from 'react-icons/md'
import Select from '@/components/atom/structures/select'
import { months } from '@/services/data/months'
import { ToastNotification } from '@/components/atom/structures/toast'

interface FiltrosMovimientosBancariosProps {
  selectedMonth: number
  selectedYear: number
  selectedMoneda: string
  onChangeMonthYear: (month: number, year: number) => void
  onChangeMoneda: (val: string) => void
}

const FiltrosMovimientosBancarios: React.FC<
  FiltrosMovimientosBancariosProps
> = ({
  selectedMonth,
  selectedYear,
  selectedMoneda,
  onChangeMonthYear,
  onChangeMoneda
}) => {
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // === Refs de selects ===
  const monthRef = useRef<HTMLInputElement>(null)
  const yearRef = useRef<HTMLInputElement>(null)
  const monedaRef = useRef<HTMLInputElement>(null)

  // === Estados temporales ===
  const [tempMonth, setTempMonth] = useState(selectedMonth)
  const [tempYear, setTempYear] = useState(selectedYear)
  const [tempMoneda, setTempMoneda] = useState(selectedMoneda)

  const [resetMonth, setResetMonth] = useState(false)
  const [resetYear, setResetYear] = useState(false)
  const [resetMoneda, setResetMoneda] = useState(false)

  // === Fecha actual ===
  const currentDate = new Date()
  const currentMonth = currentDate.getMonth() + 1
  const currentYear = currentDate.getFullYear()

  // === Fecha actual ===
  const monthsFiltered =
    selectedYear === currentYear
      ? months.filter((m) => parseInt(m.key.toString()) <= currentMonth)
      : months

  const years = Array.from({ length: 6 }, (_, i) => {
    const y = currentYear - i
    return { key: y.toString(), value: y.toString() }
  })

  // === Control de clic fuera ===
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node))
        setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const monedaOptions = [
    { key: 'PEN', value: 'Soles (PEN)' },
    { key: 'USD', value: 'Dólares (USD)' }
  ]

  // === Aplicar filtros ===
  const handleApplyFilters = (e: React.FormEvent) => {
    e.preventDefault()

    const newMonth = monthRef.current?.value
      ? parseInt(monthRef.current.value)
      : selectedMonth
    const newYear = yearRef.current?.value
      ? parseInt(yearRef.current.value)
      : selectedYear
    const newMoneda = monedaRef.current?.value || selectedMoneda

    onChangeMonthYear(newMonth, newYear)
    onChangeMoneda(newMoneda)

    setOpen(false)
  }

  // === Reset filtros ===
  const handleResetFilters = () => {
    const now = new Date()
    const currMonth = now.getMonth() + 1
    const currYear = now.getFullYear()

    setTempMonth(currMonth)
    setTempYear(currYear)
    setTempMoneda('PEN')

    if (monthRef.current) monthRef.current.value = currMonth.toString()
    if (yearRef.current) yearRef.current.value = currYear.toString()
    if (monedaRef.current) monedaRef.current.value = 'PEN'

    onChangeMonthYear(currMonth, currYear)
    onChangeMoneda('PEN')

    setResetMonth(true)
    setResetYear(true)
    setResetMoneda(true)

    setTimeout(() => {
      setResetMonth(false)
      setResetYear(false)
      setResetMoneda(false)
    }, 200)

    ToastNotification('info', 'Filtros restablecidos')
  }

  // === Sincronizar props externas ===
  useEffect(() => {
    if (monthRef.current) {
      monthRef.current.value = selectedMonth.toString()
    }
    if (yearRef.current) {
      yearRef.current.value = selectedYear.toString()
    }
    if (monedaRef.current) {
      monedaRef.current.value = selectedMoneda.toString()
    }

    setTempMonth(selectedMonth)
    setTempYear(selectedYear)
    setTempMoneda(selectedMoneda)
  }, [selectedMonth, selectedYear, selectedMoneda])

  return (
    <div className='relative inline-block text-left' ref={menuRef}>
      {/* === Botón principal === */}
      <button
        type='button'
        onClick={() => setOpen(!open)}
        className='flex items-center gap-2 px-4 py-2 bg-cyan-900 text-white rounded-md text-sm font-semibold hover:bg-cyan-800 transition'
      >
        <MdFilterList className='text-lg' />
        Filtros
      </button>

      {/* === Panel de filtros === */}
      {open && (
        <div className='absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-5 space-y-4 animate-fadeIn'>
          <form onSubmit={handleApplyFilters} onReset={handleResetFilters}>
            {/* Moneda */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Moneda
              </label>
              <Select
                data={{
                  id: 'moneda',
                  name: 'moneda',
                  label: '',
                  ref: monedaRef,
                  tiny: true,
                  showLabel: false,
                  data: monedaOptions,
                  editData:
                    tempMoneda && tempMoneda !== ''
                      ? {
                          key: tempMoneda,
                          value:
                            monedaOptions.find((m) => m.key === tempMoneda)
                              ?.value || 'Soles (PEN)'
                        }
                      : undefined,
                  resetSignal: resetMoneda,
                  resetHandler: () => setResetMoneda(false),
                  onChange: (val: string) => setTempMoneda(val),
                  noDeleteOption: true
                }}
              />
            </div>

            {/* Fecha */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Fecha
              </label>
              <div className='flex gap-2'>
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
                    resetSignal: resetMonth,
                    resetHandler: () => setResetMonth(false),
                    onChange: (val: string) => setTempMonth(parseInt(val)),
                    noDeleteOption: true
                  }}
                />
                <Select
                  data={{
                    id: 'yearSelect',
                    name: 'yearSelect',
                    label: '',
                    ref: yearRef,
                    tiny: true,
                    value: tempYear ? tempYear.toString() : '',
                    showLabel: false,
                    data: years,
                    resetSignal: resetYear,
                    resetHandler: () => setResetYear(false),
                    onChange: (val: string) => setTempYear(parseInt(val)),
                    noDeleteOption: true
                  }}
                />
              </div>
            </div>

            {/* Botones */}
            <div className='flex gap-2 mt-4'>
              <button
                type='submit'
                className='w-1/2 bg-cyan-900 text-white py-2 rounded-md hover:bg-cyan-800 transition text-sm font-semibold'
              >
                Aplicar
              </button>

              <button
                type='reset'
                className='w-1/2 bg-gray-200 text-gray-700 py-2 rounded-md hover:bg-gray-300 transition text-sm font-semibold'
              >
                Reset
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}

export default FiltrosMovimientosBancarios
