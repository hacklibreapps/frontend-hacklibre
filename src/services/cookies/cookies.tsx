// export const setCookie = (name: string, value: string) => {
//   if (typeof document !== 'undefined') {
//     document.cookie = `${name}=${encodeURIComponent(value)}; path=/; SameSite=Lax`
//   }
// }

export const setCookie = (name: string, value: string) => {
  if (typeof document !== 'undefined') {
    document.cookie = `${name}=${encodeURIComponent(value)}; path=/; SameSite=Lax`

    // 🔥 Disparar evento
    window.dispatchEvent(new Event('cookieUpdated'))
  }
}

export const getCookie = (name: string): string | null => {
  if (typeof document === 'undefined') return null

  const cookies = document.cookie.split('; ')
  const cookie = cookies.find((row) => row.startsWith(name + '='))

  return cookie ? decodeURIComponent(cookie.split('=')[1]) : null
}

export const deleteCookie = (name: string) => {
  if (typeof document !== 'undefined') {
    document.cookie = `${name}=; Max-Age=0; path=/`
  }
}
