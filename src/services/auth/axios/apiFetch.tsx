import axios, { AxiosError, ResponseType } from 'axios'

export async function ApiFetch(
  endpoint: string,
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
    'Content-Type': contentType
  }

  try {
    const response = await axios.get(ep, {
      headers,
      responseType: responseType
    })

    return response
  } catch (error) {
    const err = error as AxiosError

    console.error('API Fetch Error:', err.response?.data || err.message)
    throw new Error('ERROR AL OBTENER DATOS')
  }
}
