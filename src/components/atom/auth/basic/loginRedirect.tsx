'use client'
import { useAuth } from '@/context/authContext'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

const LoginRedirect = () => {
  const router = useRouter()
  const pathname = usePathname()
  const { isAuthenticated } = useAuth()

  useEffect(() => {

    if (!isAuthenticated()) {
      const redirectHomeFlag = sessionStorage.getItem('redirecthome')

      if (redirectHomeFlag === 'true') {
        sessionStorage.removeItem('redirecthome')
        if (pathname !== '/') {
          router.replace('/')
        }
      } else {
        router.replace(`/?next=${encodeURIComponent(pathname)}`)
      }
    }
  }, [isAuthenticated, pathname, router])

  return ''
}
export { LoginRedirect }
