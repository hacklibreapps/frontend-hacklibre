'use client'
import { Loading } from '@/components/atom/auth/loading'
import { useEffect, useState } from 'react'
import { hasProperty } from './typesGuard'
import { ErrorPages } from '@/components/atom/errorPages'

interface ValidateServerResponseProps<T> {
  model: T | null // Modelo de datos que puede ser null
  children: React.ReactNode // Contenido a renderizar si los datos son válidos
  exceptionNr: number // Mensaje de excepción a mostrar si no se encuentra el modelo
  loadingMessage: string // Mensaje a mostrar mientras se carga
  searchField: string
}

const ValidateServerResponse = <T extends object | null>({
  model,
  children,
  exceptionNr,
  loadingMessage,
  searchField
}: ValidateServerResponseProps<T>) => {
  const [loading, setLoading] = useState(true) // Estado de carga
  const [notFound, setNotFound] = useState(false) // Estado para "no encontrado"

  useEffect(() => {
    if (model === null) {
      setLoading(false)
      setNotFound(true)
    } else if (hasProperty(model, searchField)) {
      setLoading(false)
      setNotFound(false)
    } else {
      setLoading(false)
      setNotFound(true)
    }
  }, [model, searchField])

  if (loading) {
    return <Loading value={loadingMessage} />
  }

  if (notFound) {
    return <ErrorPages isAuth error={Number(exceptionNr)} />
  }
  return <div>{children}</div>
}

export { ValidateServerResponse }
