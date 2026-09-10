import {
  ContactInterface,
  ContactTempInterface
} from '@/interfaces/querys/queryInterface'

export const emptyTempContact: ContactTempInterface = {
  firstName: '',
  lastName: '',
  email: '',
  principal: false
}

export type ContactRow = ContactInterface | ContactTempInterface

export const isValidUuid = (v: unknown): v is string =>
  typeof v === 'string' &&
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    v
  )

export const isPersistedContact = (c: ContactRow): c is ContactInterface =>
  (c as ContactInterface).uuid !== undefined
