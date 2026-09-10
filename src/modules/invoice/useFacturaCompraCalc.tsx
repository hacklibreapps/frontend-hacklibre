import { useMemo } from 'react'
import { FacturaCompraItemInterface } from '@/interfaces/structures/bodyFormInterface'
import { numeroALetrasEs } from './utils'

const IGV_RATE = 0.18

export function useFacturaCompraCalc(
  items: FacturaCompraItemInterface[],
  moneda: 'PEN' | 'USD'
) {
  return useMemo(() => {
    const base = items.reduce((acc, it) => {
      const cantidad = Number(it.cantidad) || 0
      const valor = Number(it.valor_unitario) || 0
      return acc + cantidad * valor
    }, 0)

    const igv = Math.round(base * IGV_RATE * 100) / 100

    const icbper = items.reduce((acc, it) => {
      const cantidad = Number(it.cantidad) || 0
      const icbperUnit = Number(it.icbper) || 0
      return acc + cantidad * icbperUnit
    }, 0)

    const total = Math.round((base + igv + icbper) * 100) / 100

    /* ===== Letras ===== */
    const enteros = Math.trunc(total)
    const centavos = Math.round((total - enteros) * 100)

    const monedaTxt = moneda === 'USD' ? 'DÓLARES AMERICANOS' : 'NUEVOS SOLES'

    const letras = `SON ${numeroALetrasEs(enteros)} Y ${String(
      centavos
    ).padStart(2, '0')}/100 ${monedaTxt}`

    return {
      base,
      igv,
      icbper,
      total,
      letras
    }
  }, [items, moneda])
}
