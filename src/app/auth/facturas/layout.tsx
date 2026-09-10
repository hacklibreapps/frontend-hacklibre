import LayoutAdminItems from '@/components/atom/auth/admin/layoutAdminItems'

export default function FacturasLayout({
  children
}: {
  children: React.ReactNode
}) {
  return <LayoutAdminItems title='Facturas'>{children}</LayoutAdminItems>
}
