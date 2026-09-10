import ProductosMod from '@/components/organism/auth/productos/productosMod'
import { PermissionLayer } from '@/context/permissioncontext'
import React from 'react'

export default async function EditarProductoPage({
  params
}: {
  params: { uuid: string }
}) {
  const { uuid } = params
  return (
    <PermissionLayer permissions={['productos.change_producto']}>
      <ProductosMod uuid={uuid} />
    </PermissionLayer>
  )
}
