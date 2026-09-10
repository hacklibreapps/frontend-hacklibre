import axios, { AxiosError, ResponseType } from 'axios'

export async function ApiFecthDownloadAuth(
  endpoint: string,
  authToken: string,
  param?: string,
  contentType: string = 'application/json',
  responseType: ResponseType = 'json'
) {
  const ep = param
    ? endpoint.includes('?')
      ? `${endpoint}&${param}`
      : `${endpoint}?${param}`
    : endpoint

  const headers: Record<string, string> = {
    Authorization: `Bearer ${authToken}`,
    'Content-Type': contentType // puedes quitarlo en GET si quieres evitar preflight
  }
  
  if (typeof window !== 'undefined') {
    const enterprise = localStorage.getItem('enterprise')
    if (enterprise) headers['X-Enterprise-UUID'] = enterprise
  }

  try {
    const response = await axios
      .get(ep, {
        headers,
        responseType: responseType
      })
      .then((response) => {
        return responseType === 'blob' ? response.data : response.data
      })
      .catch((error) => {
        return error
      })

    return response
  } catch (error) {
    const err = error as AxiosError

    console.error('API Fetch Error:', err.response?.data || err.message)
    throw new Error('ERROR AL OBTENER DATOS')
  }
}
