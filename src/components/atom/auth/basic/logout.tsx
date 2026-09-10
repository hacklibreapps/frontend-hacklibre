'use client'

import { useAuth } from '@/context/authContext'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/atom/structures/button'

type Props = {
  label?: string
  className?: string
  redirectTo?: string
}

const Logout: React.FC<Props> = ({
  label = 'Cerrar sesión',
  className,
  redirectTo = '/auth/login' // corrige la ruta
}) => {
  const router = useRouter()
  const { logout } = useAuth()

  const handleLogout = () => {
    logout()
    sessionStorage.setItem('redirecthome', 'true')
    router.replace(redirectTo)
  }

  // Si quieres aplicar una clase externa, envuélvelo en un contenedor
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
          compact: true, // soportado por tu modelo
          onClick: handleLogout // handler aquí
        }}
      />
    </div>
  )
}

export default Logout
