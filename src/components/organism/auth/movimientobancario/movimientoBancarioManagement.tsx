'use client'

import NewPath from '@/components/atom/auth/basic/newPath'
import PageTitle from '@/components/atom/auth/structures/pageTitlte'
import { TableBody } from '@/components/atom/auth/structures/tableBody'
import TableColHeader from '@/components/atom/auth/structures/tableCol'
import TableColBody from '@/components/atom/auth/structures/tableColBody'
import TableHeader from '@/components/atom/auth/structures/tableHeader'
import TableRow from '@/components/atom/auth/structures/tableRow'
import Actions from '@/components/atom/structures/actions/actions'
import PageContainer from '@/components/atom/structures/containers/pageContainer'
import PageContent from '@/components/atom/structures/containers/pageContent'
import { Pagination } from '@/components/atom/structures/pagination'
import { Table } from '@/components/atom/structures/table'
import { ToastNotification } from '@/components/atom/structures/toast'
import TableRowHeader from '@/components/molecule/auth/structures/tableRowHeader'
import FiltrosMovimientosBancarios from '@/components/molecule/filters/filtrosMovimientoBancario'
import { useAuth } from '@/context/authContext'
import { MovimientoBancarioInterface } from '@/interfaces/querys/queryInterface'
import { ApiFecthAuth } from '@/services/auth/axios/apiFetchAuth'
import endPoints from '@/services/auth/endPoints/endPoint'
import { paginationSize, prefix } from '@/services/envs/envs'
import ExceptionTable from '@/utils/exceptionTable'
import { useEffect, useState } from 'react'
import { GiBank } from 'react-icons/gi'

type PagedResult<T> = { count: number; results: T[] }

