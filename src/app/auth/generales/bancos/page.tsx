import BancosManagement from '@/components/organism/auth/bancos/bancosManagement'
import { PermissionLayer } from '@/context/permissioncontext'

export default function BancosPage() {
  return (
    <PermissionLayer permissions={['main_data.view_banks']}>
      <BancosManagement />
    </PermissionLayer>
  )
}
