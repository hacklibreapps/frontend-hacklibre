import { KeyValueInterface } from './keyValueInterface'

export interface NotificationsInterface {
  uuid: string
  title: string
  message: string
  type: KeyValueInterface
  status: boolean
  url?: string
  date: string
  downloadable: boolean
  created: string
}
