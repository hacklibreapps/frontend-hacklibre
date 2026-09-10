'use client'

import PageTitle from '@/components/atom/auth/structures/pageTitlte'
import GoBack from '@/components/atom/goback'
import PageContainer from '@/components/atom/structures/containers/pageContainer'
import PageContent from '@/components/atom/structures/containers/pageContent'
import { useAuth } from '@/context/authContext'
import { CondicionInterface } from '@/interfaces/querys/queryInterface'
import { ApiFecthAuth } from '@/services/auth/axios/apiFetchAuth'
import endPoints from '@/services/auth/endPoints/endPoint'
import { prefix } from '@/services/envs/envs'
import { useEffect, useState } from 'react'

const CondicionesView: React.FC<{ uuid: string }> = ({ uuid }) => {
  const { token } = useAuth()
  const [condicion, setCondicion] = useState<CondicionInterface | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      const response = await ApiFecthAuth(
        endPoints.condiciones.retrieve(uuid),
        token || ''
      )
      setCondicion(response.data)
    }
    if (uuid && token) fetchData()
  }, [uuid, token])

  return (
    <PageContainer>
      <PageTitle description='Detalle de la condición' />
      <GoBack enlace={`${prefix}/condiciones/`} />

      <PageContent>
        {condicion ? (
          <div className='bg-white shadow-md rounded-lg p-6 space-y-4 border border-gray-200'>
            {/* Título */}
            <h2 className='text-2xl font-semibold text-Charcoal'>
              {condicion.titulo}
            </h2>

            {/* Contenido con estilo */}
            <div
              className='prose prose-sm max-w-none text-Charcoal/90'
              dangerouslySetInnerHTML={{ __html: condicion.contenido }}
            />

            {/* Estado y por defecto */}
            <div className='flex flex-col sm:flex-row sm:gap-8 pt-4 border-t border-gray-100'>
              <p className='text-sm'>
                <span className='font-semibold text-Charcoal'>Estado:</span>{' '}
                <span
                  className={
                    condicion.estado
                      ? 'text-green-600 font-medium'
                      : 'text-red-600 font-medium'
                  }
                >
                  {condicion.estado ? 'Activo' : 'Inactivo'}
                </span>
              </p>
              <p className='text-sm'>
                <span className='font-semibold text-Charcoal'>
                  Por defecto:
                </span>{' '}
                {condicion.porDefecto ? (
                  <span className='text-blue-600 font-medium'>Sí</span>
                ) : (
                  <span className='text-gray-500'>No</span>
                )}
              </p>
            </div>
          </div>
        ) : (
          <p className='text-center text-Charcoal/60 py-6'>Cargando...</p>
        )}
      </PageContent>
    </PageContainer>
  )
}

export default CondicionesView
