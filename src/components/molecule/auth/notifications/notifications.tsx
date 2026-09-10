'use client'
import { IconButton } from '@/components/atom/auth/iconButton'
import { useAuth } from '@/context/authContext'
import { NotificationsInterface } from '@/interfaces/structures/notificationsInterface'
import { useEffect, useRef, useState } from 'react'
import { LuBell, LuBellRing } from 'react-icons/lu'
import useSWR from 'swr'
import { SWRConfig } from 'swr'
import { ToastNotification } from '@/components/atom/structures/toast'
import endPoints from '@/services/auth/endPoints/endPoint'
import PerfectScrollbarWrapper from '@/utils/perfectSCroolBar'
import { ItemNotification } from '@/components/atom/auth/notifications/itemNotification'
import { ApiPatchAuth } from '@/services/auth/axios/apiPatchAuth'
import { BsCheck2All } from 'react-icons/bs'
import { ApiPostAuth } from '@/services/auth/axios/apiPostAuth'
import { ApiFecthAuth } from '@/services/auth/axios/apiFetchAuth'

const Notifications = () => {
  const { token, enterpriseLogo } = useAuth()
  const [showNotification, setShowNotification] = useState<boolean>(false)
  const HandleNotification = async () => {
    setShowNotification(!showNotification)
    if (audioRef.current) {
      try {
        await audioRef.current.play()
        audioRef.current.pause()
        audioRef.current.currentTime = 0
      } catch {}
    }
  }

  const NOTIFICATION_PERMISSION_KEY = 'notification_permission_requested'
  const NOTIFIED_COUNT_KEY = 'notified_notifications_count'

  const [notifications, setNotifications] = useState<NotificationsInterface[]>(
    []
  )

  const audioRef = useRef<HTMLAudioElement | null>(null)

  const fetcher = async ([url, authToken]: [string, string]) => {
    const response = await ApiFecthAuth(url, authToken)

    // ApiFecthAuth devuelve axios response
    if (response?.data) {
      return response.data
    }

    throw new Error('Error al obtener notificaciones')
  }

  useEffect(() => {
    if (typeof window === 'undefined') return

    audioRef.current = new Audio('/sounds/bell.mp3')
    audioRef.current.volume = 1
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return

    // 👇 Ya se pidió permiso en esta pestaña
    if (sessionStorage.getItem(NOTIFICATION_PERMISSION_KEY)) return

    if ('Notification' in window) {
      Notification.requestPermission()
        .then((permission) => {
          // 🔒 Marcamos que ya se pidió en esta pestaña
          sessionStorage.setItem(NOTIFICATION_PERMISSION_KEY, 'true')

          if (permission === 'granted') {
            console.log('✅ Permiso para notificaciones concedido')
          } else if (permission === 'denied') {
            console.log('❌ Permiso para notificaciones denegado')
          } else {
            console.log('⚠️ Permiso para notificaciones no decidido')
          }
        })
        .catch((error) => {
          ToastNotification(
            'danger',
            `Error solicitando permiso de notificaciones: ${error}`
          )
        })
    } else {
      ToastNotification(
        'danger',
        'Las notificaciones no están soportadas en este navegador.'
      )
    }
  }, [])

  const ep = endPoints.auth.notifications.listNotifications
  const { data } = useSWR(token ? [ep, token] : null, fetcher, {
    refreshInterval: 5000,
    revalidateOnFocus: true
  })

  const playNotificationSound = () => {
    if (!audioRef.current) return

    audioRef.current.currentTime = 0
    audioRef.current.play().catch(() => {})
  }

  useEffect(() => {
    if (!data) return

    setNotifications(data)

    if (typeof window === 'undefined') return
    if (Notification.permission !== 'granted') return

    const lastNotifiedCount = Number(
      sessionStorage.getItem(NOTIFIED_COUNT_KEY) || 0
    )

    // 🆕 Solo si hay MÁS notificaciones que antes
    if (data.length > lastNotifiedCount) {
      new Notification('Nueva notificación', {
        body: `${
          data.length - lastNotifiedCount
        } nueva(s) notificación(es) por revisar`,
        icon: enterpriseLogo || ''
      })

      // 🔔 Reproducir sonido SOLO cuando se muestra el mensaje
      playNotificationSound()

      // 🔒 Guardar nuevo total
      sessionStorage.setItem(NOTIFIED_COUNT_KEY, data.length.toString())
    }
  }, [data, enterpriseLogo])
  const handleDeleteNotification = (uuid: string) => {
    const PostAxios = async () => {
      const response = await ApiPatchAuth(
        endPoints.auth.notifications.markAsReadingNotification(uuid),
        token ? token : '',
        { status: true }
      )
      if (response.status === 200) {
        ToastNotification('success', 'Notificación eliminada')
      }
    }
    PostAxios()
  }

  const handleDeleteAllNotifications = () => {
    const PostAxios = async () => {
      const response = await ApiPostAuth(
        endPoints.auth.notifications.markAsRead,
        token ? token : '',
        {}
      )
      if (response.status === 200 && response.data) {
        ToastNotification('success', 'Notificaciones marcadas como leidas')
      }
    }
    PostAxios()
  }

  return (
    <SWRConfig>
      <IconButton title='Notificaciones' onClick={HandleNotification}>
        {notifications.length ? (
          <LuBellRing className='h-5 w-5 text-Red7 hover:text-Red8 animate-shake' />
        ) : (
          <LuBell className='h-5 w-5 text-Cian7 hover:text-Cian8' />
        )}
      </IconButton>
      {showNotification && (
        <div
          className={`${
            !notifications.length ? 'hidden' : ''
          } w-96 xl:w-[500px] h-96 flex flex-col justify-start items-center absolute -right-4 sm:right-2 top-14 z-50 bg-white overflow-y-auto pt-3 shadow-xl`}
        >
          <PerfectScrollbarWrapper className='w-full px-3 flex flex-col justify-start items-start'>
            {notifications.map((item, index) => (
              <ItemNotification
                key={index}
                data={item}
                markAsRead={handleDeleteNotification}
              />
            ))}
          </PerfectScrollbarWrapper>
          <div className='bg-Cian2 w-full flex flex-row justify-center items-center'>
            <div
              className='py-3 cursor-pointer flex flex-row justify-center items-center text-Cian8 font-bold'
              onClick={handleDeleteAllNotifications}
            >
              <p className='pr-1 text-xl'>
                <BsCheck2All />
              </p>
              <p>Marcar notificaciones como leidas</p>
            </div>
          </div>
        </div>
      )}
    </SWRConfig>
  )
}

export { Notifications }
