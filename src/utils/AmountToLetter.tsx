import writtenNumber from 'written-number'

export const amountToLetters = (
  amount: string | number,
  currency = 'SOLES'
) => {
  const value = Number(amount)

  const integer = Math.floor(value)
  const decimals = Math.round((value - integer) * 100)

  const letters = writtenNumber(integer, {
    lang: 'es'
  }).toUpperCase()

  return `${letters} Y ${decimals
    .toString()
    .padStart(2, '0')}/100 ${currency}`
}
