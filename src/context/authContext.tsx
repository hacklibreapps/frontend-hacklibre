'use client'

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
  ReactNode
} from 'react'

/** === Tipos === */
export type Enterprise = {
  uuid: string
  name: string
  logo: string
  icon: string
  detractionAccount: string
  detractionPercent: number
  ruc: string
}

type AuthContextType = {
  token: string | null
  enterprise: string | null
  enterpriseName: string | null
  enterpriseLogo: string | null
  enterpriseIcon: string | null
  //  enterpriseAddress: string | null
  detractionAccount: string | null
  detractionPercent: number | null
  ruc: string | null
  enterprises: Enterprise[]

  /** NUEVO: seguridad */
  permissions: string[]
  groups: string[]
  ready: boolean
  setEnterpriseList: (list: Enterprise[], activeId?: string) => void
  selectEnterprise: (id: string) => void

  /** <- ahora recibe permissions y groups */
  login: (
    token: string,
    enterprise: string,
    enterpriseName: string,
    enterpriseLogo: string,
    enterpriseIcon: string,
    detractionAccount: string,
    detractionPercent: number,
    ruc: string,
    permissions: string[],
    groups?: string[]
  ) => void
  logout: () => void
  isAuthenticated: () => boolean
  hasPermission: (permission: string) => boolean
  /** si alguna permission contiene el substring (o coincide si pasas varias) */
  hasAnyPermission: (needle: string | string[]) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

/** === Helpers LocalStorage === */
function safeParseEnterprises(json: string | null): Enterprise[] {
  if (!json) return []
  try {
    const arr = JSON.parse(json)

    return Array.isArray(arr)
      ? arr.filter(
          (x) => x && typeof x.uuid === 'string' && typeof x.name === 'string'
        )
      : []
  } catch {
    return []
  }
}
function safeParseStringArray(json: string | null): string[] {
  if (!json) return []
  try {
    const arr = JSON.parse(json)
    return Array.isArray(arr) ? arr.filter((s) => typeof s === 'string') : []
  } catch {
    return []
  }
}

function getLS(key: string) {
  try {
    return typeof window !== 'undefined' ? localStorage.getItem(key) : null
  } catch {
    return null
  }
}
function setLS(key: string, val: string) {
  try {
    if (typeof window !== 'undefined') localStorage.setItem(key, val)
  } catch {}
}
function removeLS(key: string) {
  try {
    if (typeof window !== 'undefined') localStorage.removeItem(key)
  } catch {}
}

/** === Fallback sin Provider (misma API) === */
function useProviderlessAuth(): AuthContextType {
  const [token, setToken] = useState<string | null>(() => getLS('token'))
  const [enterprise, setEnterprise] = useState<string | null>(() =>
    getLS('enterprise')
  )
  const [enterpriseName, setEnterpriseName] = useState<string | null>(() =>
    getLS('enterpriseName')
  )
  const [enterpriseLogo, setEnterpriseLogo] = useState<string | null>(() =>
    getLS('enterpriseLogo')
  )
  const [enterpriseIcon, setEnterpriseIcon] = useState<string | null>(() =>
    getLS('enterpriseIcon')
  )
  const [detractionAccount, setDetractionAccount] = useState<string | null>(
    () => getLS('detractionAccount')
  )
  const [detractionPercent, setDetractionPercent] = useState<number | null>(
    () => {
      const val = getLS('detractionPercent')
      return val ? Number(val) : null
    }
  )
  const [ruc, setRuc] = useState<string | null>(() => getLS('ruc'))
  const [enterprises, setEnterprises] = useState<Enterprise[]>(() =>
    safeParseEnterprises(getLS('enterprises'))
  )

  const [permissions, setPermissions] = useState<string[]>(() =>
    safeParseStringArray(getLS('permissions'))
  )
  const [groups, setGroups] = useState<string[]>(() =>
    safeParseStringArray(getLS('groups'))
  )
  const ready = true
  // Sincroniza cuando cambian llaves en otras pestañas

  useEffect(() => {
    if (typeof window === 'undefined') return
    const onStorage = () => {
      setToken(getLS('token'))
      setEnterprise(getLS('enterprise'))
      setEnterpriseName(getLS('enterpriseName'))
      setEnterpriseLogo(getLS('enterpriseLogo'))
      setEnterpriseIcon(getLS('enterpriseIcon'))
      setDetractionAccount(getLS('detractionAccount'))
      const dp = getLS('detractionPercent')
      setDetractionPercent(dp ? Number(dp) : null)
      setRuc(getLS('ruc'))
      setEnterprises(safeParseEnterprises(getLS('enterprises')))
      setPermissions(safeParseStringArray(getLS('permissions')))
      setGroups(safeParseStringArray(getLS('groups')))
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const setEnterpriseList = (list: Enterprise[], activeId?: string) => {
    setEnterprises(list)
    setLS('enterprises', JSON.stringify(list))
    const chosen =
      (activeId && list.find((e) => e.uuid === activeId)) ||
      (enterprise && list.find((e) => e.uuid === enterprise)) ||
      list[0]

    if (chosen) {
      setEnterprise(chosen.uuid)
      setEnterpriseName(chosen.name)
      setEnterpriseLogo(chosen.logo)
      setEnterpriseIcon(chosen.icon)
      setDetractionAccount(chosen.detractionAccount)
      setDetractionPercent(chosen.detractionPercent)
      setRuc(chosen.ruc)
      setLS('enterprise', chosen.uuid)
      setLS('enterpriseName', chosen.name)
      setLS('enterpriseLogo', chosen.logo)
      setLS('enterpriseIcon', chosen.icon)
      setLS('detractionAccount', chosen.detractionAccount)
      setLS('detractionPercent', String(chosen.detractionPercent))
      setLS('ruc', chosen.ruc)
    } else {
      setEnterprise(null)
      setEnterpriseName(null)
      setEnterpriseLogo(null)
      setEnterpriseIcon(null)
      setDetractionAccount(null)
      setDetractionPercent(null)
      setRuc(null)
      removeLS('enterprise')
      removeLS('enterpriseIcon')
      removeLS('detractionAccount')
      removeLS('detractionPercent')
      removeLS('ruc')
    }
    if (typeof window !== 'undefined')
      window.dispatchEvent(new Event('storage'))
  }
  useEffect(() => {
    // Si hay empresas pero no se ha seleccionado ninguna, usar la primera
    if (!enterprise && enterprises.length > 0) {
      const first = enterprises[0]
      setEnterprise(first.uuid)
      setEnterpriseName(first.name)
      setEnterpriseLogo(first.logo)
      setEnterpriseIcon(first.icon)
      setDetractionAccount(first.detractionAccount)
      setDetractionPercent(first.detractionPercent)
      setRuc(first.ruc)
    }
  }, [enterprise, enterprises])
  const selectEnterprise = (id: string) => {
    const found = enterprises.find((e) => e.uuid === id)
    if (!found) return
    setEnterprise(found.uuid)
    setEnterpriseName(found.name)
    setEnterpriseLogo(found.logo)
    setEnterpriseIcon(found.icon)
    setDetractionAccount(found.detractionAccount)
    setDetractionPercent(found.detractionPercent)
    setRuc(found.ruc)
    setLS('enterprise', found.uuid)
    setLS('enterpriseName', found.name)
    setLS('enterpriseLogo', found.logo)
    setLS('enterpriseIcon', found.icon)
    setLS('detractionAccount', found.detractionAccount)
    setLS('detractionPercent', String(found.detractionPercent))
    setLS('ruc', found.ruc)
    if (typeof window !== 'undefined')
      window.dispatchEvent(new Event('storage'))
  }

  const hasPermission = (permission: string) => permissions.includes(permission)

  const hasAnyPermission = (needle: string | string[]) => {
    if (Array.isArray(needle))
      return permissions.some((p) => needle.includes(p))
    // substring match (útil si usas prefijos tipo "clients.")
    return permissions.some((p) => p.includes(needle))
  }

  const login = (
    t: string,
    e: string,
    en: string,
    logo: string,
    icon: string,
    detractionAccount: string,
    detractionPercent: number,
    ruc: string,
    perms: string[],
    gps: string[] = []
  ) => {
    setToken(t)
    setEnterprise(e)
    setEnterpriseName(en)
    setEnterpriseLogo(logo)
    setEnterpriseIcon(icon)
    setDetractionAccount(detractionAccount)
    setDetractionPercent(detractionPercent)
    setRuc(ruc)
    setPermissions(perms)
    setGroups(gps)

    setLS('token', t)
    setLS('enterprise', e)
    setLS('enterpriseName', en)
    setLS('enterpriseLogo', logo)
    setLS('enterpriseIcon', icon)
    setLS('detractionAccount', detractionAccount)
    setLS('detractionPercent', String(detractionPercent))
    setLS('ruc', ruc)
    setLS('permissions', JSON.stringify(perms))
    setLS('groups', JSON.stringify(gps))

    const currentList = enterprises.length
      ? enterprises
      : [
          {
            uuid: e,
            name: en,
            logo,
            icon,
            detractionAccount,
            detractionPercent,
            ruc
          }
        ]
    setEnterprises(currentList)
    setLS('enterprises', JSON.stringify(currentList))

    if (typeof window !== 'undefined')
      window.dispatchEvent(new Event('storage'))
  }

  const logout = () => {
    setToken(null)
    setEnterprise(null)
    setEnterpriseName(null)
    setEnterpriseLogo(null)
    setEnterpriseIcon(null)
    setDetractionAccount(null)
    setDetractionPercent(null)
    setRuc(null)
    setEnterprises([])
    setPermissions([])
    setGroups([])

    removeLS('token')
    removeLS('enterprise')
    removeLS('enterpriseName')
    removeLS('enterpriseLogo')
    removeLS('enterpriseIcon')
    removeLS('detractionAccount')
    removeLS('detractionPercent')
    removeLS('ruc')
    removeLS('enterprises')
    removeLS('permissions')
    removeLS('groups')

    if (typeof window !== 'undefined')
      window.dispatchEvent(new Event('storage'))
  }

  return {
    token,
    enterprise,
    enterpriseName,
    enterpriseLogo,
    enterpriseIcon,
    // enterpriseAddress,
    detractionAccount: detractionAccount,
    detractionPercent: detractionPercent,
    ruc: ruc,
    enterprises,
    permissions,
    groups,
    ready,
    setEnterpriseList,
    selectEnterprise,
    login,
    logout,
    isAuthenticated: () => !!token,
    hasPermission,
    hasAnyPermission
  }
}

/** === Hook público === */
export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext)
  const fallback = useProviderlessAuth()
  return ctx ?? fallback
}

/** === Provider principal === */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null)
  const [enterprise, setEnterprise] = useState<string | null>(null)
  const [enterpriseName, setEnterpriseName] = useState<string | null>(null)
  const [enterpriseLogo, setEnterpriseLogo] = useState<string | null>(null)
  const [enterpriseIcon, setEnterpriseIcon] = useState<string | null>(null)
  const [detractionAccount, setDetractionAccount] = useState<string | null>(
    null
  )
  const [detractionPercent, setDetractionPercent] = useState<number | null>(
    null
  )
  const [ruc, setRuc] = useState<string | null>(null)
  const [enterprises, setEnterprises] = useState<Enterprise[]>([])
  const [ready, setReady] = useState(false)
  const [permissions, setPermissions] = useState<string[]>([])
  const [groups, setGroups] = useState<string[]>([])

  // Cargar de LS al montar
  // pendiente, al actualizar no envia el enterprise
  useEffect(() => {
    setToken(getLS('token'))
    setEnterprise(getLS('enterprise'))
    setEnterpriseName(getLS('enterpriseName'))
    setEnterpriseLogo(getLS('enterpriseLogo'))
    setEnterpriseIcon(getLS('enterpriseIcon'))
    setDetractionAccount(getLS('detractionAccount'))
    const dp = getLS('detractionPercent')
    setDetractionPercent(dp ? Number(dp) : null)
    setRuc(getLS('ruc'))
    setEnterprises(safeParseEnterprises(getLS('enterprises')))
    setPermissions(safeParseStringArray(getLS('permissions')))
    setGroups(safeParseStringArray(getLS('groups')))
    setReady(true)
  }, [])

  const value = useMemo<AuthContextType>(() => {
    const setEnterpriseList = (list: Enterprise[], activeId?: string) => {
      setEnterprises(list)
      setLS('enterprises', JSON.stringify(list))

      const chosen =
        (activeId && list.find((e) => e.uuid === activeId)) ||
        (enterprise && list.find((e) => e.uuid === enterprise)) ||
        list[0]

      if (chosen) {
        setEnterprise(chosen.uuid)
        setEnterpriseName(chosen.name)
        setEnterpriseLogo(chosen.logo)
        setEnterpriseIcon(chosen.icon)
        setDetractionAccount(chosen.detractionAccount)
        setDetractionPercent(chosen.detractionPercent)
        setRuc(chosen.ruc)
        setLS('enterprise', chosen.uuid)
        setLS('enterpriseLogo', chosen.logo)
        setLS('enterpriseIcon', chosen.icon)
        setLS('detractionAccount', chosen.detractionAccount)
        setLS('detractionPercent', String(chosen.detractionPercent))
        setLS('ruc', chosen.ruc)
      } else {
        setEnterprise(null)
        setEnterpriseName(null)
        setEnterpriseLogo(null)
        setEnterpriseIcon(null)
        setDetractionAccount(null)
        setDetractionPercent(null)
        setRuc(null)
        removeLS('enterprise')
        removeLS('enterpriseIcon')
        removeLS('detractionAccount')
        removeLS('detractionPercent')
        removeLS('ruc')
      }
      if (typeof window !== 'undefined')
        window.dispatchEvent(new Event('storage'))
    }

    const selectEnterprise = (id: string) => {
      const found = enterprises.find((e) => e.uuid === id)
      if (!found) return
      setEnterprise(found.uuid)
      setEnterpriseName(found.name)
      setEnterpriseLogo(found.logo)
      setEnterpriseIcon(found.icon)
      setDetractionAccount(found.detractionAccount)
      setDetractionPercent(found.detractionPercent)
      setRuc(found.ruc)
      setLS('enterprise', found.uuid)
      setLS('enterpriseName', found.name)
      setLS('enterpriseIcon', found.icon)
      setLS('detractionAccount', found.detractionAccount)
      setLS('detractionPercent', String(found.detractionPercent))
      setLS('ruc', found.ruc)
      if (typeof window !== 'undefined')
        window.dispatchEvent(new Event('storage'))
    }

    const login = (
      t: string,
      e: string,
      en: string,
      logo: string,
      icon: string,
      detractionAccount: string,
      detractionPercent: number,
      ruc: string,
      perms: string[],
      gps: string[] = []
    ) => {
      setToken(t)
      setEnterprise(e)
      setEnterpriseName(en)
      setEnterpriseLogo(logo)
      setEnterpriseIcon(icon)
      setDetractionAccount(detractionAccount)
      setDetractionPercent(detractionPercent)
      setRuc(ruc)
      setPermissions(perms)
      setGroups(gps)

      setLS('token', t)
      setLS('enterprise', e)
      setLS('enterpriseName', en)
      setLS('enterpriseIcon', icon)
      setLS('detractionAccount', detractionAccount)
      setLS('detractionPercent', String(detractionPercent))
      setLS('ruc', ruc)
      setLS('enterpriseLogo', logo)
      setLS('permissions', JSON.stringify(perms))
      setLS('groups', JSON.stringify(gps))

      const currentList = enterprises.length
        ? enterprises
        : [
            {
              uuid: e,
              name: en,
              logo,
              icon,
              detractionAccount: detractionAccount,
              detractionPercent: detractionPercent,
              ruc: ruc
            }
          ]
      setEnterprises(currentList)
      setLS('enterprises', JSON.stringify(currentList))

      if (typeof window !== 'undefined')
        window.dispatchEvent(new Event('storage'))
    }

    const logout = () => {
      setToken(null)
      setEnterprise(null)
      setEnterpriseName(null)
      setEnterpriseLogo(null)
      setEnterpriseIcon(null)
      setDetractionAccount(null)
      setDetractionPercent(null)
      setRuc(null)
      setEnterprises([])
      setPermissions([])
      setGroups([])
      setReady(false)
      removeLS('token')
      removeLS('enterprise')
      removeLS('enterpriseName')
      removeLS('enterpriseLogo')
      removeLS('enterpriseIcon')
      removeLS('detractionAccount')
      removeLS('detractionPercent')
      removeLS('ruc')
      removeLS('enterprises')
      removeLS('permissions')
      removeLS('groups')

      if (typeof window !== 'undefined')
        window.dispatchEvent(new Event('storage'))
    }

    const hasPermission = (permission: string) =>
      permissions.includes(permission)

    const hasAnyPermission = (needle: string | string[]) => {
      if (Array.isArray(needle))
        return permissions.some((p) => needle.includes(p))
      return permissions.some((p) => p.includes(needle))
    }

    return {
      token,
      enterprise,
      enterpriseName,
      enterpriseLogo,
      enterpriseIcon,
      detractionAccount: detractionAccount,
      detractionPercent: detractionPercent,
      ruc: ruc,
      enterprises,
      permissions,
      groups,
      ready,
      setEnterpriseList,
      selectEnterprise,
      login,
      logout,
      isAuthenticated: () => !!token,
      hasPermission,
      hasAnyPermission
    }
  }, [
    token,
    enterprise,
    enterpriseName,
    enterpriseLogo,
    enterpriseIcon,
    detractionAccount,
    detractionPercent,
    ruc,
    enterprises,
    permissions,
    groups,
    ready
  ])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
