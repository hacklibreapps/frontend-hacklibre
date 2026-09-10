import { useEffect, useState } from 'react'

const useQueryParams = () => {
  const [queryParams, setQueryParams] = useState<URLSearchParams | null>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setQueryParams(new URLSearchParams(window.location.search))
    }
  }, [])

  return queryParams
}

export default useQueryParams
