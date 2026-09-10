import CondicionesManagement from '@/components/organism/auth/condiciones/condicionesManagement'
import { PermissionLayer } from '@/context/permissioncontext'

export default function CondicionesPage() {
  return (
    <PermissionLayer permissions={['condicion.view_condicion']}>
      <CondicionesManagement />
    </PermissionLayer>
  )
}
