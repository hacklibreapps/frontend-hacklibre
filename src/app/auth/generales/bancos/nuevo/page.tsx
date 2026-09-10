'use client'

import BancosMod from '@/components/organism/auth/bancos/bancosMod'
import { PermissionLayer } from '@/context/permissioncontext'
import React from 'react'

export default function NuevoBancoPage() {
  return (
    <PermissionLayer permissions={['main_data.add_banks']}>
      <BancosMod />
    </PermissionLayer>
  )
}
