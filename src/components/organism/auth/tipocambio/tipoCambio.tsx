'use client'

import PageTitle from '@/components/atom/auth/structures/pageTitlte'
import { TableBody } from '@/components/atom/auth/structures/tableBody'
import TableColHeader from '@/components/atom/auth/structures/tableCol'
import TableColBody from '@/components/atom/auth/structures/tableColBody'
import { TableCounter } from '@/components/atom/auth/structures/tableCounter'
import TableHeader from '@/components/atom/auth/structures/tableHeader'
import TableRow from '@/components/atom/auth/structures/tableRow'
import PageContainer from '@/components/atom/structures/containers/pageContainer'
import PageContent from '@/components/atom/structures/containers/pageContent'
import { Table } from '@/components/atom/structures/table'
import { ToastNotification } from '@/components/atom/structures/toast'
import TableRowHeader from '@/components/molecule/auth/structures/tableRowHeader'
import { useAuth } from '@/context/authContext'
import {
  TipoCambioInterface,
  MoneyInterface
} from '@/interfaces/querys/queryInterface'
import { ApiFecthAuth } from '@/services/auth/axios/apiFetchAuth'
import endPoints from '@/services/auth/endPoints/endPoint'
import { useEffect, useState } from 'react'
import { formatMoney } from '@/utils/formatMoney'

const TipoCambioManagement: React.FC = () => {
  const { token } = useAuth()
  const [data, setData] = useState<TipoCambioInterface[] | null>(null)
  const [loaded, setLoaded] = useState<boolean>(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Paso 1: obtener lista de monedas
        const moneyResponse = await ApiFecthAuth(
          endPoints.mainData.money.list(),
          token || ''
        )

        // Normalizar resultados (paginados o no)
        const moneyList: MoneyInterface[] = Array.isArray(moneyResponse.data)
          ? moneyResponse.data
          : moneyResponse.data.results ?? []

        // Buscar USD
        const dollar = moneyList.find(
          (m) => m.currency?.toUpperCase() === 'USD'
        )

        if (!dollar || !dollar.uuid) {
          ToastNotification(
            'danger',
            'No se encontró moneda USD para mostrar el historial.'
          )
          return
        }

        // Paso 2: cargar historial de tipo de cambio (devuelve objeto único)
        const response = await ApiFecthAuth(
          endPoints.mainData.exchange.byMoney(dollar.uuid),
          token || ''
        )

        // Convertimos el objeto único en array
        setData([response.data])
        setLoaded(true)
      } catch (error) {
        ToastNotification('danger', `Ha ocurrido un error - ${error}`)
      }
    }

    if (token) fetchData()
  }, [token])

  return (
    <PageContainer>
      <PageTitle description='Historial de Tipo de Cambio' />

      <PageContent>
        <Table>
          <TableHeader>
            <TableRowHeader>
              <TableColHeader className='w-1/12 text-center'>
                Nro
              </TableColHeader>
              <TableColHeader className='w-2/12 text-center'>
                Fecha
              </TableColHeader>
              <TableColHeader className='w-2/12 text-center'>
                Compra
              </TableColHeader>
              <TableColHeader className='w-2/12 text-center'>
                Venta
              </TableColHeader>
              <TableColHeader className='w-2/12 text-center'>
                Fuente
              </TableColHeader>
              <TableColHeader className='w-3/12 text-center'>
                Nota
              </TableColHeader>
            </TableRowHeader>
          </TableHeader>

          <TableBody>
            {loaded && data ? (
              data.map((item, index) => (
                <TableRow key={item.uuid ?? index}>
                  <TableColBody className='text-center'>
                    <TableCounter nr={index} page='1' />
                  </TableColBody>
                  <TableColBody className='text-center'>
                    {item.fecha}
                  </TableColBody>
                  <TableColBody className='text-center'>
                    {formatMoney(Number(item.compra), '$')}
                  </TableColBody>
                  <TableColBody className='text-center'>
                    {formatMoney(Number(item.venta), '$')}
                  </TableColBody>
                  <TableColBody className='text-center'>
                    {item.fuente}
                  </TableColBody>
                  <TableColBody className='text-center'>
                    {item.nota}
                  </TableColBody>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <td
                  colSpan={6}
                  className='px-4 py-10 text-center text-Charcoal/60'
                >
                  Cargando historial de tipo de cambio...
                </td>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </PageContent>
    </PageContainer>
  )
}

export default TipoCambioManagement
