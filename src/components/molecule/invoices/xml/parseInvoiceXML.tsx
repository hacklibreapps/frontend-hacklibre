// src/components/molecule/invoices/xml/parseInvoiceXML.tsx

import { ParsedInvoiceXML } from './types'

/**
 * parseInvoiceXML
 * ----------------
 * Parsea un XML SUNAT (UBL 2.1) y lo convierte
 * en un objeto tipado ParsedInvoiceXML.
 *
 * ⚠️ IMPORTANTE:
 * Se usa getElementsByTagName para evitar problemas
 * con namespaces (cbc:, cac:) de SUNAT.
 */

function parseCustomerAddressFromXML(xml: Document): string {
  const text = (el?: Element | null) => el?.textContent?.trim() ?? ''

  const buyerAddress = xml
    .getElementsByTagName('cac:BuyerCustomerParty')[0]
    ?.getElementsByTagName('cac:RegistrationAddress')[0]

  const customerAddress = xml
    .getElementsByTagName('cac:AccountingCustomerParty')[0]
    ?.getElementsByTagName('cac:RegistrationAddress')[0]

  const addr = buyerAddress || customerAddress
  if (!addr) return ''

  const line = text(addr.getElementsByTagName('cbc:Line')[0])
  const district = text(addr.getElementsByTagName('cbc:District')[0])
  const city = text(addr.getElementsByTagName('cbc:CityName')[0])
  const region = text(addr.getElementsByTagName('cbc:CountrySubentity')[0])

  return [line, district, city, region].filter(Boolean).join(' - ')
}

