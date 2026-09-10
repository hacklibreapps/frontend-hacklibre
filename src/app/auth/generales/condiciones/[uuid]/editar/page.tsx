import CondicionesMod from '@/components/organism/auth/condiciones/condicionesMod'
import { PermissionLayer } from '@/context/permissioncontext'
import React from 'react'

export default async function EditarCondicionesPage({
  params
}: {
  params: { uuid: string }
}) {
  const { uuid } = params
  return (
    <PermissionLayer permissions={['condicion.change_condicion']}>
      <CondicionesMod uuid={uuid} />
    </PermissionLayer>
  )
}
