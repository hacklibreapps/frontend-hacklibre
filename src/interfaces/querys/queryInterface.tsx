import { ReactNode } from 'react'
import { KeyValueInterface } from '../structures/keyValueInterface'

/* ====== CLIENTES ====== */
export interface ContactInterface {
  uuid: string
  firstName: string
  lastName: string
  fullName: string
  email: string
  principal: boolean
  status: boolean
}

export interface ContactTempInterface {
  firstName: string
  lastName: string
  email: string
  principal: boolean
}

export interface ClienteInterface {
  uuid: string
  companyName: string
  completeCompanyName: string
  ruc: string
  clientLogo: string // <- URL o path que te devuelve el backend
  highlighter: boolean
  address: string
  legalImage: string // <- URL o path
  legalFullName: string
  legalTitle: string
  order: number
  contacts: string[]
  status: boolean
  email: string
}

export interface ClienteRetrieveInterface {
  uuid: string
  companyType: string
  companyName: string
  completeCompanyName: string // razon social
  ruc: string
  clientLogo: string
  highlighter: boolean //Para la web
  address: string
  legalImage: string
  legalFullName: string
  legalTitle: string
  order: number
  contacts: ContactInterface[]
  status: boolean
  email: string
  direccion: string
}

/* ====== Ítems de documento (compartuuidos por cotización/factura) ====== */

export interface LineaItemInterface {
  uuid?: string // opcional para PATCH
  productuuid?: string | null
  description: string
  quantity: number // 1..N
  unitPrice: number // sin impuestos
  discount?: number // 0..1 (ej. 0.1 = 10%)
  taxRate?: number // 0..1 (IGV 0.18)
  total: number // calculado en BE (quantity * unitPrice - desc + tax)
}

/* ====== COTIZACIONES ====== */

export interface CondicionesCotizacionEditInterface {
  uuid: string
  condicion?: KeyValueInterface | null
  titulo: string
  contenido: string
  orden: number
  visible: boolean
}

export interface ItemsCotizacionEditInterface {
  uuid: string
  producto?: KeyValueInterface | null
  descripcion: string
  cantidad: number
  precioUnitario: number
  descuentoPct: number
  igvPct: number
  moneda: {
    key: string
    value: string
  }
  orden: number
  subtotal: number
  igv: number
  total: number
}
export interface CotizacionEditInterface {
  uuid: string
  quotationNr: number
  quotationVersion: number
  client: KeyValueInterface
  contact?: KeyValueInterface | null
  subject: string
  fechaEmision: string
  tiempoEntrega: number
  tiempoEntregaUnidad: KeyValueInterface
  formaPagoInicio: number
  formaPagoFinal: number
  formaPago: KeyValueInterface
  formaPagoPorcentaje: false
  moneda: KeyValueInterface
  tipoCambio: number
  subtotal: number
  totalIgv: number
  totalDescuento: number
  total: number
  status: KeyValueInterface
  observations?: string | null
  items: ItemsCotizacionEditInterface[]
  condiciones: CondicionesCotizacionEditInterface[]
}

export interface CotizacionInterface {
  uuid: string
  cotizacion: string
  client: string
  contact: string
  subject: string
  fechaEmision: string
  fechaCaducidad: string

  tiempoEntrega: { key: string; value: string } | null
  formaPagoInicio: { key: string; value: string } | null
  formaPagoFinal: { key: string; value: string } | null

  moneda: string
  tipoCambio: string
  subtotal: number
  totalIgv: string
  totalDescuento: string
  total: number
  status: KeyValueInterface
  observations: string

  productos: ProductosInterface[]
  versions?: CotizacionInterface[]
}

export interface TemplatesQuotationInterface {
  html: string
}

export interface QuotationTemplateInterface {
  uuid: string
  titulo: string
  contenido: string
}

export interface CondicionInterface {
  uuid: string
  titulo: string
  slug: string
  contenido: string
  estado: boolean
  porDefecto: boolean
  creadoEn: string
  actualizadoEn: string
}

export interface UnidadMedidaInterface {
  uuid: string
  name: string
  abbr: string
}

/* ======Bancos ====== */
export interface BancoInterface {
  uuid: string
  name: string
}
/* ====== FACTURAS ====== */

export interface FacturaInterface {
  client: string
  uuid: string
  number: string // p.ej. FAC-000123
  issueDate: string // ISO
  dueDate?: string // ISO
  clientId: string // (antes client) -> usa UUID o id
  currency: string
  status: boolean // (antes boolean)
  subtotal: number
  tax: number // IGV total
  total: number
  notes?: string | null

  // Opcionales comunes en Perú
  opGravada?: number
  opInafecta?: number
  opExonerada?: number
  recargoConsumo?: number
  percepcion?: number
  detraccion?: number
  igvRate?: number // ej. 0.18
  exchangeRateUSD?: number

  invoiceType?: string
  fileUrl?: string | null

  items: LineaItemInterface[]
}

export interface FacturacionInterface {
  uuid: string // ID único universal
  number: string // Ej: FAC-000123
  client: string // Nombre del cliente o proveedor
  clientId: string // UUID o id relacional
  issueDate: string // Fecha de emisión (ISO)
  dueDate?: string // Fecha de vencimiento (ISO, opcional)

