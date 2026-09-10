'use client'

import NewPath from '@/components/atom/auth/basic/newPath'
import PageTitle from '@/components/atom/auth/structures/pageTitlte'
import { StatusIcon } from '@/components/atom/auth/structures/status/statusIcon'
import { TableBody } from '@/components/atom/auth/structures/tableBody'
import TableColHeader from '@/components/atom/auth/structures/tableCol'
import TableColBody from '@/components/atom/auth/structures/tableColBody'
import { TableCounter } from '@/components/atom/auth/structures/tableCounter'
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
import { ProductosInterface } from '@/interfaces/querys/queryInterface'
import { ProductosResultInterface } from '@/interfaces/querys/resultInterface'
import { ApiFecthAuth } from '@/services/auth/axios/apiFetchAuth'
import endPoints from '@/services/auth/endPoints/endPoint'
import { paginationSize, prefix } from '@/services/envs/envs'
import useQueryParams from '@/utils/useQueryParams'
import { useEffect, useState } from 'react'
import { LuPackagePlus } from 'react-icons/lu'

const ProductosManagement: React.FC = () => {
  const { token, hasPermission, ready, enterprise } = useAuth()
  const queryParams = useQueryParams()
  const [t, setT] = useState<string | null>(null)
  const [m, setM] = useState<string | null>(null)

  useEffect(() => {
    if (queryParams) {
      setT(queryParams.get('t'))
      setM(queryParams.get('m'))
    }
  }, [queryParams])

  const [page, setPage] = useState<string>('1')
  const [totalPages, setTotalPages] = useState<number>(1)
  const [data, setData] = useState<ProductosResultInterface | null>(null)
  const [usefullData, setUsefullData] = useState<ProductosInterface[] | null>(
    null
  )

  const [loaded, setLoaded] = useState<boolean>(true)

  useEffect(() => {
    if (t && m) {
      const type = t === 's' ? 'success' : ''
      const message = m === 'edit' ? 'Producto editado SATISFACTORIAMENTE' : ''
      ToastNotification(type, message)
      if (window.history.replaceState) {
        window.history.replaceState(
          {},
          document.title,
          window.location.pathname
        )
      }
    }
  }, [t, m])

  const handleChangePage = (pageNr: number) => {
    setPage(pageNr.toString())
  }

  useEffect(() => {
    if (!ready || !token || !enterprise) return

    const fetchData = async () => {
      if (!ready || !token || !enterprise) return
      try {
        const data = await getData(page, token)
        const prototal = data.props.productos?.count / paginationSize
        const modprod = data.props.productos?.count % paginationSize
        const total_pages = modprod > 0 ? Math.trunc(prototal) + 1 : prototal
        setTotalPages(total_pages)
        setData(data.props.productos)
      } catch (error) {
        ToastNotification('danger', `Ha ocurrido un error - ${error}`)
      }
    }
    fetchData()
  }, [enterprise, page, ready, token])

  useEffect(() => {
    if (data) {
      setUsefullData(data.results as ProductosInterface[])
      setLoaded(true)
    }
  }, [data])

  const newData = hasPermission('productos.add_producto') ? (
    <NewPath
      tooltip='Nuevo producto'
      icon={<LuPackagePlus className='text-Cian8' />}
      link={`${prefix}/generales/productos/nuevo/`}
    />
  ) : null

  return (
    <PageContainer>
      <PageTitle
        description='Alta, edición y gestión de productos'
        aditionalIcon={newData ? newData : undefined}
      />
      <PageContent>
        <Table>
          <TableHeader>
            <TableRowHeader>
              <TableColHeader className='w-2/12 md:w-1/12'>Nro</TableColHeader>
              <TableColHeader className='w-2/12 xl:w-3/12'>
                Nombre
              </TableColHeader>
              <TableColHeader className='hidden sm:table-cell sm:w-2/12 md:w-1/12 lg:w-2/12 xl:w-1/12'>
                Moneda
              </TableColHeader>
              <TableColHeader className='hidden md:table-cell md:w-2/12 xl:w-1/12'>
                Precio Compra
              </TableColHeader>
              <TableColHeader className='hidden sm:table-cell sm:w-2/12 md:w-2/12 xl:w-1/12'>
                Precio Venta
              </TableColHeader>
              <TableColHeader className='hidden xl:table-cell xl:w-1/12'>
                Incluye IGV
              </TableColHeader>
              <TableColHeader className='hidden xl:table-cell xl:w-1/12'>
                IGV Tasa
              </TableColHeader>
              <TableColHeader className='hidden xl:table-cell xl:w-1/12'>
                Gravado IGV
              </TableColHeader>
              <TableColHeader className='w-3/12 sm:w-1/12'>
                Estado
              </TableColHeader>
              <TableColHeader className='w-3/12 sm:w-2/12 md:w-1/12 lg:w-2/12 xl:w-1/12'>
                Acciones
              </TableColHeader>
            </TableRowHeader>
          </TableHeader>
          <TableBody>
            {loaded && usefullData ? (
              usefullData.map((item, index) => (
                <TableRow key={index}>
                  <TableColBody className='w-2/12 md:w-1/12 text-center'>
                    <TableCounter nr={index} page={page} />
                  </TableColBody>
                  <TableColBody className='w-2/12 xl:w-3/12 text-center'>
                    {item.nombre}
                  </TableColBody>
                  <TableColBody className='hidden sm:table-cell sm:w-2/12 md:w-1/12 lg:w-2/12 xl:w-1/12 text-center'>
                    {item.moneda?.value || '-'}
                  </TableColBody>
                  <TableColBody className='hidden md:table-cell md:w-2/12 xl:w-1/12 text-center'>
                    {item.precioUnitario}
                  </TableColBody>
                  <TableColBody className='hidden sm:table-cell sm:w-2/12 md:w-2/12 xl:w-1/12 text-center'>
                    {item.precioVenta}
                  </TableColBody>
                  <TableColBody className='hidden xl:table-cell xl:w-1/12 text-center'>
                    <StatusIcon
                      status={item.incluyeIgv}
                      labelActivo='SI'
                      labelInactivo='NO'
                    />
                  </TableColBody>
                  <TableColBody className='hidden xl:table-cell xl:w-1/12 text-center'>
                    {item.igvTasa} %
                  </TableColBody>
                  <TableColBody className='hidden xl:table-cell xl:w-1/12 text-center'>
                    <StatusIcon
                      status={item.gravadoIgv}
                      labelActivo='SI'
                      labelInactivo='NO'
                    />
                  </TableColBody>
                  <TableColBody className='w-3/12 sm:w-1/12 text-center'>
                    <StatusIcon status={item.estado} />
                  </TableColBody>
                  <TableColBody className='w-3/12 sm:w-2/12 md:w-1/12 lg:w-2/12 xl:w-1/12 text-center'>
                    <Actions
                      editLink={`${prefix}/generales/productos/${item.uuid}/editar`}
                      permEdit='productos.change_producto'
                    />
                  </TableColBody>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <td colSpan={8}>
                  <div className='mt-5'>
                    <p>Cargando...</p>
                  </div>
                </td>
              </TableRow>
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
export default ProductosManagement

async function getData(page: string, token: string | null) {
  if (token) {
    const response = await ApiFecthAuth(
      endPoints.productos.list(page, ''),
      token
    )
    return {
      props: {
        productos: response.data
      },
      revalidate: 3600
    }
  } else {
    return {
      props: {
        productos: null
      },
      revalidate: 3600
    }
  }
}
