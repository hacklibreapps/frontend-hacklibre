import CondicionesView from '@/components/organism/auth/condiciones/condicionesView'
import { PermissionLayer } from '@/context/permissioncontext'
import React from 'react'

export default async function ViewCondicionesPage({
  params
}: {
  params: Promise<{ uuid: string }>
}) {
  const { uuid } = await params
  return (
    <PermissionLayer permissions={['condicion.view_condicion']}>
    <CondicionesView uuid={uuid} />
    </PermissionLayer>
  )
}
