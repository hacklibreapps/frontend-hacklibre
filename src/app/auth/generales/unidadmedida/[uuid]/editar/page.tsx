import UnidadMedidaMod from '@/components/organism/auth/unidadmedida/unidadMedidaMod'
import { PermissionLayer } from '@/context/permissioncontext'
import React from 'react'

export default async function EditarUnidadMedidaPage({
  params
}: {
  params: { uuid: string }
}) {
  const { uuid } = params
  return (
    <PermissionLayer permissions={['main_data.change_unidadmedida']}>
      <UnidadMedidaMod uuid={uuid} />
    </PermissionLayer>
  )
}
