import { getApiBase } from '@/config/enterprise'

// --- Tipos
export type DashboardSummary = {
  usersActive: number
  projects: number
  ticketsOpen: number
  uptime: number
}

export type SessionPoint = { day: string; sessions: number }

// --- Fetch helper
async function apiGET<T>(
  url: string,
  token: string,
  signal?: AbortSignal
): Promise<T> {
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    cache: 'no-store',
    signal
  })
  if (!res.ok) {
    const msg = await res.text().catch(() => '')
    throw new Error(msg || `Request failed: ${res.status}`)
  }
  return res.json() as Promise<T>
}

export async function getDashboardSummary(
  token: string,
  enterprise: string | null | undefined,
  signal?: AbortSignal
): Promise<DashboardSummary> {
  const base = getApiBase(enterprise)
  return apiGET<DashboardSummary>(`${base}dashboard/summary/`, token, signal)
}

export async function getDashboardSessions(
  token: string,
  enterprise: string | null | undefined,
  signal?: AbortSignal
): Promise<SessionPoint[]> {
  const base = getApiBase(enterprise)
  return apiGET<SessionPoint[]>(
    `${base}dashboard/sessions?range=7d`,
    token,
    signal
  )
}
