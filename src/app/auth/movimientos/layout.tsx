import LayoutAdminItems from '@/components/atom/auth/admin/layoutAdminItems'

export default function MovimientoBancariosLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <LayoutAdminItems title='Movimiento Bancario'>{children}</LayoutAdminItems>
  )
}
