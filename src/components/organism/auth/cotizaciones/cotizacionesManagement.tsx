'use client'

import NewPath from '@/components/atom/auth/basic/newPath'
import { ColisEdit } from '@/components/atom/auth/structures/ColisEdit'
import PageTitle from '@/components/atom/auth/structures/pageTitlte'
import { TableBody } from '@/components/atom/auth/structures/tableBody'
import TableColHeader from '@/components/atom/auth/structures/tableCol'
import TableHeader from '@/components/atom/auth/structures/tableHeader'
import TableRow from '@/components/atom/auth/structures/tableRow'
import PageContainer from '@/components/atom/structures/containers/pageContainer'
import PageContent from '@/components/atom/structures/containers/pageContent'
import { Pagination } from '@/components/atom/structures/pagination'
import { Table } from '@/components/atom/structures/table'
import { ToastNotification } from '@/components/atom/structures/toast'
import { QuotationTableRow } from '@/components/molecule/auth/quotations/quotationTableRow'
import TableRowHeader from '@/components/molecule/auth/structures/tableRowHeader'
import FiltrosCotizacionMenu from '@/components/molecule/filters/filtrosCotizacionMenu'
import { useAuth } from '@/context/authContext'
import { CotizacionInterface } from '@/interfaces/querys/queryInterface'
import { ApiFecthAuth } from '@/services/auth/axios/apiFetchAuth'
import endPoints from '@/services/auth/endPoints/endPoint'
import { paginationSize, prefix } from '@/services/envs/envs'
import ExceptionTable from '@/utils/exceptionTable'
import { useEffect, useState } from 'react'
import { TbFilePlus } from 'react-icons/tb'

type PagedResult<T> = { count: number; results: T[] }

