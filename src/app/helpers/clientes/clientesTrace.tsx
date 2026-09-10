const TRACE = process.env.NEXT_PUBLIC_API_TRACE === '1'
type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE'

export const logReq = (
  m: HttpMethod,
  url: string,
  payload?: unknown,
  meta?: Record<string, unknown>
) => {
  if (!TRACE) return
  const ent =
    typeof window !== 'undefined' ? localStorage.getItem('enterprise') : null
  console.groupCollapsed(`[HTTP] ${m} ${url}`)
  if (meta) console.log('meta:', meta)
  console.log('enterprise:', ent)
  if (payload !== undefined) {
    const isFD = typeof FormData !== 'undefined' && payload instanceof FormData
    console.log('payload:', isFD ? '[FormData]' : payload)
  }
  console.groupEnd()
}

export const logRes = (
  m: HttpMethod,
  url: string,
  status: number,
  data: unknown
) => {
  if (!TRACE) return
  console.groupCollapsed(`[HTTP] ${m} ${url} → ${status}`)
  console.log('data:', data)
  console.groupEnd()
}

export const logErr = (
  m: HttpMethod,
  url: string,
  status: number,
  err: unknown
) => {
  if (!TRACE) return
  console.groupCollapsed(`[HTTP][ERR] ${m} ${url} → ${status}`)
  console.error(err)
  console.groupEnd()
}

export const isTraceEnabled = () => TRACE
export type { HttpMethod }
