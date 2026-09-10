import endPoints from '@/services/auth/endPoints/endPoint'
import { ApiFecthAuth } from '@/services/auth/axios/apiFetchAuth'
import { ClienteRetrieveInterface } from '@/interfaces/querys/queryInterface'
import { logReq, logRes } from './clientesTrace'

export async function getClienteData(
  uuid: string | undefined,
  token: string | null
) {
  if (!token) return { props: { cliente: null }, revalidate: 3600 }

  const url = uuid && uuid.length > 0 ? endPoints.clients.retrieve(uuid) : ''
  if (uuid) logReq('GET', url)

  const cliente =
    uuid && uuid.length > 0 ? await ApiFecthAuth(url, token) : null

  if (uuid && cliente) logRes('GET', url, 200, cliente.data)

  return {
    props: {
      cliente: cliente ? (cliente.data as ClienteRetrieveInterface) : null
    },
    revalidate: 3600
  }
}