const CotizacionesManagement: React.FC = () => {
  const { token, enterprise, ready, hasPermission } = useAuth()

  const [page, setPage] = useState<string>('1')
  const [totalPages, setTotalPages] = useState<number>(1)
  const [data, setData] = useState<PagedResult<CotizacionInterface> | null>(
    null
  )
  const [usefullData, setUsefullData] = useState<CotizacionInterface[] | null>(
    null
  )
  const [loaded, setLoaded] = useState<boolean>(false)
  const [filteredBy, setFilteredBy] = useState<string>('')
  // Filtros
  const [month, setMonth] = useState<number>(new Date().getMonth() + 1)
  const [year, setYear] = useState<number>(new Date().getFullYear())
  const [cotizacion, setCotizacion] = useState<string>('')
  const [cliente, setCliente] = useState<string>('')
  const [estado, setEstado] = useState<string>('')

  const handleChangePage = (pageNr: number) => setPage(pageNr.toString())

  const handleMonthYearChange = (newMonth: number, newYear: number) => {
    setMonth(newMonth)
    setYear(newYear)
    setPage('1')
  }

  const handlerDownloadPdf = async (uuid: string, cotizacion: string) => {
    try {
      const report = await ApiFecthAuth(
        endPoints.quotations.exportPdf(uuid),
        token || '',
        '',
        'application/pdf',
        'blob'
      )

      if (report && report.data && report.data instanceof Blob) {
        const reader = new FileReader()
        reader.onloadend = () => {
          const base64data = reader.result
          const link = document.createElement('a')
          link.href = base64data as string
          link.download = `${cotizacion}.pdf`
          document.body.appendChild(link)
          link.click()
          link.remove()
        }
        reader.readAsDataURL(report.data)
      } else {
        ToastNotification('warning', 'No hay reporte disponible para descargar')
        console.warn('Respuesta inesperada:', report)
      }
    } catch (error) {
      ToastNotification('danger', 'Error al obtener cotización')
      console.error('Error:', error)
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      if (!ready || !token || !enterprise) return
      try {
        const filters = { cotizacion, cliente, estado }
        const resp = await getData(page, filters, token, month, year)
        const total = (resp.props?.cotizaciones?.count ?? 0) / paginationSize
        const mod = (resp.props?.cotizaciones?.count ?? 0) % paginationSize
        setTotalPages(mod > 0 ? Math.trunc(total) + 1 : total)
        setData(resp.props.cotizaciones ?? null)
      } catch (e) {
        ToastNotification('danger', `Ha ocurrido un error - ${e}`)
      } finally {
        setLoaded(true)
      }
    }

    fetchData()
  }, [page, token, month, year, cotizacion, cliente, estado, ready, enterprise])

  useEffect(() => {
    if (data) setUsefullData(data.results || [])
  }, [data])

  const newData = hasPermission('quotations.add_quotations') ? (
    <NewPath
      tooltip='Nueva cotización'
      icon={<TbFilePlus className='text-Cian8' />}
      link={`${prefix}/cotizaciones/nuevo/`}
      className='text-Orangevivido'
    />
  ) : null

  const startIndex = (Number(page || '1') - 1) * paginationSize

  return (
    <PageContainer>
      <PageTitle
        description='Gestión de cotizaciones'
        aditionalIcon={newData ? newData : undefined}
      />

      <PageContent>
        {/* === FILTROS === */}
        <div className='flex justify-between items-center mb-3'>
          <div>
            {filteredBy.length > 0 && (
              <>
                <b>Filtrado por:</b> <small>{filteredBy}</small>
              </>
            )}
          </div>
          <FiltrosCotizacionMenu
            cotizacion={cotizacion}
            setCotizacion={setCotizacion}
            cliente={cliente}
            setCliente={setCliente}
            estado={estado}
            setEstado={setEstado}
            selectedMonth={month}
            selectedYear={year}
            onChangeMonthYear={handleMonthYearChange}
            setFilteredBy={setFilteredBy}
          />
        </div>

        <Table>
          <TableHeader>
            <TableRowHeader>
              <TableColHeader className='hidden sm:table-cell sm:w-1/12'>
                Nro
              </TableColHeader>
              <TableColHeader className='w-7/12 lg:w-3/12 xl:w-3/12'>
                Nro. Cotización
              </TableColHeader>
              <TableColHeader className='hidden lg:table-cell lg:w-2/12'>
                Fecha Emisión
              </TableColHeader>
              <TableColHeader className='hidden lg:table-cell lg:w-2/12'>
                Cliente
              </TableColHeader>
              <TableColHeader className='hidden xl:table-cell xl:w-1/12'>
                Moneda
              </TableColHeader>
              <TableColHeader className='hidden lg:table-cell lg:w-1/12'>
                Total
              </TableColHeader>
              <TableColHeader className='w-2/12 lg:w-1/12'>
                <ColisEdit title='Estado' />
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
                  Cargando cotizaciones...
                </td>
              </TableRow>
            ) : usefullData && usefullData.length > 0 ? (
              usefullData.map((item: CotizacionInterface, idx: number) => (
                <QuotationTableRow
                  key={idx}
                  item={item}
                  startIndex={startIndex}
                  idx={idx}
                  handlerDownloadPdf={handlerDownloadPdf}
                />
              ))
            ) : (
              <ExceptionTable colspan={8} />
            )}
          </TableBody>
        </Table>

        <Pagination
          handleChangePage={handleChangePage}
          totalPages={totalPages}
          actualPage={page}
        />
      </PageContent>
    </PageContainer>
  )
}

export default CotizacionesManagement

async function getData(
  page: string,
  filtered: Record<string, string>,
  token: string | null,
  month?: number,
  year?: number
) {
  if (token) {
    // construye el string de filtros dinámicos
    const queryString = new URLSearchParams(filtered).toString()

    // Construye los parámetros de fecha (mes y año)
    const dateParams = `${month ? `month=${month}` : ''}${
      year ? `${month ? '&' : ''}year=${year}` : ''
    }`

    // Combina ambos (fecha + filtros)
    const allParams = [dateParams, queryString].filter(Boolean).join('&')

    // Llamada principal a la API
    const response = await ApiFecthAuth(
      endPoints.quotations.list(
        page,
        allParams.length > 0 ? `&${allParams}` : ''
      ),
      token
    )
    return {
      props: {
        cotizaciones: response.data as PagedResult<CotizacionInterface>
      },
      revalidate: 3600
    }
  }

  // Caso sin token
  return { props: { cotizaciones: null }, revalidate: 3600 }
}
