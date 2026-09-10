// src/modules/invoice/utils.ts
export const IGV_RATE = 0.18 as const
export type Money = 'PEN' | 'USD'
export type CompanyKey = 'HACKLIBRE' | 'CAPARAZON'

export type ItemRow = {
  id: string
  quantity: number
  unit: string
  code: string
  description: string
  unitPrice: number
}

export const uid = () =>
  `row-${Date.now()}-${Math.random().toString(16).slice(2)}`
export const parseNum = (v: string | number) =>
  typeof v === 'number' ? v : Number(String(v).replace(',', '.').trim()) || 0
export const fix2 = (n: number) => (Number.isFinite(n) ? n : 0).toFixed(2)

export const toISODate = (d: Date) => d.toISOString().slice(0, 10) // yyyy-mm-dd
export const isoToDMY = (iso?: string | null) => {
  if (!iso) return null
  const [y, m, d] = iso.split('-')
  return `${d}/${m}/${y}`
}
export const moneySymbol = (m: Money) => (m === 'USD' ? 'US$' : 'S/.')

// ===== Número a letras muy básico (ES-PE) =====
export function numeroALetrasEs(n: number) {
  n = Math.floor(n)
  if (n === 0) return 'CERO'
  const u = [
    '',
    'UNO',
    'DOS',
    'TRES',
    'CUATRO',
    'CINCO',
    'SEIS',
    'SIETE',
    'OCHO',
    'NUEVE',
    'DIEZ',
    'ONCE',
    'DOCE',
    'TRECE',
    'CATORCE',
    'QUINCE',
    'DIECISÉIS',
    'DIECISIETE',
    'DIECIOCHO',
    'DIECINUEVE'
  ]
  const d = [
    '',
    '',
    'VEINTE',
    'TREINTA',
    'CUARENTA',
    'CINCUENTA',
    'SESENTA',
    'SETENTA',
    'OCHENTA',
    'NOVENTA'
  ]
  const c = [
    '',
    'CIEN',
    'DOSCIENTOS',
    'TRESCIENTOS',
    'CUATROCIENTOS',
    'QUINIENTOS',
    'SEISCIENTOS',
    'SETECIENTOS',
    'OCHOCIENTOS',
    'NOVECIENTOS'
  ]

  const decenas = (num: number) => {
    if (num < 20) return u[num]
    if (num < 30)
      return num === 20 ? 'VEINTE' : 'VEINTI' + u[num - 20]
    const dd = Math.floor(num / 10),
      uu = num % 10
    return dd ? d[dd] + (uu ? ' Y ' + u[uu] : '') : u[uu]
  }
  const centenas = (num: number) => {
    if (num < 100) return decenas(num)
    if (num === 100) return 'CIEN'
    const cc = Math.floor(num / 100),
      rr = num % 100
    return (c[cc] + (rr ? ' ' + decenas(rr) : '')).replace('UNO MIL', 'MIL')
  }
  const seccion = (
    num: number,
    divisor: number,
    singular: string,
    plural: string
  ) => {
    const cant = Math.floor(num / divisor)
    const resto = num - cant * divisor
    let txt = ''
    if (cant > 0)
      txt = cant === 1 ? singular : numeroALetrasEs(cant) + ' ' + plural
    return { texto: txt, resto }
  }

  let resultado = ''
  let num = n

  let s = seccion(num, 1_000_000_000, 'MIL MILLONES', 'MIL MILLONES')
  num = s.resto
  if (s.texto) resultado += s.texto + ' '
  s = seccion(num, 1_000_000, 'UN MILLÓN', 'MILLONES')
  num = s.resto
  if (s.texto) resultado += s.texto + ' '
  s = seccion(num, 1_000, 'MIL', 'MIL')
  num = s.resto
  if (s.texto) resultado += s.texto + ' '
  if (num > 0) resultado += centenas(num)

  return resultado.trim().replace(/\s+/g, ' ')
}

export const COMPANIES: Record<
  CompanyKey,
  {
    legalName: string
    commercialName: string
    address: string
    city: string
    ruc: string
  }
> = {
  HACKLIBRE: {
    legalName: 'HACKLIBRE E.I.R.L.',
    commercialName: 'Hacklibre Soluciones',
    address: 'Jr. Ancash Nro. 3432',
    city: 'San Martin de Porres - Lima - Perú',
    ruc: '20604175446'
  },
  CAPARAZON: {
    legalName: 'CAPARAZON E.I.R.L.',
    commercialName: 'Caparazón Soluciones',
    address: 'Calle Enrique Góngora Nro. 183',
    city: 'San Martin de Porres - Lima - Perú',
    ruc: '20613495810'
  }
}
