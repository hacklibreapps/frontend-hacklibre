import CotizacionesMod from '@/components/organism/auth/cotizaciones/cotizacionesMod'
import { PermissionLayer } from '@/context/permissioncontext'
import React from 'react'

export default function NuevaCotizacionPage() {
  return (
    <PermissionLayer permissions={['quotations.add_quotations']}>
      <CotizacionesMod />
    </PermissionLayer>
  )
}
