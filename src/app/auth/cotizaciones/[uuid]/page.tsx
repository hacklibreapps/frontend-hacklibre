import ContizacionesView from '@/components/organism/auth/cotizaciones/cotizacionesView'
import { PermissionLayer } from '@/context/permissioncontext'
import React from 'react'

export default async function ViewCotizacionPage({
  params
}: {
  params: Promise<{ uuid: string }>
}) {
  const { uuid } = await params
  return (
    <PermissionLayer permissions={['quotations.view_quotations']}>
      <ContizacionesView uuid={uuid} />
    </PermissionLayer>
  )
}
