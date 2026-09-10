'use client'

import PageContainer from '@/components/atom/structures/containers/pageContainer'
import PageContent from '@/components/atom/structures/containers/pageContent'
import PageTitle from '@/components/atom/auth/structures/pageTitlte'
import { ToastNotification } from '@/components/atom/structures/toast'
import { prefix } from '@/services/envs/envs'
import { useAuth } from '@/context/authContext'
import { ApiFecthAuth } from '@/services/auth/axios/apiFetchAuth'
import endPoints from '@/services/auth/endPoints/endPoint'
import { useEffect, useState } from 'react'
import { BancoInterface } from '@/interfaces/querys/queryInterface'
import GoBack from '@/components/atom/goback'
import { UUIDInterface } from '@/interfaces/structures/uuidInterface'

const BancosView: React.FC<UUIDInterface> = ({ uuid }) => {
  const { token, enterprise, ready } = useAuth()
  const [banco, setBanco] = useState<BancoInterface | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      if (!ready || !token || !enterprise) return // ⬅️ evita disparar sin header
      try {
        const data = await getData(uuid ? uuid : '', token)
        if (data) {
          setBanco(data.props.banco)
        }
      } catch (error) {
        ToastNotification('danger', `Ha ocurrido un error - ${error}`)
      }
    }
    fetchData()
  }, [enterprise, ready, token, uuid])

  return (
    <PageContainer>
      <PageTitle description='Detalle del Banco' />
      <GoBack enlace={`${prefix}/bancos/`} />

      <PageContent>
        {banco ? (
          <div className='p-6 bg-white rounded shadow'>
            <p>
              <strong>UUID:</strong> {banco.uuid}
            </p>
            <p>
              <strong>Nombre:</strong> {banco.name}
            </p>
          </div>
        ) : (
          <p className='text-center py-10 text-Charcoal/60'>Cargando...</p>
        )}
      </PageContent>
    </PageContainer>
  )
}

export default BancosView

async function getData(uuid: string, token: string | null) {
  if (token) {
    const response = await ApiFecthAuth(
      endPoints.mainData.bancos.retrieve(uuid),
      token
    )

    return {
      props: {
        banco: response.data
      },
      revalidate: 3600
    }
  } else {
    return {
      props: {
        banco: null
      },
      revalidate: 3600
    }
  }
}
