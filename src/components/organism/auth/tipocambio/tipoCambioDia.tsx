'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/context/authContext'
import { ApiFecthAuth } from '@/services/auth/axios/apiFetchAuth'
import endPoints from '@/services/auth/endPoints/endPoint'
import { formatMoney } from '@/utils/formatMoney'
import { ToastNotification } from '@/components/atom/structures/toast'
import { TipoCambioDiaInterface } from '@/interfaces/querys/queryInterface'

export default function TipoCambioDia() {
  const { token } = useAuth()
  const [data, setData] = useState<TipoCambioDiaInterface | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // llamamos al endpoint que trae el último tipo de cambio
        const response = await ApiFecthAuth(
          endPoints.mainData.exchange.latest,
          token || ''
        )
        setData(response.data)
      } catch (error) {
        ToastNotification('danger', `Error cargando tipo de cambio - ${error}`)
      }
    }
    if (token) fetchData()
  }, [token])

  if (!data) return null

  return (
    <div className='flex flex-col items-center sm:items-start text-sm text-Cian8'>
      <span>
        <strong>Compra:</strong> {formatMoney(data.compra, '$')} |{' '}
        <strong>Venta:</strong> {formatMoney(data.venta, '$')}
      </span>

      {/* Fuente y fecha en letra pequeña */}
      <span className='text-xs text-Charcoal/60 mt-0'>
        Fuente: {data.fuente} - Fecha: {data.capturadoEn}
      </span>
    </div>
  )
}
