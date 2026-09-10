import { MaskAsReadNotification } from '@/components/organism/auth/notifications/markAsReadNotifications'
import { PermissionLayer } from '@/context/permissioncontext'

export default async function NotificationsPage({
  params
}: {
  params: Promise<{ uuid: string }>
}) {
  const { uuid } = await params
  return (
    <PermissionLayer permissions={['main_data.view_notifications']}>
      <MaskAsReadNotification uuid={uuid} />
    </PermissionLayer>
  )
}