const MovimientoBancarioManagement: React.FC = () => {
  const { token, enterprise, ready } = useAuth()

  const [page, setPage] = useState<string>('1')
  const [totalPages, setTotalPages] = useState<number>(1)
  const [data, setData] =
    useState<PagedResult<MovimientoBancarioInterface> | null>(null)
  const [usefullData, setUsefullData] = useState<
    MovimientoBancarioInterface[] | null
  >(null)
  const [loaded, setLoaded] = useState<boolean>(false)

  const [selectedMonth, setSelectedMonth] = useState<number>(
    new Date().getMonth() + 1
  )
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear()
  )
  const [selectedMoneda, setSelectedMoneda] = useState<string>('PEN')

  const handleChangePage = (pageNr: number) => setPage(pageNr.toString())

  useEffect(() => {
    const fetchData = async () => {
      if (!ready || !token || !enterprise) return
      try {
        const resp = await getData(page, token)
        const total = (resp.props?.movimientos?.count ?? 0) / paginationSize
        const mod = (resp.props?.movimientos?.count ?? 0) % paginationSize
        setTotalPages(mod > 0 ? Math.trunc(total) + 1 : total)
        setData(resp.props.movimientos ?? null)
      } catch (e) {
        ToastNotification('danger', `Ha ocurrido un error - ${e}`)
      } finally {
        setLoaded(true)
      }
    }
    fetchData()
  }, [enterprise, page, ready, token])

  useEffect(() => {
    if (data) setUsefullData(data.results || [])
  }, [data])

  const newData = (
    <NewPath
      tooltip='Nuevo movimiento'
      icon={<GiBank className='text-Cian8' />}
      link={`${prefix}/movimientos/nuevo/`}
      className='text-Orangevivido'
    />
  )

  const startIndex = (Number(page || '1') - 1) * paginationSize
  const fmtMoney = (amount: number, currency: string) =>
    Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: currency || 'PEN'
    }).format(amount ?? 0)

  return (
    <PageContainer>
      <PageTitle
        description='Gestión de movimientos bancarios'
        aditionalIcon={newData ? newData : undefined}
      />
      <PageContent>
        {/* === FILTROS === */}
        <div className='flex justify-end mb-3'>
          <FiltrosMovimientosBancarios
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
            selectedMoneda={selectedMoneda}
            onChangeMonthYear={(m, y) => {
              setSelectedMonth(m)
              setSelectedYear(y)
            }}
            onChangeMoneda={(val) => setSelectedMoneda(val)}
          />
        </div>

        <Table>
          <TableHeader>
            <TableRowHeader>
              {/* # */}
              <TableColHeader className='w-1/12 text-center'>#</TableColHeader>

              {/* Concepto */}
              <TableColHeader className='w-4/12 sm:w-3/12 md:w-2/12'>
                Concepto
              </TableColHeader>

              {/* Banco */}
              <TableColHeader className='hidden sm:table-cell sm:w-3/12 md:w-2/12'>
                Banco
              </TableColHeader>

              {/* Nro. Operación */}
              <TableColHeader className='hidden lg:table-cell lg:w-1/12'>
                Nro. Operación
              </TableColHeader>

              {/* Fecha Operación */}
              <TableColHeader className='hidden lg:table-cell lg:w-1/12'>
                Fecha Operación
              </TableColHeader>

              {/* Fecha Proceso */}
              <TableColHeader className='hidden lg:table-cell lg:w-1/12'>
                Fecha Proceso
              </TableColHeader>

              {/* Moneda */}
              <TableColHeader className='hidden md:table-cell md:w-1/12 text-center'>
                Moneda
              </TableColHeader>

              {/* Ingreso */}
              <TableColHeader className='hidden md:table-cell md:w-1/12 text-right'>
                Ingreso
              </TableColHeader>

              {/* Egreso */}
              <TableColHeader className='hidden md:table-cell md:w-1/12 text-right'>
                Egreso
              </TableColHeader>

              {/* Monto */}
              <TableColHeader className='w-4/12 sm:w-2/12 md:w-1/12 text-right'>
                Monto
              </TableColHeader>

              {/* Observaciones */}
              <TableColHeader className='hidden lg:table-cell lg:w-1/12'>
                Observaciones
              </TableColHeader>

              {/* Acciones */}
              <TableColHeader className='w-2/12 sm:w-1/12 text-center'>
                Acciones
              </TableColHeader>
            </TableRowHeader>
          </TableHeader>

          <TableBody>
            {!loaded ? (
              <TableRow>
                <td
                  colSpan={12}
                  className='px-4 py-10 text-center text-Charcoal/60'
                >
                  Cargando...
                </td>
              </TableRow>
            ) : usefullData && usefullData.length > 0 ? (
              usefullData.map((item, idx) => (
                <TableRow key={item.uuid ?? idx} className='hover:bg-gray-50'>
                  {/* Número de fila */}
                  <TableColBody className='text-center'>
                    {startIndex + idx + 1}
                  </TableColBody>

                  {/* Concepto */}
                  <TableColBody className='truncate'>
                    {item.concept ?? '-'}
                  </TableColBody>

                  {/* Banco */}
                  <TableColBody className='truncate'>
                    {item.bank ?? '-'}
                  </TableColBody>

                  {/* Nro. Operación */}
                  <TableColBody className='text-center'>
                    {item.operationNumber ?? '-'}
                  </TableColBody>

                  {/* Fecha operación */}
                  <TableColBody className='text-center'>
                    {item.operationDate
                      ? new Date(item.operationDate).toLocaleDateString()
                      : '-'}
                  </TableColBody>

                  {/* Fecha proceso */}
                  <TableColBody className='text-center'>
                    {item.processDate
                      ? new Date(item.processDate).toLocaleDateString()
                      : '-'}
                  </TableColBody>

                  {/* Moneda */}
                  <TableColBody className='text-center'>
                    {item.currency ?? '-'}
                  </TableColBody>

                  {/* Ingreso */}
                  <TableColBody className='text-right font-medium text-green-600'>
                    {item.income ? fmtMoney(item.income, item.currency) : '-'}
                  </TableColBody>

                  {/* Egreso */}
                  <TableColBody className='text-right font-medium text-red-600'>
                    {item.egress ? fmtMoney(item.egress, item.currency) : '-'}
                  </TableColBody>

                  {/* Monto total */}
                  <TableColBody className='text-right font-semibold'>
                    {fmtMoney(item.amount ?? 0, item.currency)}
                  </TableColBody>

                  {/* Observaciones */}
                  <TableColBody className='truncate text-gray-700'>
                    {item.observation ?? '-'}
                  </TableColBody>

                  {/* Acciones */}
                  <TableColBody className='text-center'>
                    <Actions
                      editLink={`${prefix}/movimientos/${item.uuid}/editar`}
                      deleteLink={`${prefix}/movimientos/${item.uuid}/eliminar`}
                    />
                  </TableColBody>
                </TableRow>
              ))
            ) : (
              <ExceptionTable colspan={12} />
            )}
          </TableBody>
        </Table>

        {/* Paginación?? CONFIRMAR */}
        <Pagination
          handleChangePage={handleChangePage}
          totalPages={totalPages}
          actualPage={page}
        />
      </PageContent>
    </PageContainer>
  )
}

export default MovimientoBancarioManagement

async function getData(page: string, token: string | null) {
  if (token) {
    const response = await ApiFecthAuth(
      endPoints.bankMovements.list(page, ''),
      token
    )
    return {
      props: {
        movimientos: response.data as PagedResult<MovimientoBancarioInterface>
      },
      revalidate: 3600
    }
  }
  return { props: { movimientos: null }, revalidate: 3600 }
}
