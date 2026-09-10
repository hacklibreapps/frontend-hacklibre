import axios, { AxiosError } from 'axios'

export async function ApiPatchAuth<T extends object>(
  endpoint: string,
  authToken: string,
  body: T,
  param?: string,
  contentType?: string
) {
  const ep = param
    ? endpoint.includes('?')
      ? `${endpoint}&${param}`
      : `${endpoint}?${param}`
    : endpoint

  const headers: Record<string, string> = {
    Authorization: `Bearer ${authToken}`,
    'Content-Type': contentType ? contentType : 'multipart/form-data'
  }

  if (typeof window !== 'undefined') {
    const enterprise = localStorage.getItem('enterprise')
    if (enterprise) headers['X-Enterprise-UUID'] = enterprise
  }

  try {
    const response = await axios.patch(ep, body, { headers })

    return { data: response.data, status: response.status }
  } catch (error) {
    const err = error as AxiosError

    return {
      data: (err.response?.data ?? null) as unknown as T,
      status: err.response?.status ?? 500
    }
  }
}
