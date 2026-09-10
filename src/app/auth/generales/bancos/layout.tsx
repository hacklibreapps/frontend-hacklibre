import LayoutAdminItems from '@/components/atom/auth/admin/layoutAdminItems'

export default function BancosLayout({
  children
}: {
  children: React.ReactNode
}) {
  return <LayoutAdminItems title='Bancos'>{children}</LayoutAdminItems>
}
