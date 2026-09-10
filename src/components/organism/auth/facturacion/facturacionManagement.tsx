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

import { useAuth } from '@/context/authContext'
import { ApiFecthAuth } from '@/services/auth/axios/apiFetchAuth'
import endPoints from '@/services/auth/endPoints/endPoint'
import { paginationSize, prefix } from '@/services/envs/envs'

import { useCallback, useEffect, useState } from 'react'
import { TbFileInvoice } from 'react-icons/tb'
import { FacturacionInterface } from '@/interfaces/querys/queryInterface'
import FiltrosFacturacionMenu from '@/components/molecule/filters/filtrosFacturacionMenu'

import ExceptionTable from '@/utils/exceptionTable'

type PagedResult<T> = { count: number; results: T[] }

const FacturacionManagement: React.FC = () => {
  const { token, enterprise, ready } = useAuth()

  // === Estados ===
  const [page, setPage] = useState<string>('1')
  const [totalPages, setTotalPages] = useState<number>(1)
  const [data, setData] = useState<PagedResult<FacturacionInterface> | null>(
    null
  )
  const [usefullData, setUsefullData] = useState<FacturacionInterface[] | null>(
    null
  )
  const [loaded, setLoaded] = useState<boolean>(false)

  const [month, setMonth] = useState<number>(new Date().getMonth() + 1)
  const [year, setYear] = useState<number>(new Date().getFullYear())
  const [tipoComprobante, setTipoComprobante] = useState<string>('todos')
  const [empresa, setEmpresa] = useState<string>('todos')

  const actualYear = new Date().getFullYear()

  // === Helpers ===
  const handleChangePage = (pageNr: number) => setPage(pageNr.toString())

  const handlerDownloadPdf = async (uuid: string, facturacion: string) => {
    try {
      const report = await ApiFecthAuth(
        endPoints.quotations.exportPdf(uuid),
        token || '',
        '',
        'application/pdf',
        'blob'
      )

      // ✅ Aseguramos que venga data
      if (report && report.data && report.data instanceof Blob) {
        const reader = new FileReader()
        reader.onloadend = () => {
          const base64data = reader.result
          const link = document.createElement('a')
          link.href = base64data as string
          link.download = `${facturacion}.pdf`
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
      ToastNotification('danger', 'Error al obtener facturación')
      console.error('Error:', error)
    }
  }

  const formatCurrency = (value: number, currency = 'PEN') =>
    Intl.NumberFormat('es-PE', { style: 'currency', currency }).format(value)

  const fetchData = useCallback(
    async (page: string, token: string | null, m?: number, y?: number) => {
      if (!ready || !token || !enterprise) return
      try {
        const resp = await getData(page, token, tipoComprobante, empresa, m, y)
        const totalCount = resp.props?.facturas?.count ?? 0
        const total = Math.ceil(totalCount / paginationSize)
        setTotalPages(total > 0 ? total : 1)
        setData(resp.props.facturas ?? null)
      } catch (e) {
        ToastNotification('danger', `Ha ocurrido un error - ${e}`)
      } finally {
        setLoaded(true)
      }
    },
    [ready, enterprise, tipoComprobante, empresa]
  )

  const handleMonthYearChange = async (m: number, y: number) => {
    setLoaded(false)
    setMonth(m)
    setYear(y)
    await fetchData(page, token, m, y)
  }

  useEffect(() => {
    if (token) fetchData(page, token, month, year)
  }, [page, token, month, year, tipoComprobante, empresa, fetchData])

  useEffect(() => {
    if (data) setUsefullData(data.results || [])
  }, [data])

  const iconsGroup = (
    <div className='flex gap-2'>
      <NewPath
        tooltip='Nuevo comprobante'
        icon={<TbFileInvoice className='text-Cian8 text-2xl' />}
        link={`${prefix}/facturacion/comprobantes/`}
        className='text-Orangevivido'
      />
    </div>
  )

  const startIndex = (Number(page || '1') - 1) * paginationSize

  return (
    <PageContainer>
      <PageTitle
        description='Gestión consolidada de todos los comprobantes'
        aditionalIcon={iconsGroup}
      />

      <PageContent>
        {/* === FILTROS === */}
        <div className='flex justify-end mb-3'>
          <FiltrosFacturacionMenu
            tipoComprobante={tipoComprobante}
            setTipoComprobante={setTipoComprobante}
            selectedMonth={month}
            selectedYear={year}
            onChangeMonthYear={handleMonthYearChange}
            actualYear={actualYear}
            empresa={empresa}
            setEmpresa={setEmpresa}
          />
        </div>

        {/* ===== TABLA ===== */}
        <Table>
          <TableHeader>
            <TableRowHeader>
              <TableColHeader className='hidden sm:table-cell sm:w-1/12'>
                Nro
              </TableColHeader>
              <TableColHeader className='w-3/12 lg:w-2/12'>Tipo</TableColHeader>
              <TableColHeader className='w-4/12 lg:w-3/12'>
                Documento
              </TableColHeader>
              <TableColHeader className='hidden lg:table-cell lg:w-2/12'>
                Emisión
              </TableColHeader>
              <TableColHeader className='hidden lg:table-cell lg:w-2/12'>
                Cliente/Proveedor
              </TableColHeader>
              <TableColHeader className='hidden xl:table-cell xl:w-1/12'>
                Moneda
              </TableColHeader>
              <TableColHeader className='hidden lg:table-cell lg:w-1/12'>
                Total
              </TableColHeader>
              <TableColHeader className='w-2/12 lg:w-1/12'>
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
                  Cargando comprobantes...
                </td>
              </TableRow>
            ) : usefullData && usefullData.length > 0 ? (
              usefullData.map((item, idx) => (
                <TableRow
                  key={item.uuid ?? idx}
                  className='border-t hover:bg-slate-50 transition-colors'
                >
                  <TableColBody className='text-center hidden sm:table-cell sm:w-1/12'>
                    {startIndex + idx + 1}
                  </TableColBody>
                  <TableColBody className='text-center w-3/12 lg:w-2/12'>
                    {item.tipo || '-'}
                  </TableColBody>
                  <TableColBody className='text-center w-4/12 lg:w-3/12'>
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
                    {formatCurrency(item.total ?? 0, item.currency)}
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
                      pdfLink={item.uuid}
                      permPdf='facturas.view_factura'
                      onDownloadPdf={() =>
                        handlerDownloadPdf(item.uuid, item.number)
                      }
                    />
                  </TableColBody>
                </TableRow>
              ))
            ) : (
              <ExceptionTable colspan={9} />
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

export default FacturacionManagement

async function getData(
  page: string,
  token: string | null,
  tipoComprobante?: string,
  empresa?: string,
  month?: number,
  year?: number
) {
  if (token) {
    const query = new URLSearchParams()
    if (tipoComprobante && tipoComprobante !== 'todos')
      query.append('tipo', tipoComprobante)
    if (empresa && empresa !== 'todos') query.append('empresa', empresa)
    if (month) query.append('month', month.toString())
    if (year) query.append('year', year.toString())

    const response = await ApiFecthAuth(
      `${endPoints.invoices.list(page, '')}?${query.toString()}`,
      token
    )
    return {
      props: { facturas: response.data as PagedResult<FacturacionInterface> },
      revalidate: 3600
    }
  }
  return { props: { facturas: null }, revalidate: 3600 }
}
