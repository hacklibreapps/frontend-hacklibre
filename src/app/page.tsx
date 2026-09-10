'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import SignIn from '@/components/organism/auth/login/login'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    // Si ya inició sesión, ir directo al Dashboard
    if (typeof window !== 'undefined' && localStorage.getItem('token')) {
      router.replace('/auth')
    }
  }, [router])

  return <SignIn />
}
