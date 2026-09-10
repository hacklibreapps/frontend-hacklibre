'use client'

import { useEffect, useRef, useState } from 'react'
import { MdFilterList } from 'react-icons/md'
import Select from '@/components/atom/structures/select'
import Input from '@/components/atom/structures/input'
import { months } from '@/services/data/months'
import { ToastNotification } from '@/components/atom/structures/toast'
import { ApiFecthAuth } from '@/services/auth/axios/apiFetchAuth'
import endPoints from '@/services/auth/endPoints/endPoint'
import { useAuth } from '@/context/authContext'
import { KeyValueInterface } from '@/interfaces/structures/keyValueInterface'

interface FiltrosCotizacionMenuProps {
  cotizacion: string
  setCotizacion: (val: string) => void
  cliente: string
  setCliente: (val: string) => void
  estado: string
  setEstado: (val: string) => void
  selectedMonth: number
  selectedYear: number
  onChangeMonthYear: (month: number, year: number) => void
  setFilteredBy: (val: string) => void
}

interface YearsInterface {
  years: number[]
}

const FiltrosCotizacionMenu: React.FC<FiltrosCotizacionMenuProps> = ({
  cotizacion,
  setCotizacion,
  cliente,
  setCliente,
  estado,
  setEstado,
  selectedMonth,
  selectedYear,
  onChangeMonthYear,
  setFilteredBy
}) => {
  const { token, enterprise, ready } = useAuth()
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Refs de los inputs
  const cotizacionRef = useRef<HTMLInputElement>(null)
  const clienteRef = useRef<HTMLInputElement>(null)
  const estadoRef = useRef<HTMLInputElement>(null)
  const monthRef = useRef<HTMLInputElement>(null)
  const yearRef = useRef<HTMLInputElement>(null)

  // === Estados locales ===
  const [month, setMonth] = useState<number | undefined>(selectedMonth)
  const [year, setYear] = useState<number | undefined>(selectedYear)
  const [availableYears, setAvailableYears] = useState<YearsInterface | null>(
    null
  )
  const [availableStatus, setAvailableStatus] = useState<KeyValueInterface[]>(
    []
  )
  const [clientesData, setClientesData] = useState<KeyValueInterface[]>([])

  // === Estados de reset ===
  const [resetEstado, setResetEstado] = useState(false)
  const [resetMonth, setResetMonth] = useState(false)
  const [resetYear, setResetYear] = useState(false)

  // === Estados temporales (Selects/Input) ===
  const [tempEstado, setTempEstado] = useState(estado)
  const [tempMonth, setTempMonth] = useState(selectedMonth)

  // === Fecha actual ===
  const currentDate = new Date()
  const currentMonth = currentDate.getMonth() + 1
  const currentYear = currentDate.getFullYear()

  const monthsFiltered =
    selectedYear === currentYear
      ? months.filter((m) => parseInt(m.key.toString()) <= currentMonth)
      : months

  // === Obtener años desde backend ===
  useEffect(() => {
    if (!token) return

    const fetchYears = async () => {
      try {
        const resp = await ApiFecthAuth(endPoints.quotations.years, token)
        if (resp?.data?.years) {
          setAvailableYears({ years: resp.data.years })
        }
      } catch {
        ToastNotification('danger', 'Error al obtener los años del servidor')
      }
    }

    fetchYears()
  }, [token])

  // === Obtener estados desde backend ===
  useEffect(() => {
    if (!token) return

    const fetchStatus = async () => {
      try {
        const resp = await ApiFecthAuth(endPoints.quotations.status, token)
        if (resp?.data) {
          const data: KeyValueInterface[] = Array.isArray(resp.data)
            ? resp.data.map((s) =>
                typeof s === 'object' && 'key' in s && 'value' in s
                  ? { key: String(s.key), value: String(s.value) }
                  : { key: String(s), value: String(s) }
              )
            : []

          setAvailableStatus(data)
        }
      } catch {
        ToastNotification('danger', 'Error al obtener los estados del servidor')
      }
    }

    fetchStatus()
  }, [token])

  useEffect(() => {
    const fetchData = async () => {
      if (!ready || !token || !enterprise) return
      try {
        const resp = await getData(token)
        if (resp.props.clientes) {
          setClientesData(resp.props.clientes)
        }
      } catch (e) {
        ToastNotification('danger', `Ha ocurrido un error - ${e}`)
      }
    }

    fetchData()
  }, [
    token,
    month,
    year,
    cotizacion,
    cliente,
    estado,
    ready,
    enterprise,
    setCliente
  ])

  // === Actualiza el valor del select año cuando cambia el estado ===
  useEffect(() => {
    if (availableYears?.years && year && yearRef.current) {
      yearRef.current.value = year.toString()
    }
  }, [availableYears, year])

  useEffect(() => {
    if (selectedMonth !== undefined) setMonth(selectedMonth)
    if (selectedYear !== undefined) setYear(selectedYear)
    setTempMonth(selectedMonth)
    setYear(selectedYear)
    setTempEstado(estado || '')

    if (monthRef.current) monthRef.current.value = selectedMonth.toString()
    if (yearRef.current) yearRef.current.value = selectedYear.toString()
    if (estadoRef.current) estadoRef.current.value = estado || ''
    if (cotizacionRef.current) cotizacionRef.current.value = cotizacion || ''
    if (clienteRef.current) clienteRef.current.value = cliente || ''
  }, [cotizacion, cliente, estado, selectedMonth, selectedYear])

  const handleApplyFilters = (e: React.FormEvent) => {
    e.preventDefault()

    const newCotizacion = cotizacionRef.current?.value || ''
    const cotizacionBy = newCotizacion ? `Cotización(${newCotizacion})` : ''
    const newCliente = clienteRef.current?.value || ''
    const clienteBy = newCliente ? `Cliente(${newCliente})` : ''
    const newEstado = estadoRef.current?.value || ''
    const estadoBy = newEstado ? `Estado(${newEstado})` : ''
    const newMonth = monthRef.current?.value
      ? parseInt(monthRef.current.value)
      : selectedMonth
    const monthBy = newMonth ? `Mes(${newMonth})` : ''
    const newYear = yearRef.current?.value
      ? parseInt(yearRef.current.value)
      : selectedYear

    const yearBy = newYear ? `Año(${newYear})` : ''

    const filtersArray = [cotizacionBy, clienteBy, estadoBy, monthBy, yearBy]

    setCotizacion(newCotizacion)
    setCliente(newCliente)
    setEstado(newEstado)
    onChangeMonthYear(newMonth, newYear)
    setFilteredBy(
      filtersArray
        .filter((f) => f.length > 0)
        .map((f) => f)
        .join(' - ')
    )
    setOpen(false)
  }

  // === RESET FILTROS ===
  const handleResetFilters = () => {
    const now = new Date()
    const currentMonth = now.getMonth() + 1
    const currentYear = now.getFullYear()

    setCotizacion('')
    setCliente('')
    setEstado('')
    setTempEstado('')
    setTempMonth(currentMonth)
    onChangeMonthYear(currentMonth, currentYear)

    // Limpieza visual
    if (cotizacionRef.current) cotizacionRef.current.value = ''
    if (clienteRef.current) clienteRef.current.value = ''

    // Resetea selects
    setResetEstado(true)
    setResetMonth(true)
    setResetYear(true)

    // Rehabilita los flags
    setTimeout(() => {
      setResetEstado(false)
      setResetMonth(false)
      setResetYear(false)
    }, 200)
  }

  // === Controladores de cambio ===
  const handleChangeMonth = (val: string) => {
    const newMonth = parseInt(val)
    setMonth(newMonth)
    if (onChangeMonthYear && year !== undefined) {
      onChangeMonthYear(newMonth, year)
    }
  }

  const handleChangeYear = (val: string) => {
    const newYear = parseInt(val)
    setYear(newYear)
    if (onChangeMonthYear && month !== undefined) {
      onChangeMonthYear(month, newYear)
    }
  }

  // === Control de clic fuera ===
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

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
            {/* Cotización */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Nro. Cotización
              </label>
              <Input
                data={{
                  id: 'cotizacion',
                  name: 'cotizacion',
                  label: '',
                  ref: cotizacionRef,
                  tiny: true,

                  showLabel: false,
                  value: cotizacion
                }}
              />
            </div>

            {/* Cliente */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Cliente
              </label>
              <Select
                data={{
                  id: 'cliente',
                  name: 'cliente',
                  label: '',
                  ref: clienteRef,
                  data: clientesData,
                  tiny: true,
                  showLabel: false,
                  value: cliente,
                  onChange: () => {}
                }}
              />
            </div>

            {/* Estado */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Estado
              </label>
              <Select
                data={{
                  id: 'estado',
                  name: 'estado',
                  label: '',
                  ref: estadoRef,
                  tiny: true,
                  showLabel: false,
                  value: estado,
                  data: [{ key: '', value: 'Todos' }, ...availableStatus],
                  editData: tempEstado
                    ? {
                        key: tempEstado,
                        value:
                          availableStatus.find((s) => s.key === tempEstado)
                            ?.value || 'Todos'
                      }
                    : undefined,
                  resetSignal: resetEstado,
                  resetHandler: () => setResetEstado(false), // ✅ permite reutilizar
                  onChange: (val: string) => setTempEstado(val),
                  noDeleteOption: true
                }}
              />
            </div>

            {/* Fecha */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Fecha de emisión
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
                    editData: tempMonth
                      ? {
                          key: tempMonth.toString(),
                          value:
                            monthsFiltered.find(
                              (m) => m.key.toString() === tempMonth.toString()
                            )?.value || ''
                        }
                      : undefined,
                    resetSignal: resetMonth,
                    resetHandler: () => setResetMonth(false),
                    onChange: handleChangeMonth
                  }}
                />
                <Select
                  data={{
                    id: 'yearSelect',
                    name: 'yearSelect',
                    label: '',
                    ref: yearRef,
                    tiny: true,
                    value: year ? year.toString() : '',
                    showLabel: false,
                    data: availableYears
                      ? availableYears.years.map((y) => ({
                          key: y.toString(),
                          value: y.toString()
                        }))
                      : [],
                    resetSignal: resetYear,
                    resetHandler: () => setResetYear(false),
                    onChange: handleChangeYear,
                    noDeleteOption: true
                  }}
                />
              </div>
            </div>

            {/* Botones */}
            <div className='flex gap-2 mt-4'>
              <button
                type='reset'
                className='w-full bg-gray-200 text-gray-700 py-2 rounded-md hover:bg-gray-300 transition text-sm font-semibold'
              >
                Limpiar filtros
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}

export default FiltrosCotizacionMenu

async function getData(token: string) {
  if (token) {
    const clientsNoPaged = await ApiFecthAuth(
      endPoints.clients.NoPagedList,
      token
    )

    return {
      props: {
        clientes: clientsNoPaged.data
      },
      revalidate: 3600
    }
  }

  // Caso sin token
  return { props: { clientes: null }, revalidate: 3600 }
}
