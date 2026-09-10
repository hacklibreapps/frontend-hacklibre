import MovimientoBancarioManagement from '@/components/organism/auth/movimientobancario/movimientoBancarioManagement'
// import { PermissionLayer } from '@/context/permissioncontext'

export default function MovimientoBancarioPage() {
  return (
    // <PermissionLayer permissions={['quotations.view_quotations']}>
    <MovimientoBancarioManagement />
    // </PermissionLayer>
  )
}
