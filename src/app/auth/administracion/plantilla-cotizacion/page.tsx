import { EditQuotationTemplate } from "@/components/organism/auth/cotizaciones/quotationTemplate";
import { PermissionLayer } from "@/context/permissioncontext";

export default function PageAdministracionPaginaCotizacion() {
  return <PermissionLayer permissions={['clients.view_clients']}>
      <EditQuotationTemplate />
    </PermissionLayer>
}