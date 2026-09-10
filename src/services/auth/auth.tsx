import axios, { AxiosError } from 'axios'
import { getApiBase } from '@/config/enterprise' // Asegúrate de importar la función getApiBase

// Definimos el tipo LoginResponse para la respuesta esperada
export interface LoginResponse {
  access: string // Token de acceso
  enterprises?: {
    uuid: string
    name: string
    logo: string
    icon: string
    detractionAccount: string
    detractionPercent: number
    ruc: string
  }[] // Lista de empresas del usuario
  active_enterprise?: {
    id: string
    name: string
    logo: string
    icon: string
    detractionAccount: string
    detractionPercent: number
    ruc: string
  } // Empresa activa
  groups: string[]
  permissions: string[]
}

// Se recibe la empresa (usualmente se pasa como parámetro en el login)
export const TokenLogin = async (
  username: string,
  password: string,
  enterprise?: string
): Promise<LoginResponse | { error: string }> => {
  try {
    // Obtenemos la URL correcta de la API dependiendo de la empresa
    const apiBase = getApiBase(enterprise)
    const url = `${apiBase}token/` // Asegúrate de que el endpoint real sea `token/` o el que uses en el backend

    // Realizamos la solicitud de inicio de sesión
    const response = await axios.post(url, {
      username,
      password
    })

    // Retornamos los datos de la respuesta
    return response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError: AxiosError = error
      const statusCode = axiosError.response?.status
      const statusText = axiosError.response?.statusText

      // Manejo de diferentes errores basados en el código de estado
      switch (statusCode) {
        case 401: // Unauthorized
          return { error: 'Usuario o contraseña incorrectas' }

        case 500: // Internal Server Error
          return { error: 'Error en el servidor, por favor intenta más tarde.' }

        case 400: // Bad Request
          return { error: 'Solicitud incorrecta, verifica los datos enviados.' }

        default:
          return { error: statusText || 'Error desconocido al iniciar sesión.' }
      }
    }

    // Error genérico cuando no es un error de Axios
    return {
      error: 'Hubo un error al iniciar sesión, por favor intentelo nuevamente.'
    }
  }
}
