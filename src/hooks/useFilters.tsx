import { useState } from 'react'

export function useFilters() {
  const [filters, setFilters] = useState<Record<string, string | number>>({})
  const [filtered, setFiltered] = useState<string>('')

  const updateFilter = (campo: string, valor: string | number) => {
    setFilters((prev) => {
      if (typeof valor === 'string' && !valor.trim()) {
        const newFilters = { ...prev }
        delete newFilters[campo]
        return newFilters
      }
      return { ...prev, [campo]: valor }
    })
  }

  const buildQueryString = (obj: Record<string, string | number>): string => {
    return Object.entries(obj)

      .filter(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ([_, value]) => value !== '' && value !== null && value !== undefined
      )
      .map(
        ([key, value]) =>
          `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`
      )
      .join('&')
  }

  const applyFilter = () => {
    const query = buildQueryString(filters)
    setFiltered(query)
    return query
  }

  const resetFilter = () => {
    setFilters({})
    setFiltered('')
  }

  const activeKeys = Object.keys(filters)

  return {
    filters,
    setFilters,
    filtered,
    activeKeys,
    updateFilter,
    applyFilter,
    resetFilter
  }
}
