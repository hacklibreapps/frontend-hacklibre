import LayoutAdminItems from '@/components/atom/auth/admin/layoutAdminItems'

export default function ClienteLayout({
  children
}: {
  children: React.ReactNode
}) {
  return <LayoutAdminItems title='Clientes'>{children}</LayoutAdminItems>
}
