import { ViewReceipt } from '@/components/organism/receipt/viewReceipt'
// import { PermissionLayer } from '@/context/permissioncontext'

export default async function ViewComprobante({
  params
}: {
  params: { uuid: string }
}) {
  const { uuid } = params
  return (
    // <PermissionLayer permissions={['clients.change_clients']}>
      <ViewReceipt uuid={uuid} />
    // </PermissionLayer>
  )
}
