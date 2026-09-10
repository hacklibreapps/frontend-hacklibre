import UnidadMedidaManagement from '@/components/organism/auth/unidadmedida/unidadMedidaManagement'
import { PermissionLayer } from '@/context/permissioncontext'

export default function UnidadMedidaPage() {
  return (
    <PermissionLayer permissions={['main_data.view_unidadmedida']}>
      <UnidadMedidaManagement />
    </PermissionLayer>
  )
}
