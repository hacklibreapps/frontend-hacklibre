import { CreditoState } from '@/components/molecule/invoices/xml/types'

export interface ClientesBodyInterface {
  complete_company_name: string // razon social
  company_name: string
  ruc: string
  highlighter: boolean
  client_logo?: File | string
  legal_image?: File | string
  legal_full_name: string
  legal_title: string
  order: number
  contacts: ContactBodyInterface[]
  status: boolean
  email: string
  address: string
}

export interface ContactBodyInterface {
  firstName: string
  lastName: string
  email: string
  principal: boolean
}

export interface MovimientoBancarioBodyInterface {
  currency: string // moneda del movimiento (ej. 'USD', 'PEN', etc.)
  egress: number
  income: number
  observation: string
  bank: string
  concept: string
  operation_date: string
  operation_number: string
  enterprise: string
  process_date: string
  description?: string | null // descripción opcional del movimiento

  // accountuuid: string // UUID de la cuenta bancaria origen/destino
  // reference?: string | null // referencia bancaria (opcional)
  // category?: string | null // categoría del movimiento (opcional, ej. ventas, compras, etc.)
  // reconciled: boolean // si el movimiento ha sido conciliado o no
  // invoiceuuid?: string | null // UUID de la factura asociada al movimiento (opcional)
}

export interface ProductosBodyInterface {
  // sku: string
  nombre: string
  descripcion: string
  unidad: string
  precio_unitario: number
  precio_venta: number
  incluye_igv: boolean
  gravado_igv: boolean
  igv_tasa: number
  estado: boolean
  moneda: string
}

export interface PerfilBodyInterface {
  first_name: string
  last_name: string
  email: string
  doc_type: string
  doc_number: string
  relation_enterprise: string // Relación con la empresa
  contract_enterprise: string
  photo?: File | null // Solo si se desea actualizar la foto
}

export interface PerfilChangePasswordBodyInterface {
  old_password: string
  new_password: string
  confirm_password: string
}

export interface BancosBodyInterface {
  name: string
}

export interface FacturaBodyInterface {
  invoice_serial_nr: string
  invoice_correlative_nr: string
  emition_date: string | null // ISO (yyyy-mm-dd)
  invoice_file?: string // URL o nombre en storage
  invoice_type: string
  payment_type: 'CONT' | 'CRED'
  has_delivery_address: boolean
  money: string // 'PEN' | 'USD'
  exchange_rate?: string // "3.75"
  cantidad_cuotas?: number
  due_date: string | null //fecha de vencimiento
  op_gravada?: string
  op_inafecta?: string
  op_exonerada?: string
  recargo_consumo?: string
  percepcion?: string
  detraccion?: string
  igv: string // monto IGV
  igv_rate?: string // "0.18"
  importe_total: string
  observation?: string

  
  rel_clients: string // uuid cliente al terminar de cargar el xml se hace llamado a la base de datos con una funcion,puede ser con el RUC
  address_clients?: string
  status: boolean // si el backend lo permite

  credito?: CreditoState | null
  /* === Información de la detracción === */
  leyenda_detraccion?: string // texto o código de la leyenda
  bien_servicio?: string // código de bien o servicio (ej. '037')
  medio_pago_detraccion?: string // código de medio de pago (ej. '001')
  nro_cta_bn?: string // número de cuenta Banco de la Nación
  porcentaje_detraccion?: string // porcentaje (ej. '12.00')
  monto_detraccion?: string // monto calculado
  total_neto_pagar?: string // total - detracción

  // tipo_pago: boolean
  // nro_cuota: string
}

export interface FacturaCompraItemInterface {
  cantidad: number
  unidad_medida: string
  descripcion: string
  valor_unitario: string
  icbper?: string
}

export interface FacturaCompraBodyInterface {
  empresa: string

