import currency from 'currency.js'

export function formatMoney(val: number, symbol = '$', precision = 3) {
  return currency(val, { symbol: `${symbol} `, precision: precision }).format() // "$1,234.56"
}
