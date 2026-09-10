'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AdministradorDashboard from '@/components/organism/auth/dashboard/dashboard'

export default function AdministradorPage() {
  const router = useRouter()

  useEffect(() => {
    if (typeof window === 'undefined') return
    const hasToken = !!localStorage.getItem('token')
    if (!hasToken) router.replace('/') // vuelve al Login si no hay token
  }, [router])

  return <AdministradorDashboard />
}
