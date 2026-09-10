import axios, { AxiosError, ResponseType } from 'axios'

export async function ApiFecthAuth(
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
    'Content-Type': contentType
  }

  if (typeof window !== 'undefined') {
    const enterprise = localStorage.getItem('enterprise')
    if (enterprise) headers['X-Enterprise-UUID'] = enterprise
  }

  try {
    const response = await axios.get(ep, {
      headers,
      responseType: responseType
    })

    return response
  } catch (error) {
    const err = error as AxiosError

    // Manejo de errores: estructurando el error en un objeto `data`
    if (err.response) {
      return {
        success: false,
        data: {
          message: err.response.data || 'Error desconocido',
          status: err.response.status
        }
      }
    } else if (err.request) {
      return {
        success: false,
        data: {
          message:
            'No se pudo conectar al servidor, por favor intente más tarde.'
        }
      }
    } else {
      return {
        success: false,
        data: { message: err.message || 'Error desconocido' }
      }
    }
  }
}
