import SignIn from '@/components/organism/auth/login/login'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sistema de gestión - LOGIN'
}

export default function LoginPage() {
  return <SignIn />
}
