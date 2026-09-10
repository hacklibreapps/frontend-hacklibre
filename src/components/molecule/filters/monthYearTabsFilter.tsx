'use client'

import { useEffect, useRef, useState } from 'react'
import Select from '@/components/atom/structures/select'
import { ApiFecthAuth } from '@/services/auth/axios/apiFetchAuth'
import endPoints from '@/services/auth/endPoints/endPoint'
import { useAuth } from '@/context/authContext'
import { ToastNotification } from '@/components/atom/structures/toast'
import { KeyValueInterface } from '@/interfaces/structures/keyValueInterface'
import { months } from '@/services/data/months'

interface MonthYearTabsFilterProps {
  selectedMonth?: number
  selectedYear?: number
  onChange?: (month: number, year: number) => void
  yearRange?: { start: number; end: number }
}
interface YearsInterface {
  years: [number]
}

const MonthYearTabsFilter = ({
  selectedMonth,
  selectedYear,
  onChange
}: MonthYearTabsFilterProps) => {
  const { token, enterprise, ready } = useAuth()
  const [month, setMonth] = useState<number | undefined>(selectedMonth)
  const [year, setYear] = useState<number | undefined>(selectedYear)
  const [availableYears, setAvailableYears] = useState<YearsInterface | null>(
    null
  )
  const [dataEditYear, setDataEditYear] = useState<KeyValueInterface>()
  const [dataEditMonth, setDataEditMonth] = useState<KeyValueInterface>()
  const monthRef = useRef<HTMLInputElement>(null)
  const yearRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if ((availableYears && availableYears.years, year)) {
      if (yearRef.current) {
        yearRef.current.value = year.toString()
      }
    }
  }, [availableYears, year])

  useEffect(() => {
    const fetchData = async () => {
      if (!ready || !token || !enterprise) return // ⬅️ evita disparar sin header
      try {
        const data = await getData(token)

        if (data) {
          if (data.props) {
            if (data.props.years) {
              setAvailableYears(data.props.years)
            }
          }
        }
      } catch (error) {
        ToastNotification('danger', `Ha ocurrido un error - ${error}`)
      }
    }
    fetchData()
  }, [token, enterprise, selectedYear, ready])

  // === Sincroniza valores cuando cambian las props ===
  useEffect(() => {
    if (selectedMonth !== undefined) setMonth(selectedMonth)
    if (selectedYear) {
      setDataEditYear({
        key: selectedYear,
        value: selectedYear.toString()
      })
    }
    if (selectedMonth) {
      const month = months.find((m) => m.key === selectedMonth)
      setDataEditMonth(month)
    }
  }, [selectedMonth, selectedYear])

  const handleChangeMonth = (val: string) => {
    const newMonth = parseInt(val)
    setMonth(newMonth)
    if (onChange && year !== undefined) {
      onChange(newMonth, year)
    }
  }

  const handleChangeYear = (val: string) => {
    const newYear = parseInt(val)
    setYear(newYear)
    if (onChange && month !== undefined) {
      onChange(month, newYear)
    }
  }

  return (
    <div className='flex flex-row flex-wrap justify-end items-center gap-2 sm:gap-1 w-full sm:w-auto'>
      <label className='text-sm text-Charcoal font-semibold mb-1 sm:mb-0 whitespace-nowrap'>
        Fecha:
      </label>

      {/* === Combo Mes === */}
      <div className='w-36'>
        <Select
          data={{
            id: 'monthSelect',
            name: 'monthSelect',
            label: '',
            tiny: true,
            value: 9,
            editData: dataEditMonth,
            ref: monthRef,
            showLabel: false,
            data: months,
            noDeleteOption: true,
            onChange: handleChangeMonth
          }}
        />
      </div>

      {/* === Combo Año === */}
      <div className='w-24'>
        <Select
          data={{
            id: 'yearSelect',
            name: 'yearSelect',
            label: '',
            tiny: true,
            value: year,
            ref: yearRef,
            showLabel: false,
            noDeleteOption: true,
            editData: dataEditYear,
            data: availableYears
              ? availableYears.years.map((y) => ({
                  key: y.toString(),
                  value: y.toString()
                }))
              : [],
            onChange: handleChangeYear
          }}
        />
      </div>
    </div>
  )
}

export default MonthYearTabsFilter

async function getData(token: string | null): Promise<{
  props: {
    years: YearsInterface | null
  }
}> {
  if (!token) {
    return { props: { years: null } }
  }

  const years = await ApiFecthAuth(endPoints.quotations.years, token)
  return {
    props: {
      years: years.data
    }
  }
}
