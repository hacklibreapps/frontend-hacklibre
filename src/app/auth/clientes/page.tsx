import ClientesManagement from '@/components/organism/auth/clientes/clientesManagement'
import { PermissionLayer } from '@/context/permissioncontext'

export default function ClientePage() {
  return (
    <PermissionLayer permissions={['clients.view_clients']}>
      <ClientesManagement />
    </PermissionLayer>
  )
}
