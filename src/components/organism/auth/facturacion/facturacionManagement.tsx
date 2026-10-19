'use client'

import NewPath from '@/components/atom/auth/basic/newPath'
import PageTitle from '@/components/atom/auth/structures/pageTitlte'

import PageContainer from '@/components/atom/structures/containers/pageContainer'
import PageContent from '@/components/atom/structures/containers/pageContent'
import { Pagination } from '@/components/atom/structures/pagination'
import { ToastNotification } from '@/components/atom/structures/toast'

import { useAuth } from '@/context/authContext'
import { ApiFecthAuth } from '@/services/auth/axios/apiFetchAuth'
import endPoints from '@/services/auth/endPoints/endPoint'
import { paginationSize, prefix } from '@/services/envs/envs'

import { useCallback, useEffect, useState } from 'react'

import { FacturacionInterface } from '@/interfaces/querys/queryInterface'
import FiltrosFacturacionMenu from '@/components/molecule/filters/filtrosFacturacionMenu'

import ExceptionTable from '@/utils/exceptionTable'
import { FacturacionResultInterface } from '@/interfaces/querys/resultInterface'
import { Table } from '@/components/atom/structures/tables'
import { Loading } from '@/components/atom/auth/loading'
import { InvoiceItem } from '@/components/molecule/invoices/items/invoiceItem'
import { Icons } from '@/utils/icons'

const FacturacionManagement: React.FC = () => {
  const { token, enterprise, ready } = useAuth()

  // === Estados ===
  const [page, setPage] = useState<string>('1')
  const [totalPages, setTotalPages] = useState<number>(1)
  const [data, setData] = useState<FacturacionResultInterface | null>(null)
  const [usefullData, setUsefullData] = useState<FacturacionInterface[] | []>(
    []
  )
  const [loaded, setLoaded] = useState<boolean>(false)

  const [month, setMonth] = useState<number>(new Date().getMonth() + 1)
  const [year, setYear] = useState<number>(new Date().getFullYear())
  const [tipoComprobante, setTipoComprobante] = useState<string>('todos')
  const [empresa, setEmpresa] = useState<string>('todos')

  const actualYear = new Date().getFullYear()

  // === Helpers ===
  const handleChangePage = (pageNr: number) => setPage(pageNr.toString())

  const fetchData = useCallback(
    async (page: string, token: string | null, m?: number, y?: number) => {
      if (!ready || !token || !enterprise) return
      try {
        const resp = await getData(page, token, tipoComprobante, empresa, m, y)
        const totalCount = resp.props?.facturas?.count ?? 0
        const total = Math.ceil(totalCount / paginationSize)
        setTotalPages(total > 0 ? total : 1)
        if (resp.props && resp.props.facturas) {
          setData(resp.props.facturas)
        }
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
    console.log('data', data)

    if (data) setUsefullData(data.results || [])
  }, [data])

  const iconsGroup = (
    <div className='flex gap-2'>
      <NewPath
        tooltip='Nuevo comprobante'
        icon={<Icons name='invoice' className='text-2xl' />}
        link={`${prefix}/facturacion/comprobantes/`}
        className='text-Orangevivido'
      />
    </div>
  )

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
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell className='hidden sm:table-cell sm:w-1/12'>
                Nro
              </Table.HeaderCell>
              <Table.HeaderCell className='w-3/12 lg:w-1/12'>
                Tipo
              </Table.HeaderCell>
              <Table.HeaderCell className='w-4/12 lg:w-1/12'>
                Nro. Doc.
              </Table.HeaderCell>
              <Table.HeaderCell className='hidden lg:table-cell lg:w-1/12'>
                Emisión
              </Table.HeaderCell>
              <Table.HeaderCell className='hidden lg:table-cell lg:w-2/12'>
                Cliente/Proveedor
              </Table.HeaderCell>
              <Table.HeaderCell className='hidden xl:table-cell xl:w-1/12'>
                Moneda
              </Table.HeaderCell>
              <Table.HeaderCell className='hidden lg:table-cell lg:w-1/12'>
                Total
              </Table.HeaderCell>
              <Table.HeaderCell className='hidden lg:table-cell lg:w-2/12'>
                Observaciones
              </Table.HeaderCell>
              <Table.HeaderCell className='w-2/12 lg:w-1/12'>
                Estado
              </Table.HeaderCell>
              <Table.HeaderCell className='w-3/12 sm:w-2/12 xl:w-1/12'>
                Acciones
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {!loaded ? (
              <Table.Row>
                <Table.Cell
                  colSpan={10}
                  className='px-4 py-10 text-center text-Cian8'
                >
                  <div className='py-5'>
                    <Loading value='Cargando facturas...' />
                  </div>
                </Table.Cell>
              </Table.Row>
            ) : usefullData && usefullData.length > 0 ? (
              usefullData.map((item, idx) => (
                <InvoiceItem item={item} key={idx} idx={idx} page={page} />
              ))
            ) : (
              <ExceptionTable colspan={10} />
            )}
          </Table.Body>
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
      query.append('invoice_type', tipoComprobante)
    if (empresa && empresa !== 'todos') query.append('empresa', empresa)
    if (month) query.append('emition_month', month.toString())
    if (year) query.append('emition_year', year.toString())

    const response = await ApiFecthAuth(
      `${endPoints.invoices.list(page, '')}&${query.toString()}`,
      token
    )

    return {
      props: {
        facturas: response.data as FacturacionResultInterface
      },
      revalidate: 3600
    }
  }
  return { props: { facturas: null }, revalidate: 3600 }
}
