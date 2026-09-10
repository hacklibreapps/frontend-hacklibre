import LayoutAdminItems from '@/components/atom/auth/admin/layoutAdminItems'

export default function UnidadMedidaLayout({
  children
}: {
  children: React.ReactNode
}) {
  return <LayoutAdminItems title='Unidad de Medida'>{children}</LayoutAdminItems>
}
