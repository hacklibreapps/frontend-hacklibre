import ProductosMod from '@/components/organism/auth/productos/productosMod'
import { PermissionLayer } from '@/context/permissioncontext'
import React from 'react'

export default function NuevoProductosPage() {
  return (
    <PermissionLayer permissions={['productos.add_producto']}>
      <ProductosMod />
    </PermissionLayer>
  )
}
