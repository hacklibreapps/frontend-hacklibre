import axios, { AxiosError, ResponseType } from 'axios'

type ApiSuccess<T> = {
  success: true
  data: T
  status: number
}

type ApiError = {
  success: false
  data: { message: unknown }
  status: number
}

export async function ApiPostAuth<
  TBody extends object | FormData,
  TResponse = unknown
>(
  endpoint: string,
  authToken: string,
  body: TBody,
  param?: string,
  contentType: string = 'application/json',
  responseType: ResponseType = 'json'
): Promise<ApiSuccess<TResponse> | ApiError> {
  const ep = param
    ? endpoint.includes('?')
      ? `${endpoint}&${param}`
      : `${endpoint}?${param}`
    : endpoint

  const headers: Record<string, string> = {
    Authorization: `Bearer ${authToken}`
  }

  if (!(body instanceof FormData)) {
    headers['Content-Type'] = contentType
  }

  if (typeof window !== 'undefined') {
    const enterprise = localStorage.getItem('enterprise')
    if (enterprise) headers['X-Enterprise-UUID'] = enterprise
  }

  try {
    const response = await axios.post<TResponse>(ep, body, {
      headers,
      responseType
    })
    return {
      success: true,
      data: response.data,
      status: response.status
    }
  } catch (error) {
    const err = error as AxiosError
    return {
      success: false,
      data: {
        message: err.response?.data ?? err.message ?? 'Error desconocido'
      },
      status: err.response?.status ?? 500
    }
  }
}
