import TipoCambioManagement from '@/components/organism/auth/tipocambio/tipoCambio'
import { PermissionLayer } from '@/context/permissioncontext'

export default function TipoCambioPage() {
  return (
     <PermissionLayer permissions={['main_data.view_dollarexchange']}>
  <TipoCambioManagement />
</PermissionLayer>
)
}


//