  currency: string // Ej: "PEN" | "USD"
  status: boolean // true=Activa, false=Anulada
  tipo: boolean // ⚠️ revisar (ver detalle abajo)

  subtotal: number // Monto sin IGV
  tax: number // IGV total
  total: number // Total a pagar

  notes?: string | null // Observaciones
  fileUrl?: string | null // Enlace al PDF/XML
  invoiceType?: string // Ej: "factura_venta", "boleta_compra", etc.

  // ===== Opcionales Perú =====
  opGravada?: number
  opInafecta?: number
  opExonerada?: number
  recargoConsumo?: number
  percepcion?: number
  detraccion?: number
  igvRate?: number // Ej: 0.18
  exchangeRateUSD?: number // Tipo de cambio

  items: LineaItemInterface[] // Detalle de ítems
}

export interface FacturaCompraInterface {
  uuid: string
  serie: string
  numero: string
  fecha_emision: string
  razon_social_emisor: string
  ruc_emisor: string
  moneda: string
  importe_total: string
  estado: 'registrada' | 'pagada' | 'anulada'
  archivo_adjunto?: string
  created_at: string
}

export interface ReciboPorHonorariosInterface {
  uuid: string
  client: KeyValueInterface
  // Identificación
  tipo_comprobante: 'RECIBO POR HONORARIOS'
  serie: string
  numero: string

  // Profesional
  dniRucEmisor: string
  nombreEmisor: string

  // Empresa pagadora
  empresa: string
  empresaNombre?: string
  empresaRuc?: string
  empresaDireccion?: string

  // Fechas
  fechaEmision: string
  fechaPago?: string | null
  fechaRegistro: string

  // Servicio
  descripcion_servicio: string
  observacion?: string | null
  inciso: string

  // Importes
  montoBruto: number
  montoRetencion: number
  montoNeto: number
  moneda: KeyValueInterface

  // Pago
  formaPago: KeyValueInterface

  // Adjuntos
  archivoAdjunto?: string | null

  // Auditoría
  usuarioRegistro: string
  status: boolean
}

/* ====== MOVIMIENTOS BANCARIOS ====== */

export interface MovimientoBancarioInterface {
  uuid: string
  date: string
  type: { key: string; value: string } | string // ingreso/egreso/transferencia
  bank: string
  concept: string
  operationNumber: string
  operationDate: string
  processDate: string
  currency: string
  income: number
  egress: number
  amount: number
  observation?: string
  reconciled: boolean
  reference?: string | null // ref bancaria
  accountuuid: string // cuenta bancaria origen/destino
  enterprise: string

  // category?: string | null // etiqueta (ventas, compras, fees…)
  //   description?: string | null
  //   invoiceuuid?: string | null // si vincula a factura
  // mentConcept: string
}

/* ====== Dashboards / KPIs (opcional de apoyo) ====== */

export interface KpiResumenInterface {
  totalClientes: number
  facturasPendientes: number
  montoPorCobrar: number
  ingresosMes: number
  egresosMes: number
}

export interface MoneyInterface {
  currency: string
  moneyName: string
  sign: string
  uuid: string
}

export interface ExchangeByMoneyInterface {
  fecha?: string
  compra?: string
  venta: string
  capturadoEn?: string
  fuente?: string
  notas?: string
  currency: string
  simbol: string
}

export interface ProductosInterface {
  uuid: string
  // sku: string
  nombre: string
  descripcion: string
  unidad: { key: string; value: string } | null
  precioUnitario: number
  precioVenta: number
  incluyeIgv: boolean
  gravadoIgv: boolean
  igvTasa: number
  moneda: { key: string; value: string } | null
  // precio_unitario: number
  // gravado_igv: boolean
  // igv_tasa: number
  estado: boolean
}

// export interface PerfilInterface {
//   uuid: string
//   firstName: string
//   lastName: string
//   email: string
//   photo?: string | null
//   docType: string
//   docNumber: string
//   relationEnterprise: string[] // va ser una lista y saber los permisos que tienes
//   contractEnterprise: string
// }

export interface Empresa {
  razonSocial: string
  ruc: string
  uuid: string
}

export interface PerfilInterface {
  uuid: string
  firstName: string
  lastName: string
  email: string
  photo?: string | null
  docType: string
  docNumber: string
  empresas: Empresa[] // Cambiado de string[] a un arreglo de objetos 'Empresa'
  contractEnterprise: KeyValueInterface
  isSuperuser: boolean
  isActive: boolean
  dateJoined: string
  lastLogin: string
  groups: string[] // Dependiendo de lo que esperas que contenga este campo
  userPermissions: string[] // Similar al campo 'groups'
}

export interface TipoCambioInterface {
  uuid: string
  fecha: string
  compra: number
  venta: number
  capturadoEn: string
  fuente: string
  nota: string
}

export interface TipoCambioDiaInterface {
  uuid: string
  fecha: string
  compra: number
  venta: number
  fuente: string
  capturadoEn: string
  nota?: string
}

export type ModalSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl'

export interface ModalInterface {
  size: ModalSize
  dialogText: ReactNode
}

export interface NotFoundInterface {
  message: { detail: string }
  status: number
}
