'use client'

import { Unauthorized } from '@/components/atom/auth/structures/unauthorized'
// import { Unauthorized } from '@/components/atom/auth/structures/unauthorized'
import { useAuth } from './authContext'
import { Loading } from '@/components/atom/auth/loading'

const PermissionLayer = ({
  permissions,
  children,
  byGroup
}: {
  permissions: string[]
  children: React.ReactNode
  byGroup?: boolean
}) => {
  const { hasPermission, groups, ready } = useAuth()
  if (!ready) {
    return <Loading />
  }
  const hasAllPermissions =
    permissions.length > 0
      ? byGroup
        ? permissions.some((permission) => groups?.includes(permission))
        : permissions.every((permission) => hasPermission(permission))
      : true
  if (!hasAllPermissions) {
    return <Unauthorized />
  }

  return <>{children}</>
}

export { PermissionLayer }
