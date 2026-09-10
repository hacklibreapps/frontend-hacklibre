import ProductosManagement from '@/components/organism/auth/productos/productosManagement'
import { PermissionLayer } from '@/context/permissioncontext'

export default function ProductosPage() {
  return (
    <PermissionLayer permissions={['productos.view_producto']}>
      <ProductosManagement />
    </PermissionLayer>
  )
}
