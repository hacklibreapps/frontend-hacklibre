import UnidadMedidaMod from '@/components/organism/auth/unidadmedida/unidadMedidaMod'
import { PermissionLayer } from '@/context/permissioncontext'
import React from 'react'

export default function NuevaUnidadMedidaPage() {
  return (
    <PermissionLayer permissions={['main_data.add_unidadmedida']}>
      <UnidadMedidaMod />
    </PermissionLayer>
  )
}
