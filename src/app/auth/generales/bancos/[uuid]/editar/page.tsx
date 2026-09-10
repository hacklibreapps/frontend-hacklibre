import BancosMod from '@/components/organism/auth/bancos/bancosMod'
import { PermissionLayer } from '@/context/permissioncontext'

export default async function EditarBancoPage({
  params
}: {
  params: { uuid: string }
}) {
  const { uuid } = params
  return (
    <PermissionLayer permissions={['main_data.change_banks']}>
      <BancosMod uuid={uuid} />
    </PermissionLayer>
  )
}
