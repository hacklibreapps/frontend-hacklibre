// src/components/atom/auth/LogoutButton.tsx
'use client'

import { useAuth } from '@/context/authContext'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/atom/structures/button'

type Props = {
  label?: string
  className?: string
  /** A dónde redirigir tras cerrar sesión (por defecto al login) */
  redirectTo?: string
}

const LogoutButton: React.FC<Props> = ({
  label = 'Cerrar sesión',
  className,
  redirectTo = '/auth/login'
}) => {
  const router = useRouter()
  const { logout } = useAuth()

  const handleLogout = () => {
    logout()
    try {
      sessionStorage.setItem('redirecthome', 'true')
    } catch {
      // ignore
    }
    router.replace(redirectTo)
  }

  // Envuelve el Button para poder pasar className externamente
  return (
    <div className={className}>
      <Button
        data={{
          name: 'logout',
          id: 'logout',
          label: '',
          showLabel: false,
          type: 'button',
          buttonName: label,
          compact: true,
          onClick: handleLogout
        }}
      />
    </div>
  )
}

export default LogoutButton
