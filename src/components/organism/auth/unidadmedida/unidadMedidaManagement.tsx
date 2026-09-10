'use client'

import PageTitle from '@/components/atom/auth/structures/pageTitlte'
import GoBack from '@/components/atom/goback'
import PageContainer from '@/components/atom/structures/containers/pageContainer'
import PageContent from '@/components/atom/structures/containers/pageContent'
import { useAuth } from '@/context/authContext'
import { useEffect, useState } from 'react'
import { ApiFecthAuth } from '@/services/auth/axios/apiFetchAuth'
import endPoints from '@/services/auth/endPoints/endPoint'
import { prefix } from '@/services/envs/envs'
import { ToastNotification } from '@/components/atom/structures/toast'
import { UnidadMedidaInterface } from '@/interfaces/querys/queryInterface'
import NewPath from '@/components/atom/auth/basic/newPath'
import { AiFillCopyrightCircle } from 'react-icons/ai'
import { Table } from '@/components/atom/structures/table'
import TableHeader from '@/components/atom/auth/structures/tableHeader'
import TableRowHeader from '@/components/molecule/auth/structures/tableRowHeader'
import TableColHeader from '@/components/atom/auth/structures/tableCol'
import { TableBody } from '@/components/atom/auth/structures/tableBody'
import TableRow from '@/components/atom/auth/structures/tableRow'
import TableColBody from '@/components/atom/auth/structures/tableColBody'
import { TableCounter } from '@/components/atom/auth/structures/tableCounter'
import Actions from '@/components/atom/structures/actions/actions'

const UnidadMedidaManagement = () => {
  const { token, hasPermission } = useAuth()
  const [data, setData] = useState<UnidadMedidaInterface[] | null>(null)
  const [loaded, setLoaded] = useState<boolean>(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await ApiFecthAuth(
          endPoints.mainData.unidadMedida.list('1'),
          token || ''
        )
        setData(response.data.results)
        setLoaded(true)
      } catch (error) {
        ToastNotification('danger', `Error cargando unidades - ${error}`)
      }
    }
    if (token) fetchData()
  }, [token])

  const newData = hasPermission('main_data.add_unidadmedida') ? (
    <NewPath
      tooltip='Nueva Unidad de Medida'
      icon={<AiFillCopyrightCircle />}
      link={`${prefix}/generales/unidadmedida/nuevo/`}
    />
  ) : null

  return (
    <PageContainer>
      <PageTitle description='Unidades de Medida' aditionalIcon={newData} />
      <GoBack enlace={`${prefix}/dashboard`} />
      <PageContent>
        <Table>
          <TableHeader>
            <TableRowHeader>
              <TableColHeader className='w-1/12 text-center'>
                Nro
              </TableColHeader>
              <TableColHeader className='w-5/12 text-center'>
                Nombre
              </TableColHeader>
              <TableColHeader className='w-4/12 text-center'>
                Abreviatura
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
                  <TableColBody>{item.name}</TableColBody>
                  <TableColBody>{item.abbr}</TableColBody>

                  <TableColBody className='text-center'>
                    <Actions
                      editLink={`${prefix}/generales/unidadmedida/${item.uuid}/editar`}
                      permEdit='main_data.change_unidadmedida'
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
                  No hay unidad de medida para mostrar.
                </td>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </PageContent>
    </PageContainer>
  )
}

export default UnidadMedidaManagement
