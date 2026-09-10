import LayoutAdminItems from '@/components/atom/auth/admin/layoutAdminItems'

export default function ProductosLayout({
  children
}: {
  children: React.ReactNode
}) {
  return <LayoutAdminItems title='Tipo de Cambio'>{children}</LayoutAdminItems>
}
