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
import { Table } from '@/components/atom/structures/table'
import { ToastNotification } from '@/components/atom/structures/toast'
import TableRowHeader from '@/components/molecule/auth/structures/tableRowHeader'
import { useAuth } from '@/context/authContext'
import { BancoInterface } from '@/interfaces/querys/queryInterface'
import { ApiFecthAuth } from '@/services/auth/axios/apiFetchAuth'
import endPoints from '@/services/auth/endPoints/endPoint'
import { prefix } from '@/services/envs/envs'
import useQueryParams from '@/utils/useQueryParams'
import { useEffect, useState } from 'react'
import { RiBankLine } from 'react-icons/ri'

const BancosManagement: React.FC = () => {
  const { token, enterprise, ready, hasPermission } = useAuth()
  const queryParams = useQueryParams()

  const [t, setT] = useState<string | null>(null)
  const [m, setM] = useState<string | null>(null)

  const [loading] = useState<boolean>(false)
  const [data, setData] = useState<BancoInterface[]>([])

  useEffect(() => {
    if (queryParams) {
      setT(queryParams.get('t'))
      setM(queryParams.get('m'))
    }
  }, [queryParams])

  useEffect(() => {
    if (t && m) {
      const type = t === 's' ? 'success' : ''
      const message = m === 'edit' ? 'Banco editado SATISFACTORIAMENTE' : ''
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

  useEffect(() => {
    const fetchData = async () => {
      if (!ready || !token || !enterprise) return // ⬅️ evita disparar sin header
      try {
        const data = await getData(token)
        setData(data.props.bancos)
      } catch (error) {
        ToastNotification('danger', `Ha ocurrido un error - ${error}`)
      }
    }
    fetchData()
  }, [enterprise, ready, token])

  const newData = hasPermission('main_data.add_banks') ? (
    <NewPath
      tooltip='Nuevo Banco'
      icon={<RiBankLine />}
      link={`${prefix}/generales/bancos/nuevo/`}
    />
  ) : null

  return (
    <PageContainer>
      <PageTitle
        description='Gestión de Bancos'
        aditionalIcon={newData ?? undefined}
      />

      <PageContent>
        <Table>
          <TableHeader>
            <TableRowHeader>
              <TableColHeader className='w-1/12 text-center'>
                Nro
              </TableColHeader>
              <TableColHeader className='w-10/12 text-center'>
                Nombre
              </TableColHeader>
              <TableColHeader className='w-1/12 text-center'>
                Acciones
              </TableColHeader>
            </TableRowHeader>
          </TableHeader>

          <TableBody>
            {loading ? (
              <TableRow>
                <td
                  colSpan={8}
                  className='px-4 py-10 text-center text-Charcoal/60'
                >
                  Cargando...
                </td>
              </TableRow>
            ) : data && data.length > 0 ? (
              data.map((item, idx) => (
                <TableRow key={item.uuid ?? idx}>
                  <TableColBody className='text-center'>{idx + 1}</TableColBody>
                  <TableColBody className='text-center'>
                    {item.name ?? '-'}
                  </TableColBody>
                  <TableColBody className='w-1/12 text-center'>
                    <Actions
                      editLink={`${prefix}/generales/bancos/${item.uuid}/editar`}
                      permEdit='main_data.change_banks'
                    />
                  </TableColBody>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <td
                  colSpan={8}
                  className='px-4 py-10 text-center text-Charcoal/60'
                >
                  No hay bancos para mostrar.
                </td>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </PageContent>
    </PageContainer>
  )
}

export default BancosManagement

async function getData(token: string | null) {
  if (token) {
    const response = await ApiFecthAuth(endPoints.mainData.bancos.list(), token)
    return {
      props: {
        bancos: response.data.results ?? []
      },
      revalidate: 3600
    }
  }
  return { props: { bancos: [] }, revalidate: 3600 }
}
