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
import MonthYearTabsFilter from '@/components/molecule/filters/monthYearTabsFilter'
import { useAuth } from '@/context/authContext'
import { FacturaInterface } from '@/interfaces/querys/queryInterface'
import { ApiFecthAuth } from '@/services/auth/axios/apiFetchAuth'
import endPoints from '@/services/auth/endPoints/endPoint'
import { paginationSize, prefix } from '@/services/envs/envs'
import ExceptionTable from '@/utils/exceptionTable'
import { useEffect, useState } from 'react'
import { TbFileInvoice, TbFileText, TbReceipt2 } from 'react-icons/tb'

type PagedResult<T> = { count: number; results: T[] }

const FacturaManagement: React.FC = () => {
  const { token, enterprise, ready } = useAuth()

  const [page, setPage] = useState<string>('1')
  const [totalPages, setTotalPages] = useState<number>(1)
  const [data, setData] = useState<PagedResult<FacturaInterface> | null>(null)
  const [usefullData, setUsefullData] = useState<FacturaInterface[] | null>(
    null
  )
  const [loaded, setLoaded] = useState<boolean>(false)

  // ==== Nuevos estados ====
  const [month, setMonth] = useState<number>(new Date().getMonth() + 1)
  const [year, setYear] = useState<number>(new Date().getFullYear())

  const handleChangePage = (pageNr: number) => setPage(pageNr.toString())

  const handleMonthYearChange = async (m: number, y: number) => {
    setLoaded(false)
    setMonth(m)
    setYear(y)
    // 👉 Conecta el backend aquí más adelante:
    // await fetch(`/api/facturas?mes=${m}&año=${y}`)
    // await fetchData(page, token, m, y)
  }

  useEffect(() => {
    const fetchData = async () => {
      if (!ready || !token || !enterprise) return
      try {
        const resp = await getData(page, token)
        console.log(data)
        const total = (resp.props?.facturas?.count ?? 0) / paginationSize
        const mod = (resp.props?.facturas?.count ?? 0) % paginationSize
        setTotalPages(mod > 0 ? Math.trunc(total) + 1 : total)
        setData(resp.props.facturas ?? null)
      } catch (e) {
        ToastNotification('danger', `Ha ocurrido un error - ${e}`)
      } finally {
        setLoaded(true)
      }
    }
    fetchData()
  }, [data, enterprise, page, ready, token])

  useEffect(() => {
    if (data) setUsefullData(data.results || [])
  }, [data])

  // const newData = (
  //   <NewPath
  //     tooltip='Nueva factura'
  //     icon={<TbFileInvoice className='text-Cian8' />}
  //     link={`${prefix}/facturas/nuevo/`}
  //     className='text-Orangevivido'
  //   />

  // )

  const iconsGroup = (
    <div className='flex gap-2'>
      <NewPath
        tooltip='Nueva factura de venta'
        icon={<TbFileInvoice className='text-Cian8 text-xl' />}
        link={`${prefix}/facturas/nuevo/`}
        className='text-Orangevivido'
      />

      <NewPath
        tooltip='Nueva factura de compra'
        icon={<TbFileInvoice className='text-Cian8 text-xl' />}
        link={`${prefix}/facturascompra/nuevo/`}
        className='text-Orangevivido'
      />

      <NewPath
        tooltip='Nueva boleta de compra'
        icon={<TbReceipt2 className='text-Cian8 text-xl' />}
        link={`${prefix}/boletascompra/nuevo/`}
        className='text-Orangevivido'
      />

      <NewPath
        tooltip='Recibo por honorarios'
        icon={<TbFileText className='text-Cian8 text-xl' />}
        link={`${prefix}/recibohonorario/nuevo/`}
        className='text-Gray5 cursor-not-allowed'
      />
    </div>
  )
  const startIndex = (Number(page || '1') - 1) * paginationSize

  return (
    <PageContainer>
      <PageTitle
        description='Gestión de facturas'
        // aditionalIcon={iconsGroup ? iconsGroup : undefined}
        aditionalIcon={iconsGroup}
      />

      <PageContent>
        {/* ====== Filtro de Mes/Año ====== */}{' '}
        <MonthYearTabsFilter
          selectedMonth={month}
          selectedYear={year}
          onChange={handleMonthYearChange}
        />
        <Table>
          <TableHeader>
            <TableRowHeader>
              {/* NRO — más angosto */}
              <TableColHeader className='hidden sm:table-cell sm:w-1/12'>
                Nro
              </TableColHeader>

              {/* Columnas normales */}
              <TableColHeader className='w-7/12 lg:w-3/12 xl:w-3/12'>
                Factura
              </TableColHeader>
              <TableColHeader className='hidden lg:table-cell lg:w-2/12'>
                Emisión
              </TableColHeader>
              <TableColHeader className='hidden lg:table-cell lg:w-2/12'>
                Cliente
              </TableColHeader>
              <TableColHeader className='hidden xl:table-cell xl:w-1/12'>
                Moneda
              </TableColHeader>

              {/* TOTAL — más angosto */}
              <TableColHeader className='hidden lg:table-cell lg:w-1/12'>
                Total
              </TableColHeader>
              <TableColHeader className=' w-2/12 lg:w-1/12  '>
                Estado
              </TableColHeader>
              <TableColHeader className='w-3/12 sm:w-2/12 xl:w-1/12'>
                Acciones
              </TableColHeader>
            </TableRowHeader>
          </TableHeader>

          <TableBody>
            {!loaded ? (
              <TableRow>
                <td
                  colSpan={8}
                  className='px-4 py-10 text-center text-Cian8 animate-pulse'
                >
                  Cargando facturas...
                </td>
              </TableRow>
            ) : usefullData && usefullData.length > 0 ? (
              usefullData.map((item, idx) => (
                <TableRow key={item.uuid ?? idx}>
                  <TableColBody className='text-center hidden sm:table-cell sm:w-1/12'>
                    {startIndex + idx + 1}
                  </TableColBody>
                  <TableColBody className='text-center w-7/12 lg:w-3/12 xl:w-3/12'>
                    {item.number ?? '-'}
                  </TableColBody>
                  <TableColBody className='text-center hidden lg:table-cell lg:w-2/12'>
                    {item.issueDate
                      ? new Date(item.issueDate).toLocaleDateString()
                      : '-'}
                  </TableColBody>
                  <TableColBody className='text-center hidden lg:table-cell lg:w-2/12'>
                    {item.client ?? '-'}
                  </TableColBody>
                  <TableColBody className='text-center hidden xl:table-cell xl:w-1/12'>
                    {item.currency ?? '-'}
                  </TableColBody>
                  <TableColBody className='text-center hidden lg:table-cell lg:w-1/12'>
                    {Intl.NumberFormat(undefined, {
                      style: 'currency',
                      currency: item.currency || 'PEN'
                    }).format(item.total ?? 0)}
                  </TableColBody>
                  <TableColBody className='text-center w-2/12 lg:w-1/12'>
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-xs ${
                        item.status
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {item.status ? 'Activa' : 'Anulada'}
                    </span>
                  </TableColBody>
                  <TableColBody className='text-center w-3/12 sm:w-2/12 xl:w-1/12'>
                    <Actions
                      viewLink={`${prefix}/facturas/${item.uuid}`}
                      permView='facturas.view_factura'
                    />
                  </TableColBody>
                </TableRow>
              ))
            ) : (
              <ExceptionTable colspan={8} />
            )}
          </TableBody>
        </Table>
        {/* ====== Paginación ====== */}
        <Pagination
          handleChangePage={handleChangePage}
          totalPages={totalPages}
          actualPage={page}
        />
      </PageContent>
    </PageContainer>
  )
}

export default FacturaManagement

// === Simulación fetch principal ===
async function getData(page: string, token: string | null) {
  if (token) {
    const response = await ApiFecthAuth(
      endPoints.invoices.list(page, ''),
      token
    )
    return {
      props: { facturas: response.data as PagedResult<FacturaInterface> },
      revalidate: 3600
    }
  }
  return { props: { facturas: null }, revalidate: 3600 }
}