  // === comprobante ===
  tipo_comprobante: 'FACTURA'
  serie: string
  numero: string
  fecha_emision: string | null
  fecha_vencimiento?: string | null
  forma_pago: 'CONTADO' | 'CREDITO'
  moneda: 'PEN' | 'USD' | 'EUR'

  // === emisor ===
  ruc_emisor: string
  razon_social_emisor: string
  direccion_emisor?: string

  // === receptor ===
  nro_doc_receptor?: string
  razon_social_receptor?: string
  direccion_receptor?: string

  ruc_receptor: string

  // === detalle ===
  items: FacturaCompraItemInterface[]

  // === totales ===
  subtotal: string
  descuentos?: string
  valor_venta: string
  igv: string
  icbper_total?: string
  otros_cargos?: string
  operaciones_gratuitas?: string
  importe_total: string
  importe_letras: string

  // === control ===
  estado?: 'registrada' | 'pagada' | 'anulada'
  archivo_adjunto?: File | null
  status?: boolean
}

export interface BoletaCompraBodyInterface {
  empresa: string // uuid empresa
  tipo_comprobante: string // 'BOLETA'
  serie: string // Serie (ej. B001)
  numero: string // Número correlativo
  dni_o_ruc_emisor: string // DNI o RUC del emisor
  nombre_emisor: string // Nombre o razón social del emisor
  fecha_emision: string | null // ISO
  moneda: 'PEN' | 'USD' | string
  importe_total: string // total
  gravado_base?: string // base imponible si aplica IGV
  igv?: string // monto IGV
  tipo_gasto?: string // clasificación interna
  centro_costo?: string // centro de costo si aplica
  archivo_adjunto?: string // archivo escaneado/PDF
  estado?: 'registrada' | 'pagada' | 'anulada'
  usuario_registro?: string // UUID usuario
  fecha_registro?: string // ISO
  status?: boolean
}
// FIN DE FACTURACION

export interface ReciboHonorariosBodyInterface {
  tipo_comprobante: 'RECIBO POR HONORARIOS'
  numero: string

  dni_ruc_emisor: string
  nombre_emisor: string
  direccion_emisor: string
  correo_emisor: string

  client: string
  recibi_de: string

  fecha_emision: string
  concepto: string
  observacion?: string | null

  inciso: string

  total_honorarios: number
  retencion_ir: number
  total_neto: number
  total_letras: string

  forma_pago: string
  empresa: string

  archivo_adjunto?: File | null
  status?: boolean
}

export interface CotizacionCondicionesInterface {
  condicion?: string | null
  titulo: string
  contenido: string
  por_defecto: boolean
  orden: number
  guardar_nuevo?: boolean
}

export interface CotizacionItemsInterface {
  producto?: string | null
  nombre: string
  descripcion: string
  cantidad: number
  precio_unitario: number
  descuento_pct?: number
  igv_pct: number
  orden: number
  subtotal: number
  igv: number
  total: number
  guardar_nuevo: boolean
  moneda: string
}

export interface CotizacionBodyInterface {
  quotation_nr: number
  quotation_version: number
  client: string
  contact: string
  subject: string
  reopen: boolean
  related_quotation?: string | null
  fecha_emision: string
  validez_dias: number
  tiempo_entrega_unidad: string
  tiempo_entrega: string
  forma_pago: string
  forma_pago_descripcion: string
  forma_pago_inicio?: number | null
  forma_pago_final?: number | null
  forma_pago_porcentaje: boolean
  moneda: string
  tipo_cambio: number
  subtotal: number
  total_igv: number
  total_descuento: number
  total: number
  status: string
  observations?: string | null
  items: CotizacionItemsInterface[]
  condiciones: CotizacionCondicionesInterface[]
}

export interface CondicionBodyInterface {
  titulo: string
  contenido: string
  estado: boolean
  por_defecto: boolean
}

export interface UnidadMedidaBodyInterface {
  // uuid: string
  name: string
  abbr: string
}
