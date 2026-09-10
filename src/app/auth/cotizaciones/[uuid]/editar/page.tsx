import CotizacionesMod from '@/components/organism/auth/cotizaciones/cotizacionesMod'
import { PermissionLayer } from '@/context/permissioncontext'
import React from 'react'

export default function EditarcotizacionPage({
  params
}: {
  params: { uuid: string }
}) {
  const { uuid } = params

  return (
    <PermissionLayer permissions={['quotations.change_quotations']}>
      <CotizacionesMod uuid={uuid} />
    </PermissionLayer>
  )
}
