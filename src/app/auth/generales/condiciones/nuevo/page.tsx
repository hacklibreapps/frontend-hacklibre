import CondicionesMod from '@/components/organism/auth/condiciones/condicionesMod'
import { PermissionLayer } from '@/context/permissioncontext'
import React from 'react'

export default function NuevaCondicionPage() {
  return (
    <PermissionLayer permissions={['condicion.add_condicion']}>
      <CondicionesMod />
    </PermissionLayer>
  )
}
