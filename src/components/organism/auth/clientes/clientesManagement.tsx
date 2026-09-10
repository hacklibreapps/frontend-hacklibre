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
import { Filters } from '@/components/molecule/filters/filters'
import { useAuth } from '@/context/authContext'
import { useFilters } from '@/hooks/useFilters'
import { ClienteInterface } from '@/interfaces/querys/queryInterface'
import { ClienteResultInterface } from '@/interfaces/querys/resultInterface'
import { ApiFecthAuth } from '@/services/auth/axios/apiFetchAuth'
import endPoints from '@/services/auth/endPoints/endPoint'
import { paginationSize, prefix } from '@/services/envs/envs'
import ExceptionTable from '@/utils/exceptionTable'
import useQueryParams from '@/utils/useQueryParams'
import { useEffect, useRef, useState } from 'react'
import { LuUserPlus } from 'react-icons/lu'

const ClientesManagement: React.FC = () => {
  const { token, enterprise, hasPermission, ready } = useAuth()
  const {
    filters,
    updateFilter,
    applyFilter,
    filtered,
    resetFilter,
    activeKeys
  } = useFilters()
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
  const [data, setData] = useState<ClienteResultInterface | null>(null)
  const [usefullData, setUsefullData] = useState<ClienteInterface[] | null>(
    null
  )
  const [loaded, setLoaded] = useState<boolean>(true)

  const rucRef = useRef<HTMLInputElement>(null)
  const razonSocialRef = useRef<HTMLInputElement>(null)
  const contactoRef = useRef<HTMLInputElement>(null)
  useEffect(() => {
    if (usefullData) {
      console.log('usefullData', usefullData)
    }
  }, [usefullData])

  useEffect(() => {
    if (t && m) {
      const type = t === 's' ? 'success' : ''
      const message = m === 'edit' ? 'Usuario editado SATISFACTORIAMENTE' : ''
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

  // ...CAMBIO REALIZADO 23/09
  useEffect(() => {
    const fetchData = async () => {
      if (!ready || !token || !enterprise) return // ⬅️ evita disparar sin header
      try {
        const data = await getData(page, filtered, token)
        const total = data.props.clientes?.count / paginationSize
        const mod = data.props.clientes?.count % paginationSize
        const total_pages = mod > 0 ? Math.trunc(total) + 1 : total
        setTotalPages(total_pages)
        setData(data.props.clientes)
      } catch (error) {
        ToastNotification('danger', `Ha ocurrido un error - ${error}`)
      }
    }
    fetchData()
  }, [page, enterprise, token, filtered, ready]) // ⬅️ agrega ready como dependencia

  useEffect(() => {
    if (data) {
      setUsefullData(data.results as ClienteInterface[])
      setLoaded(true)
    }
  }, [data])

  const newData = hasPermission('clients.add_clients') ? (
    <NewPath
      tooltip='Nuevo cliente'
      icon={<LuUserPlus className='text-Cian8' />}
      link={`${prefix}/clientes/nuevo/`}
      className='text-Orangevivido'
    />
  ) : null

  const formDataFilter = {
    ruc: {
      name: 'ruc',
      id: 'ruc',
      label: 'RUC',
      ref: rucRef,
      showLabel: true,
      onChange: () => updateFilter('ruc', rucRef.current?.value ?? ''),
      type: 'input',
      value: filters['ruc'],
      tiny: true
    },
    razonSocial: {
      name: 'razonSocial',
      id: 'razonSocial',
      label: 'Razón social',
      ref: razonSocialRef,
      showLabel: true,
      onChange: () =>
        updateFilter('company', razonSocialRef.current?.value ?? ''),
      type: 'input',
      value: filters['company'],
      tiny: true
    },
    contacto: {
      name: 'contacto',
      id: 'contacto',
      label: 'Nombre Contacto',
      ref: contactoRef,
      showLabel: true,
      onChange: () => updateFilter('contact', contactoRef.current?.value ?? ''),
      type: 'input',
      value: filters['contact'],
      tiny: true
    }
  }
  return (
    <PageContainer>
      <PageTitle aditionalIcon={newData ? newData : undefined} />

      <PageContent>
        <Filters
          config={formDataFilter}
          align='right'
          aplicarFiltros={applyFilter}
          limpiarFiltros={resetFilter}
          listFiltros={activeKeys}
        />
        <Table>
          <TableHeader>
            <TableRowHeader>
              <TableColHeader className='w-2/12 xl:w-1/12'>Nro</TableColHeader>
              <TableColHeader className='w-4/12 sm:w-6/12 md:w-3/12 lg:w-2/12'>
                Razon Social
              </TableColHeader>
              <TableColHeader className='hidden lg:table-cell lg:w-2/12 xl:w-2/12 2xl:w-1/12'>
                RUC
              </TableColHeader>
              <TableColHeader className='hidden xl:table-cell xl:w-2/12'>
                Contacto principal
              </TableColHeader>
              <TableColHeader className='hidden xl:table-cell xl:w-2/12'>
                Email
              </TableColHeader>
              <TableColHeader className='w-3/12 sm:w-2/12 xl:w-1/12'>
                Estado
              </TableColHeader>
              <TableColHeader className='w-3/12 sm:w-2/12 xl:w-1/12'>
                Acciones
              </TableColHeader>
            </TableRowHeader>
          </TableHeader>

          <TableBody>
            {loaded && usefullData && usefullData.length > 0 ? (
              usefullData.map((item, index) => (
                <TableRow key={index}>
                  <TableColBody className='text-center w-2/12 xl:w-1/12 align-top'>
                    <TableCounter nr={index} page={page} />
                  </TableColBody>
                  <TableColBody className='text-center w-4/12 sm:w-6/12 md:w-3/12 lg:w-1/12  align-top'>
                    {item.completeCompanyName}
                    <br />
                    <small>({item.companyName})</small>
                  </TableColBody>
                  <TableColBody className='text-center hidden lg:table-cell lg:w-2/12 xl:w-2/12 2xl:w-1/12  align-top'>
                    {item.ruc}
                  </TableColBody>
                  <TableColBody className='text-center hidden xl:table-cell xl:w-2/12  align-top'>
                    <div className='w-full flex flex-row justify-center items-center'>
                      <div className='w-11/12 xl:w-10/12 2xl:w-9/12 text-center'>
                        <ul className='w-full text-left'>
                          {item.contacts && item.contacts.length > 0
                            ? item.contacts.map((contacto, index) => (
                                <li
                                  className='list-disc first:font-bold'
                                  key={index}
                                >
                                  {contacto}
                                </li>
                              ))
                            : '-'}
                        </ul>
                      </div>
                    </div>
                  </TableColBody>
                  <TableColBody className='text-center hidden xl:table-cell xl:w-2/12 align-top'>
                    {item.email}
                  </TableColBody>
                  <TableColBody className='text-center w-3/12 sm:w-2/12 xl:w-1/12  align-top'>
                    <StatusIcon status={item.status} />
                  </TableColBody>
                  <TableColBody className='text-center w-3/12 sm:w-2/12 xl:w-1/12  align-top'>
                    <Actions
                      editLink={`${prefix}/clientes/${item.uuid}/editar`}
                      permEdit='clients.change_clients'
                    />
                  </TableColBody>
                </TableRow>
              ))
            ) : (
              <ExceptionTable colspan={7} />
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

export default ClientesManagement

async function getData(page: string, filtered: string, token: string | null) {
  if (token) {
    const response = await ApiFecthAuth(
      endPoints.clients.list(page, filtered),
      token
    )
    return {
      props: {
        clientes: response.data
      },
      revalidate: 3600
    }
  } else {
    return {
      props: {
        clientes: null
      },
      revalidate: 3600
    }
  }
}
