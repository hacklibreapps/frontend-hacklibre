export interface InvoiceClientInterface {
  uuid: string
  companyName: string | null
  completeCompanyName: string
  ruc: string
  clientType: 'client' | 'provider' | 'both'
  address: string | null
  email: string | null
  logo: string | null
}
export interface InvoiceEnterpriseInterface {
  uuid: string
  name: string
  comercialName: string | null
  ruc: string
  logo: string | null
  address: string | null

  departamento: string | null
  provincia: string | null
  distrito: string | null

  detractionAccount: string | null
  detractionPercent: number | null
}
export interface InvoiceMoneyInterface {
  uuid: string
  name: string
  pluralName: string
  currency: string
  sign: string
}
export interface InvoiceExchangeRateInterface {
  uuid: string
  fecha: string
  compra: number
  venta: number
  fuente: string
}
export interface InvoiceMeasurementUnitInterface {
  uuid: string
  name: string
  abbr: string
}
export interface InvoiceInstallmentInterface {
  id: number
  installmentNumber: number
  dueDate: string
  amount: string
  status: string
  statusDisplay: string
  notes: string | null
}
export interface InvoiceDocumentInterface {
  uuid: string
  title: string
  documentUrl: string
}
export interface InvoicePaymentInterface {
  id: number
  installmentNumber: number | null
  amount: string
  paymentDate: string
  paymentMethod: string
  paymentMethodDisplay: string
  reference: string | null
}
export interface InvoiceItemInterface {
  uuid: string

  isGood: boolean
  freeService: boolean

  code: string
  description: string
  quantity: string

  measurementUnit: InvoiceMeasurementUnitInterface | null

  unitValue: string
  discount: string
  isc: string

  igvImpactType: string
  igvImpactTypeDisplay: string

  igvPercent: string
  igvValue: string

  unitPrice: string
  subtotalPrice: string
  totalPrice: string

  observations: string | null
}
export interface InvoiceRetrieveInterface {
  uuid: string

  invoiceNumber: string
  invoiceSerialNr: string
  invoiceCorrelativeNr: string
  emitionDate: string

  invoiceType: 'sales' | 'buys' | 'buys_fee_recipt'
  invoiceTypeDisplay: string

  paymentType: 'CONT' | 'CRED' | null
  paymentTypeDisplay: string | null

  hasDeliveryAddress: boolean

  client: InvoiceClientInterface | null
  enterprise: InvoiceEnterpriseInterface | null

  moneyData: InvoiceMoneyInterface | null
  exchangeRateData: InvoiceExchangeRateInterface | null

  cantidadCuotas: number

  // Recibo por honorarios
  tipoRentaCuarta: string | null
  tipoRentaCuartaDisplay: string | null
  rentaCuarta: boolean
  reciboPagado: boolean
  formaPagoRecibo: string | null
  formaPagoReciboDisplay: string | null
  impuestoRenta8: string

  // Totales
  subTotal: string
  anticipos: string
  descuentos: string
  valorVenta: string
  isc: string
  igv: string
  icbper: string
  otrosCargos: string
  otrosTributos: string
  montoDelRedondeo: string
  importeTotal: string

  // Detracción
  hasDetraccion: boolean
  medioPagoDetraccion: string
  medioPagoDetraccionDisplay: string
  legend: string | null
  legendDisplay: string | null
  bienServicio: string | null
  bienServicioDisplay: string | null
  detraccionPercent: string | null
  detraccionAmount: string

  // Otros
  observations: string | null
  qtnRelated: string | number | null

  // Estado
  status: string
  statusDisplay: string

  // SUNAT
  sunatTicket: string | null
  sunatStatus: string | null
  sunatResponseCode: string | null
  hashCode: string | null
  qrCodeUrl: string | null
  sunatCdrUrl: string | null

  // Relaciones
  items: InvoiceItemInterface[]
  installments: InvoiceInstallmentInterface[]
  payments: InvoicePaymentInterface[]
  documents: InvoiceDocumentInterface[]

  created: string
  updated: string
}
