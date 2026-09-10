// src/utils/clearOnFocus.ts

export const clearOnFocus = <T extends string | number>(
  value: T,
  clear: () => void
) => {
  if (value === '' || value === 0 || value === '0') {
    return
  }

  clear()
}