export function parseInvoiceXML(xmlText: string): ParsedInvoiceXML {
  const parser = new DOMParser()
  const xml = parser.parseFromString(xmlText, 'application/xml')

  if (xml.getElementsByTagName('parsererror').length) {
    throw new Error('XML inválido')
  }

  const text = (el?: Element | null) => el?.textContent?.trim() ?? ''

  // ======================
  // DATOS GENERALES
  // ======================
  const invoiceNumber = text(xml.getElementsByTagName('cbc:ID')[0])

  const emissionDate = text(xml.getElementsByTagName('cbc:IssueDate')[0])

  const rawCurrency = text(
    xml.getElementsByTagName('cbc:DocumentCurrencyCode')[0]
  )

  const currency: 'PEN' | 'USD' = rawCurrency === 'USD' ? 'USD' : 'PEN'

  // ======================
  // CLIENTE
  // ======================
  const customerParty = xml.getElementsByTagName(
    'cac:AccountingCustomerParty'
  )[0]

  const customerRuc = text(customerParty?.getElementsByTagName('cbc:ID')[0])

  const customerName = text(
    customerParty?.getElementsByTagName('cbc:RegistrationName')[0]
  )

  const customerAddress = parseCustomerAddressFromXML(xml)

  const notes = Array.from(xml.getElementsByTagName('cbc:Note'))

  const observation = notes
    .filter((n) => !n.getAttribute('languageLocaleID'))
    .map((n) => n.textContent?.trim() ?? '')
    .join(' ')

  // ======================
  // TOTALES
  // ======================
  const opGravada =
    Number(
      text(
        xml
          .getElementsByTagName('cac:LegalMonetaryTotal')[0]
          ?.getElementsByTagName('cbc:LineExtensionAmount')[0]
      )
    ) || 0

  const igv = Number(text(xml.getElementsByTagName('cbc:TaxAmount')[0])) || 0

  const total =
    Number(text(xml.getElementsByTagName('cbc:PayableAmount')[0])) || 0

  // ======================
  // FORMA DE PAGO
  // ======================
  const paymentTerms = Array.from(xml.getElementsByTagName('cac:PaymentTerms'))

  const hasCredito = paymentTerms.some((pt) => {
    const id = text(pt.getElementsByTagName('cbc:ID')[0])
    const means = text(pt.getElementsByTagName('cbc:PaymentMeansID')[0])

    return id === 'FormaPago' && means.toLowerCase().includes('credito')
  })

  const formaPago: 'CONT' | 'CRED' = hasCredito ? 'CRED' : 'CONT'

  // ======================
  // DETRACCIÓN (SPOT)
  // ======================

  let detraccion: ParsedInvoiceXML['detraccion'] | undefined

  const detraccionTerms = Array.from(
    xml.getElementsByTagName('cac:PaymentTerms')
  ).find((pt) => text(pt.getElementsByTagName('cbc:ID')[0]) === 'Detraccion')

  if (detraccionTerms) {
    const amountEl = detraccionTerms.getElementsByTagName('cbc:Amount')[0]

    // 🔹 Buscar PaymentMeans asociado a detracción
    const detraccionMeans = Array.from(
      xml.getElementsByTagName('cac:PaymentMeans')
    ).find((pm) => text(pm.getElementsByTagName('cbc:ID')[0]) === 'Detraccion')

    const rawDetraccionCurrency =
      amountEl?.getAttribute('currencyID') === 'USD' ? 'USD' : 'PEN'

    detraccion = {
      codigo: text(
        detraccionTerms.getElementsByTagName('cbc:PaymentMeansID')[0]
      ),
      porcentaje: text(
        detraccionTerms.getElementsByTagName('cbc:PaymentPercent')[0]
      ),
      monto: text(amountEl),
      moneda: rawDetraccionCurrency, // ✅ ahora es 'PEN' | 'USD'
      medioPago: text(
        detraccionMeans?.getElementsByTagName('cbc:PaymentMeansCode')[0]
      ),
      cuenta: text(
        detraccionMeans
          ?.getElementsByTagName('cac:PayeeFinancialAccount')[0]
          ?.getElementsByTagName('cbc:ID')[0]
      )
    }
  }

  // ======================
  // ITEMS / DETALLE
  // ======================
  const items = Array.from(xml.getElementsByTagName('cac:InvoiceLine')).map(
    (line) => {
      const quantity =
        Number(text(line.getElementsByTagName('cbc:InvoicedQuantity')[0])) || 1

      const unit =
        line
          .getElementsByTagName('cbc:InvoicedQuantity')[0]
          ?.getAttribute('unitCode') || 'UNIDAD'

      const description = text(line.getElementsByTagName('cbc:Description')[0])

      // ✅ Precio SIN IGV
      const unitPrice =
        Number(
          text(
            line
              .getElementsByTagName('cac:Price')[0]
              ?.getElementsByTagName('cbc:PriceAmount')[0]
          )
        ) || 0

      return {
        quantity,
        unit,
        description,
        unitPrice
      }
    }
  )

  // ======================
  // CREDITO
  // ======================
  let credito: ParsedInvoiceXML['credito'] | undefined

  if (formaPago === 'CRED') {
    const paymentTerms = Array.from(
      xml.getElementsByTagName('cac:PaymentTerms')
    )

    const cuotas = paymentTerms
      .filter((pt) => {
        const id = text(pt.getElementsByTagName('cbc:ID')[0])
        const means = text(pt.getElementsByTagName('cbc:PaymentMeansID')[0])

        return id === 'FormaPago' && means.startsWith('Cuota')
      })
      .map((pt) => {
        const means = text(pt.getElementsByTagName('cbc:PaymentMeansID')[0])
        const nro = Number(means.replace('Cuota', '')) || 1

        return {
          nro,
          fechaVencimiento: text(
            pt.getElementsByTagName('cbc:PaymentDueDate')[0]
          ),
          monto: Number(text(pt.getElementsByTagName('cbc:Amount')[0])) || 0
        }
      })
      .sort((a, b) => a.nro - b.nro)

    const montoPendiente = cuotas.reduce((acc, c) => acc + c.monto, 0)

    credito = {
      montoPendiente,
      cuotas
    }
  }

  // ======================
  // RESULTADO FINAL
  // ======================
  return {
    invoiceNumber,
    emissionDate,
    currency,
    supplier: { ruc: '', name: '' },
    customer: {
      ruc: customerRuc,
      name: customerName,
      address: customerAddress
    },
    totals: { opGravada, igv, total },
    items,
    observation,
    detraccion,
    formaPago,
    credito
  }
}
