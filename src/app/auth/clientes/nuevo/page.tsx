'use client'

import ClientesMod from '@/components/organism/auth/clientes/clienteMod'
import { PermissionLayer } from '@/context/permissioncontext'
import React from 'react'

export default function NuevoClientePage() {
  return (
    <PermissionLayer permissions={['clients.add_clients']}>
      <ClientesMod />
    </PermissionLayer>
  )
}
