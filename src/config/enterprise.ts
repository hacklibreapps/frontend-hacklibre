// Mapea la “empresa” elegida a la URL base del backend.
// Si no defines variables específicas, usa NEXT_PUBLIC_API_URL como fallback.

export type EnterpriseKey = 'hacklibre' | 'caparazon'

const BASE_DEFAULT =
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8001/api/v1/'

const MAP: Record<EnterpriseKey, string> = {
  hacklibre: process.env.NEXT_PUBLIC_API_HACKLIBRE ?? BASE_DEFAULT,
  caparazon: process.env.NEXT_PUBLIC_API_CAPARAZON ?? BASE_DEFAULT
}

/** Devuelve la base del API para la empresa seleccionada. */
export function getApiBase(enterprise?: string | null): string {
  const key = (enterprise ?? 'hacklibre').toLowerCase() as EnterpriseKey
  return MAP[key] ?? BASE_DEFAULT
}
