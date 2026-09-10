/**
 * Tipos base para facturas SUNAT (UBL 2.1)
 * Usados por parseInvoiceXML y mapInvoiceToForm
 */

export type DetraccionXML = {
  codigo: string // ej: 037
  porcentaje: string // ej: 12.00
  monto: string // ej: 1245.00
  moneda?: 'PEN' | 'USD'
  medioPago: string // ej: 001
  cuenta: string // ej: 00030096967
}

export type ParsedInvoiceXML = {
  invoiceNumber: string
  emissionDate: string
  currency: 'PEN' | 'USD'

  supplier: {
    ruc: string
    name: string
  }

  customer: {
    ruc: string
    name: string
    address: string
  }

  totals: {
    opGravada: number
    igv: number
    total: number
  }

  items: Array<{
    quantity: number
    unit: string
    description: string
    unitPrice: number
  }>

  observation: string

  detraccion?: {
    codigo: string
    porcentaje?: string
    monto?: string
    moneda?: 'PEN' | 'USD'
    medioPago?: string
    cuenta?: string
  }

  /**
   * Forma de pago según XML SUNAT
   * (se mantiene por trazabilidad)
   */
  formaPago: 'CONT' | 'CRED'

  /**
   * Información de crédito si aplica
   */
  credito?: CreditoState
}

// ======================
// CRÉDITO / CUOTAS
// ======================

export type Cuota = {
  nro: number
  fechaVencimiento: string // yyyy-mm-dd
  monto: number
}

export type CreditoState = {
  montoPendiente: number
  cuotas: Cuota[]
}
