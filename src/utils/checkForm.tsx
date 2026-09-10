import { ToastNotification } from '@/components/atom/structures/toast'
import { RefObject } from 'react'
import type { Editor as TinyMCEEditor } from 'tinymce'

export interface CheckFieldInterface {
  ref: RefObject<HTMLElement | TinyMCEEditor>
  message: string
}
const isTinyMCEEditor = (ref: unknown): ref is TinyMCEEditor => {
  return (
    typeof ref === 'object' &&
    ref !== null &&
    'getContent' in ref &&
    typeof (ref as TinyMCEEditor).getContent === 'function'
  )
}

const CheckForm = (fields: CheckFieldInterface[]): boolean => {
  for (const field of fields) {
    const element = field.ref.current
    if (!element) {
      console.warn('No se pudo acceder al elemento del ref.')
      continue
    }

    // Comprobar el tipo de elemento y realizar validaciones específicas
    if (
      element instanceof HTMLInputElement ||
      element instanceof HTMLTextAreaElement
    ) {
      if (!element.value.trim() || element.value.trim() === 'Seleccione') {
        ToastNotification('warning', field.message)
        element.focus()
        return false
      }
    } else if (element instanceof HTMLSelectElement) {
      if (!element.value.trim()) {
        ToastNotification('warning', field.message)
        element.focus()
        return false
      }
    } else if (isTinyMCEEditor(element)) {
      const textContent = element.getContent({ format: 'text' }).trim()

      if (!textContent) {
        ToastNotification('warning', field.message)
        element.focus()
        return false
      }

      // 🔹 FALLBACK REAL
    } else {
      ToastNotification(
        'danger',
        'Error al validar el formulario, por favor inténtelo luego'
      )
    }
  }

  // Si pasa todas las validaciones, retorna true
  return true
}
export { CheckForm }
