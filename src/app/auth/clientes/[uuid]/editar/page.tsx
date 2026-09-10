import ClientesMod from '@/components/organism/auth/clientes/clienteMod'
import { PermissionLayer } from '@/context/permissioncontext'

export default async function EditarClientePage({
  params
}: {
  params: { uuid: string }
}) {
  const { uuid } = params
  return (
    <PermissionLayer permissions={['clients.change_clients']}>
      <ClientesMod uuid={uuid} />
    </PermissionLayer>
  )
}
