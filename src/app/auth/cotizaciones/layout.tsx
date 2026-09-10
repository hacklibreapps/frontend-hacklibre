import LayoutAdminItems from '@/components/atom/auth/admin/layoutAdminItems'

export default function CotizacionesLayout({
  children
}: {
  children: React.ReactNode
}) {
  return <LayoutAdminItems title='Cotizaciones'>{children}</LayoutAdminItems>
}
