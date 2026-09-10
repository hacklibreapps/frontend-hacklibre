import CotizacionesManagement from '@/components/organism/auth/cotizaciones/cotizacionesManagement'
import { PermissionLayer } from '@/context/permissioncontext'

export default function CotizacionesPage() {
  return (
    <PermissionLayer permissions={['quotations.view_quotations']}>
      <CotizacionesManagement />
    </PermissionLayer>
  )
}
