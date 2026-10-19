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
  comercialName: string
  logo: string
  icon: string
  address: string
  departamento: string
  provincia: string
  distrito: string
  detractionAccount: string
  detractionPercent: number
  ruc: string
  telefono: string
  email: string
}

type AuthContextType = {
  token: string | null
  enterprise: string | null
  enterpriseName: string | null
  comercialName: string | null
  enterpriseLogo: string | null
  enterpriseIcon: string | null
  //  enterpriseAddress: string | null
  address: string | null
  departamento: string | null
  provincia: string | null
  distrito: string | null
  detractionAccount: string | null
  detractionPercent: number | null
  ruc: string | null
  telefono: string | null
  email: string | null
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
    comercialName: string,
    enterpriseLogo: string,
    enterpriseIcon: string,
    address: string,
    departamento: string,
    provincia: string,
    distrito: string,
    detractionAccount: string,
    detractionPercent: number,
    ruc: string,
    telefono: string,
    email: string,
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
  const [comercialName, setComercialName] = useState<string | null>(() =>
    getLS('comercialName')
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
  const [address, setAddress] = useState<string | null>(() => getLS('address'))
  const [departamento, setDepartamento] = useState<string | null>(() =>
    getLS('departamento')
  )
  const [provincia, setProvincia] = useState<string | null>(() =>
    getLS('provincia')
  )
  const [distrito, setDistrito] = useState<string | null>(() =>
    getLS('distrito')
  )
  const [detractionPercent, setDetractionPercent] = useState<number | null>(
    () => {
      const val = getLS('detractionPercent')
      return val ? Number(val) : null
    }
  )
  const [ruc, setRuc] = useState<string | null>(() => getLS('ruc'))
  const [telefono, setTelefono] = useState<string | null>(() =>
    getLS('telefono')
  )
  const [email, setEmail] = useState<string | null>(() => getLS('email'))
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
      setComercialName(getLS('comercialName'))
      setEnterpriseLogo(getLS('enterpriseLogo'))
      setEnterpriseIcon(getLS('enterpriseIcon'))
      setAddress(getLS('address'))
      setDepartamento(getLS('departamento'))
      setProvincia(getLS('provincia'))
      setDistrito(getLS('distrito'))
      setDetractionAccount(getLS('detractionAccount'))
      const dp = getLS('detractionPercent')
      setDetractionPercent(dp ? Number(dp) : null)
      setRuc(getLS('ruc'))
      setTelefono(getLS('telefono'))
      setEmail(getLS('email'))
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
      setComercialName(chosen.comercialName)
      setEnterpriseLogo(chosen.logo)
      setEnterpriseIcon(chosen.icon)
      setAddress(chosen.address)
      setDepartamento(chosen.departamento)
      setProvincia(chosen.provincia)
      setDistrito(chosen.distrito)
      setDetractionAccount(chosen.detractionAccount)
      setDetractionPercent(chosen.detractionPercent)
      setRuc(chosen.ruc)
      setTelefono(chosen.telefono)
      setEmail(chosen.email)
      setLS('enterprise', chosen.uuid)
      setLS('enterpriseName', chosen.name)
      setLS('comercialName', chosen.comercialName)
      setLS('enterpriseLogo', chosen.logo)
      setLS('enterpriseIcon', chosen.icon)
      setLS('address', chosen.address)
      setLS('departamento', chosen.departamento)
      setLS('provincia', chosen.provincia)
      setLS('distrito', chosen.distrito)
      setLS('detractionAccount', chosen.detractionAccount)
      setLS('detractionPercent', String(chosen.detractionPercent))
      setLS('ruc', chosen.ruc)
      setLS('telefono', chosen.telefono)
      setLS('email', chosen.email)
    } else {
      setEnterprise(null)
      setEnterpriseName(null)
      setComercialName(null)
      setEnterpriseLogo(null)
      setEnterpriseIcon(null)
      setAddress(null)
      setDepartamento(null)
      setProvincia(null)
      setDistrito(null)
      setDetractionAccount(null)
      setDetractionPercent(null)
      setRuc(null)
      setTelefono(null)
      setEmail(null)
      removeLS('enterprise')
      removeLS('enterpriseIcon')
      removeLS('detractionAccount')
      removeLS('detractionPercent')
      removeLS('ruc')
      removeLS('telefono')
      removeLS('email')
      removeLS('address')
      removeLS('departamento')
      removeLS('provincia')
      removeLS('distrito')
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
      setComercialName(first.comercialName)
      setEnterpriseLogo(first.logo)
      setEnterpriseIcon(first.icon)
      setAddress(first.address)
      setDepartamento(first.departamento)
      setProvincia(first.provincia)
      setDistrito(first.distrito)
      setDetractionAccount(first.detractionAccount)
      setDetractionPercent(first.detractionPercent)
      setRuc(first.ruc)
      setTelefono(first.telefono)
      setEmail(first.email)
    }
  }, [enterprise, enterprises])
  const selectEnterprise = (id: string) => {
    const found = enterprises.find((e) => e.uuid === id)
    if (!found) return
    setEnterprise(found.uuid)
    setEnterpriseName(found.name)
    setComercialName(found.comercialName)
    setEnterpriseLogo(found.logo)
    setEnterpriseIcon(found.icon)
    setAddress(found.address)
    setDepartamento(found.departamento)
    setProvincia(found.provincia)
    setDistrito(found.distrito)
    setDetractionAccount(found.detractionAccount)
    setDetractionPercent(found.detractionPercent)
    setRuc(found.ruc)
    setTelefono(found.telefono)
    setEmail(found.email)
    setLS('enterprise', found.uuid)
    setLS('enterpriseName', found.name)
    setLS('comercialName', found.comercialName)
    setLS('enterpriseLogo', found.logo)
    setLS('enterpriseIcon', found.icon)
    setLS('address', found.address)
    setLS('departamento', found.departamento)
    setLS('provincia', found.provincia)
    setLS('distrito', found.distrito)
    setLS('detractionAccount', found.detractionAccount)
    setLS('detractionPercent', String(found.detractionPercent))
    setLS('ruc', found.ruc)
    setLS('telefono', found.telefono)
    setLS('email', found.email)
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
    comercialName: string,
    logo: string,
    icon: string,
    address: string,
    departamento: string,
    provincia: string,
    distrito: string,
    detractionAccount: string,
    detractionPercent: number,
    ruc: string,
    telefono: string,
    email: string,
    perms: string[],
    gps: string[] = []
  ) => {
    setToken(t)
    setEnterprise(e)
    setEnterpriseName(en)
    setComercialName(comercialName)
    setEnterpriseLogo(logo)
    setEnterpriseIcon(icon)
    setAddress(address)
    setDepartamento(departamento)
    setProvincia(provincia)
    setDistrito(distrito)
    setDetractionAccount(detractionAccount)
    setDetractionPercent(detractionPercent)
    setRuc(ruc)
    setTelefono(telefono)
    setEmail(email)
    setPermissions(perms)
    setGroups(gps)

    setLS('token', t)
    setLS('enterprise', e)
    setLS('enterpriseName', en)
    setLS('comercialName', comercialName)
    setLS('enterpriseLogo', logo)
    setLS('enterpriseIcon', icon)
    setLS('address', address)
    setLS('departamento', departamento)
    setLS('provincia', provincia)
    setLS('distrito', distrito)
    setLS('detractionAccount', detractionAccount)
    setLS('detractionPercent', String(detractionPercent))
    setLS('ruc', ruc)
    setLS('telefono', telefono)
    setLS('email', email)
    setLS('permissions', JSON.stringify(perms))
    setLS('groups', JSON.stringify(gps))

    const currentList = enterprises.length
      ? enterprises
      : [
          {
            uuid: e,
            name: en,
            comercialName,
            logo,
            icon,
            address,
            departamento,
            provincia,
            distrito,
            detractionAccount,
            detractionPercent,
            ruc,
            telefono,
            email
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
    setComercialName(null)
    setEnterpriseLogo(null)
    setEnterpriseIcon(null)
    setAddress(null)
    setDepartamento(null)
    setProvincia(null)
    setDistrito(null)
    setDetractionAccount(null)
    setDetractionPercent(null)
    setRuc(null)
    setTelefono(null)
    setEmail(null)
    setEnterprises([])
    setPermissions([])
    setGroups([])

    removeLS('token')
    removeLS('enterprise')
    removeLS('enterpriseName')
    removeLS('comercialName')
    removeLS('enterpriseLogo')
    removeLS('enterpriseIcon')
    removeLS('detractionAccount')
    removeLS('address')
    removeLS('departamento')
    removeLS('provincia')
    removeLS('distrito')
    removeLS('detractionPercent')
    removeLS('ruc')
    removeLS('telefono')
    removeLS('email')
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
    comercialName: comercialName,
    enterpriseLogo,
    enterpriseIcon,
    // enterpriseAddress,
    address: address,
    departamento: departamento,
    provincia: provincia,
    distrito: distrito,
    detractionAccount: detractionAccount,
    detractionPercent: detractionPercent,
    ruc: ruc,
    telefono: telefono,
    email: email,
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
  const [comercialName, setComercialName] = useState<string | null>(null)
  const [enterpriseLogo, setEnterpriseLogo] = useState<string | null>(null)
  const [enterpriseIcon, setEnterpriseIcon] = useState<string | null>(null)
  const [detractionAccount, setDetractionAccount] = useState<string | null>(
    null
  )
  const [address, setAddress] = useState<string | null>(null)
  const [departamento, setDepartamento] = useState<string | null>(null)
  const [provincia, setProvincia] = useState<string | null>(null)
  const [distrito, setDistrito] = useState<string | null>(null)
  const [detractionPercent, setDetractionPercent] = useState<number | null>(
    null
  )
  const [ruc, setRuc] = useState<string | null>(null)
  const [telefono, setTelefono] = useState<string | null>(null)
  const [email, setEmail] = useState<string | null>(null)
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
    setComercialName(getLS('comercialName'))
    setEnterpriseLogo(getLS('enterpriseLogo'))
    setEnterpriseIcon(getLS('enterpriseIcon'))
    setAddress(getLS('address'))
    setDepartamento(getLS('departamento'))
    setProvincia(getLS('provincia'))
    setDistrito(getLS('distrito'))
    setDetractionAccount(getLS('detractionAccount'))
    const dp = getLS('detractionPercent')
    setDetractionPercent(dp ? Number(dp) : null)
    setRuc(getLS('ruc'))
    setTelefono(getLS('telefono'))
    setEmail(getLS('email'))
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
        setComercialName(chosen.comercialName)
        setEnterpriseLogo(chosen.logo)
        setEnterpriseIcon(chosen.icon)
        setAddress(chosen.address)
        setDepartamento(chosen.departamento)
        setProvincia(chosen.provincia)
        setDistrito(chosen.distrito)
        setDetractionAccount(chosen.detractionAccount)
        setDetractionPercent(chosen.detractionPercent)
        setRuc(chosen.ruc)
        setTelefono(chosen.telefono)
        setEmail(chosen.email)
        setLS('enterprise', chosen.uuid)
        setLS('comercialName', chosen.comercialName)
        setLS('enterpriseLogo', chosen.logo)
        setLS('enterpriseIcon', chosen.icon)
        setLS('address', chosen.address)
        setLS('departamento', chosen.departamento)
        setLS('provincia', chosen.provincia)
        setLS('distrito', chosen.distrito)
        setLS('detractionAccount', chosen.detractionAccount)
        setLS('detractionPercent', String(chosen.detractionPercent))
        setLS('ruc', chosen.ruc)
        setLS('telefono', chosen.telefono)
        setLS('email', chosen.email)
      } else {
        setEnterprise(null)
        setEnterpriseName(null)
        setComercialName(null)
        setEnterpriseLogo(null)
        setEnterpriseIcon(null)
        setAddress(null)
        setDepartamento(null)
        setProvincia(null)
        setDistrito(null)
        setDetractionAccount(null)
        setDetractionPercent(null)
        setRuc(null)
        setTelefono(null)
        setEmail(null)
        removeLS('enterprise')
        removeLS('comercialName')
        removeLS('logo')
        removeLS('enterpriseIcon')
        removeLS('address')
        removeLS('departamento')
        removeLS('provincia')
        removeLS('distrito')
        removeLS('detractionAccount')
        removeLS('detractionPercent')
        removeLS('ruc')
        removeLS('telefono')
        removeLS('email')
      }
      if (typeof window !== 'undefined')
        window.dispatchEvent(new Event('storage'))
    }

    const selectEnterprise = (id: string) => {
      const found = enterprises.find((e) => e.uuid === id)
      if (!found) return
      setEnterprise(found.uuid)
      setEnterpriseName(found.name)
      setComercialName(found.comercialName)
      setEnterpriseLogo(found.logo)
      setEnterpriseIcon(found.icon)
      setAddress(found.address)
      setDepartamento(found.departamento)
      setProvincia(found.provincia)
      setDistrito(found.distrito)
      setDetractionPercent(found.detractionPercent)
      setRuc(found.ruc)
      setTelefono(found.telefono)
      setEmail(found.email)
      setLS('enterprise', found.uuid)
      setLS('enterpriseName', found.name)
      setLS('comercialName', found.comercialName)
      setLS('enterpriseIcon', found.icon)
      setLS('address', found.address)
      setLS('departamento', found.departamento)
      setLS('provincia', found.provincia)
      setLS('distrito', found.distrito)
      setLS('detractionPercent', String(found.detractionPercent))
      setLS('ruc', found.ruc)
      setLS('telefono', found.telefono)
      setLS('email', found.email)
      if (typeof window !== 'undefined')
        window.dispatchEvent(new Event('storage'))
    }

    const login = (
      t: string,
      e: string,
      en: string,
      comercialName: string,
      logo: string,
      icon: string,
      address: string,
      departamento: string,
      provincia: string,
      distrito: string,
      detractionAccount: string,
      detractionPercent: number,
      ruc: string,
      telefono: string,
      email: string,
      perms: string[],
      gps: string[] = []
    ) => {
      setToken(t)
      setEnterprise(e)
      setEnterpriseName(en)
      setComercialName(comercialName)
      setEnterpriseLogo(logo)
      setEnterpriseIcon(icon)
      setAddress(address)
      setDepartamento(departamento)
      setProvincia(provincia)
      setDistrito(distrito)
      setDetractionAccount(detractionAccount)
      setDetractionPercent(detractionPercent)
      setRuc(ruc)
      setTelefono(telefono)
      setEmail(email)
      setPermissions(perms)
      setGroups(gps)

      setLS('token', t)
      setLS('enterprise', e)
      setLS('comercialName', comercialName)
      setLS('enterpriseName', en)
      setLS('enterpriseIcon', icon)
      setLS('address', address)
      setLS('departamento', departamento)
      setLS('provincia', provincia)
      setLS('distrito', distrito)
      setLS('detractionAccount', detractionAccount)
      setLS('detractionPercent', String(detractionPercent))
      setLS('ruc', ruc)
      setLS('telefono', telefono)
      setLS('email', email)
      setLS('enterpriseLogo', logo)
      setLS('permissions', JSON.stringify(perms))
      setLS('groups', JSON.stringify(gps))

      const currentList = enterprises.length
        ? enterprises
        : [
            {
              uuid: e,
              name: en,
              comercialName,
              logo,
              icon,
              address: address,
              departamento: departamento,
              provincia: provincia,
              distrito: distrito,
              detractionAccount: detractionAccount,
              detractionPercent: detractionPercent,
              ruc: ruc,
              telefono: telefono,
              email: email
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
      setComercialName(null)
      setEnterpriseLogo(null)
      setEnterpriseIcon(null)
      setAddress(null)
      setDepartamento(null)
      setProvincia(null)
      setDistrito(null)
      setDetractionAccount(null)
      setDetractionPercent(null)
      setRuc(null)
      setTelefono(null)
      setEmail(null)
      setEnterprises([])
      setPermissions([])
      setGroups([])
      setReady(false)
      removeLS('token')
      removeLS('enterprise')
      removeLS('enterpriseName')
      removeLS('comercialName')
      removeLS('enterpriseLogo')
      removeLS('enterpriseIcon')
      removeLS('address')
      removeLS('departamento')
      removeLS('provincia')
      removeLS('distrito')
      removeLS('detractionAccount')
      removeLS('detractionPercent')
      removeLS('ruc')
      removeLS('telefono')
      removeLS('email')
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
      comercialName,
      enterpriseLogo,
      enterpriseIcon,
      address: address,
      departamento: departamento,
      provincia: provincia,
      distrito: distrito,
      detractionAccount: detractionAccount,
      detractionPercent: detractionPercent,
      ruc: ruc,
      telefono: telefono,
      email: email,
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
    comercialName,
    enterpriseLogo,
    enterpriseIcon,
    address,
    departamento,
    provincia,
    distrito,
    detractionAccount,
    detractionPercent,
    ruc,
    telefono,
    email,
    enterprises,
    permissions,
    groups,
    ready
  ])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
