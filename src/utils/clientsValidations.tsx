import { ContactTempInterface } from '@/interfaces/querys/queryInterface'

export const validateContactDraft = (
  draft: ContactTempInterface
): string | null => {
  if (!draft.firstName.trim()) return 'Completa Nombres'
  if (!draft.lastName.trim()) return 'Completa Apellidos'
  if (!draft.email.trim()) return 'Completa Email'
  return null
}
