// src/components/molecule/invoices/hooks/useInvoiceFormState.ts

import { useState } from 'react'

export type CurrencyType = 'PEN' | 'USD'
export type PaymentType = 'CONTADO' | 'CREDITO'

/**
 * useInvoiceFormState
 * -------------------
 * Estado central para campos controlados del formulario
 * que pueden venir del XML o ser editados manualmente.
 */
export function useInvoiceFormState() {
  const [currency, setCurrency] = useState<CurrencyType>('PEN')
  const [paymentType, setPaymentType] = useState<PaymentType>('CONTADO')
  const [observation, setObservation] = useState('')

  return {
    // state
    currency,
    paymentType,
    observation,

    // setters
    setCurrency,
    setPaymentType,
    setObservation
  }
}
