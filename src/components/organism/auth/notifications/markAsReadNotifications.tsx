'use client'
import { Loading } from '@/components/atom/auth/loading'
import { ToastNotification } from '@/components/atom/structures/toast'
import { useAuth } from '@/context/authContext'
import { ApiPatchAuth } from '@/services/auth/axios/apiPatchAuth'
import endPoints from '@/services/auth/endPoints/endPoint'
import useQueryParams from '@/utils/useQueryParams'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

const MaskAsReadNotification = ({ uuid }: { uuid: string }) => {
  const { token } = useAuth()
  const queryParams = useQueryParams()
  // const { url, return_to } = searchParams
  const router = useRouter()
  const [url, setUrl] = useState<string | null>('#')
  const [returnTo, setReturnTo] = useState<string | null>('')

  useEffect(() => {
    if (queryParams) {
      if (queryParams.get('u')) {
        setUrl(queryParams.get('u'))
      }
      setReturnTo(queryParams.get('r'))
    }
  }, [queryParams])

  useEffect(() => {
    const markNotificationAsRead = async () => {
      if (url && url.length > 0 && returnTo && uuid && token) {
        const body = {
          status: true
        }
        try {
          const response = await ApiPatchAuth(
            endPoints.auth.notifications.markAsReadingNotification(uuid),
            token,
            body
          )

          if (response && response.status === 200) {
            ToastNotification('success', 'Notificación marcada como leida')

            if (url !== '#') {
              router.push(url)
            } else {
              router.push(returnTo)
            }
          } else {
            ToastNotification(
              'danger',
              'Error al marcar la notificación como leída'
            )
          }
        } catch (error) {
          ToastNotification(
            'warning',
            `Error al procesar la solicitud ${error}`
          )
        }
      }
    }
    markNotificationAsRead()
  }, [returnTo, router, token, url, uuid])

  return (
    <div className='w-full flex flex-col justify-center items-center'>
      <Loading />
      <p className='text-xl font-semibold text-GreenDark'>Redirigiendo ...</p>
    </div>
  )
}
export { MaskAsReadNotification }
