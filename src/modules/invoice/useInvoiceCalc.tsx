// src/modules/invoice/useInvoiceCalc.ts
import { useMemo } from 'react'
import { IGV_RATE, ItemRow, Money, numeroALetrasEs } from './utils'

export function useInvoiceCalc(
  items: ItemRow[],
  money: Money,
  tc: number,
  igvRate: number = IGV_RATE
) {
  return useMemo(() => {
    const base = items.reduce(
      (acc, it) =>
        acc + (Number(it.quantity) || 0) * (Number(it.unitPrice) || 0),
      0
    )
    const igv = base * igvRate
    const total = base + igv

    const totalPEN = money === 'PEN' ? total : tc > 0 ? total * tc : 0
    const totalUSD = money === 'USD' ? total : tc > 0 ? total / tc : 0

    const total2 = Math.round(total * 100) / 100

    const enteros = Math.trunc(total2)
    const centavos = Math.round((total2 - enteros) * 100)

    const monedaTxt = money === 'USD' ? 'DÓLARES AMERICANOS' : 'NUEVOS SOLES'
    const letras = `SON ${numeroALetrasEs(enteros)} Y ${String(
      centavos
    ).padStart(2, '0')}/100 ${monedaTxt}`

    return { base, igv, total, totalPEN, totalUSD, letras }
  }, [items, money, tc, igvRate])
}
