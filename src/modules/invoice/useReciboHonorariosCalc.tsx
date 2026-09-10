import { useMemo } from 'react'
import { Money, numeroALetrasEs } from './utils'

const RETENCION_RATE = 0.08

export function useReciboHonorariosCalc(
  montoBruto: number,
  money: Money,
  aplicaRetencion: boolean
) {
  return useMemo(() => {
    const bruto = Number(montoBruto) || 0

    let retencion = 0

    if (aplicaRetencion && bruto >= 1500) {
      retencion = bruto * RETENCION_RATE
    }

    const neto = bruto - retencion

    let enteros = Math.floor(neto)
    let centavos = Math.round((neto - enteros) * 100)

    if (centavos === 100) {
      enteros += 1
      centavos = 0
    }

    const monedaTxt = money === 'USD' ? 'DÓLARES AMERICANOS' : 'SOLES'

    const letras = `LA SUMA DE: ${numeroALetrasEs(enteros)} Y ${String(
      centavos
    ).padStart(2, '0')}/100 ${monedaTxt}`

    return { bruto, retencion, neto, letras }
  }, [montoBruto, money, aplicaRetencion])
}
