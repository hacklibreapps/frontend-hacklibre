import { useState, useEffect } from 'react'
import { CreditoState, Cuota } from '../xml/types'

type Params = {
  enabled: boolean
  total: number
  nroCuotas: number
}

export function useInvoiceCredito({ enabled, total, nroCuotas }: Params) {
  const [credito, setCredito] = useState<CreditoState | null>(null)

  useEffect(() => {
    if (!enabled || nroCuotas < 1) {
      setCredito(null)
      return
    }

    const base = total / nroCuotas
    const cuotas: Cuota[] = Array.from({ length: nroCuotas }).map((_, i) => ({
      nro: i + 1,
      fechaVencimiento: '',
      monto: Math.trunc(base * 1000) / 1000
    }))

    // Ajuste de la última cuota
    const sumaPrev = cuotas
      .slice(0, nroCuotas - 1)
      .reduce((a, c) => a + c.monto, 0)

    cuotas[nroCuotas - 1].monto = Math.trunc((total - sumaPrev) * 1000) / 1000

    setCredito({
      montoPendiente: total,
      cuotas
    })
  }, [enabled, total, nroCuotas])

  const updateCuotaFecha = (nro: number, fecha: string) => {
    setCredito((prev) =>
      prev
        ? {
            ...prev,
            cuotas: prev.cuotas.map((c) =>
              c.nro === nro ? { ...c, fechaVencimiento: fecha } : c
            )
          }
        : prev
    )
  }

  return {
    credito,
    setCredito,
    updateCuotaFecha
  }
}
