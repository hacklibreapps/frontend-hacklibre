'use client'

import PerfilManagement from '@/components/organism/auth/perfil/perfilManagement'
// import { PermissionLayer } from '@/context/permissioncontext'

export default function PerfilPage() {
  return (
    // <PermissionLayer permissions={['customer.change_customuser']}>
    <PerfilManagement />
    // {/* </PermissionLayer> */}
  )
}
