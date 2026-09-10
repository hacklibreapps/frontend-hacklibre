'use client'

import PageTitle from '@/components/atom/auth/structures/pageTitlte'
import { TableBody } from '@/components/atom/auth/structures/tableBody'
import TableColHeader from '@/components/atom/auth/structures/tableCol'
import TableColBody from '@/components/atom/auth/structures/tableColBody'
import { TableCounter } from '@/components/atom/auth/structures/tableCounter'
import TableHeader from '@/components/atom/auth/structures/tableHeader'
import TableRow from '@/components/atom/auth/structures/tableRow'
import Actions from '@/components/atom/structures/actions/actions'
import PageContainer from '@/components/atom/structures/containers/pageContainer'
import PageContent from '@/components/atom/structures/containers/pageContent'
import { Table } from '@/components/atom/structures/table'
import { ToastNotification } from '@/components/atom/structures/toast'
import TableRowHeader from '@/components/molecule/auth/structures/tableRowHeader'
import { useAuth } from '@/context/authContext'
import { CondicionInterface } from '@/interfaces/querys/queryInterface'
import { ApiFecthAuth } from '@/services/auth/axios/apiFetchAuth'
import endPoints from '@/services/auth/endPoints/endPoint'
import { prefix } from '@/services/envs/envs'
import { useEffect, useState } from 'react'
import NewPath from '@/components/atom/auth/basic/newPath'
import { AiFillCopyrightCircle } from 'react-icons/ai'

const CondicionesManagement: React.FC = () => {
  const { token, hasPermission } = useAuth()
  const [data, setData] = useState<CondicionInterface[] | null>(null)
  const [loaded, setLoaded] = useState<boolean>(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await ApiFecthAuth(
          endPoints.condiciones.list('1'),
          token || ''
        )
        setData(response.data.results)
        setLoaded(true)
      } catch (error) {
        ToastNotification('danger', `Error cargando condiciones - ${error}`)
      }
    }
    if (token) fetchData()
  }, [token])

  const newData = hasPermission('condicion.view_condicion') ? (
    <NewPath
      tooltip='Nueva condición'
      icon={<AiFillCopyrightCircle />}
      link={`${prefix}/generales/condiciones/nuevo/`}
    />
  ) : null

  return (
    <PageContainer>
      <PageTitle
        description='Gestión de Condiciones de Cotización'
        aditionalIcon={newData}
      />
      <PageContent>
        <Table>
          <TableHeader>
            <TableRowHeader>
              <TableColHeader className='w-1/12 text-center'>
                Nro
              </TableColHeader>
              <TableColHeader className='w-5/12'>Título</TableColHeader>
              <TableColHeader className='w-2/12 text-center'>
                Estado
              </TableColHeader>
              <TableColHeader className='w-2/12 text-center'>
                Por defecto
              </TableColHeader>
              <TableColHeader className='w-2/12 text-center'>
                Acciones
              </TableColHeader>
            </TableRowHeader>
          </TableHeader>

          <TableBody>
            {loaded && data ? (
              data.map((item, index) => (
                <TableRow key={item.uuid}>
                  <TableColBody className='text-center'>
                    <TableCounter nr={index} page='1' />
                  </TableColBody>
                  <TableColBody>{item.titulo}</TableColBody>
                  <TableColBody className='text-center'>
                    {item.estado ? 'Activo' : 'Inactivo'}
                  </TableColBody>
                  <TableColBody className='text-center'>
                    {item.porDefecto ? 'Sí' : 'No'}
                  </TableColBody>
                  <TableColBody className='text-center'>
                    <Actions
                      viewLink={`${prefix}/generales/condiciones/${item.uuid}`}
                      permView='condicion.view_condicion'
                      editLink={`${prefix}/generales/condiciones/${item.uuid}/editar`}
                      permEdit='condicion.change_condicion'
                    />
                  </TableColBody>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <td
                  colSpan={5}
                  className='px-4 py-10 text-center text-Charcoal/60'
                >
                  No hay condiciones para mostrar.
                </td>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </PageContent>
    </PageContainer>
  )
}

export default CondicionesManagement
