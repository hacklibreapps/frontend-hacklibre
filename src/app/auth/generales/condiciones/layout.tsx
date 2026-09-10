import LayoutAdminItems from '@/components/atom/auth/admin/layoutAdminItems'

export default function CondicionesLayout({
  children
}: {
  children: React.ReactNode
}) {
  return <LayoutAdminItems title='Condiciones'>{children}</LayoutAdminItems>
}
