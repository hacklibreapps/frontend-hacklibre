import { RefObject } from 'react'
import type { Editor as TinyMCEEditor } from 'tinymce'

interface ResetFieldGroup {
  refs: RefObject<HTMLElement | TinyMCEEditor>[] // Arreglo de referencias
  resetValues: (string | boolean)[] // Valores para resetear
}
export interface ResetFieldInterface {
  resetFields: ResetFieldGroup[]
}

const isTinyMCEEditor = (ref: unknown): ref is TinyMCEEditor => {
  return (
    typeof ref === 'object' &&
    ref !== null &&
    'setContent' in ref &&
    typeof (ref as TinyMCEEditor).setContent === 'function'
  )
}

const ResetForm = ({ resetFields }: ResetFieldInterface) => {
  const resetAllFields = () => {
    resetFields.forEach(({ refs, resetValues }) => {
      refs.forEach((ref, index) => {
        const resetValue = resetValues[index] ?? '' // Valor por defecto vacío si no se proporciona

        if (ref.current) {
          if (ref.current instanceof HTMLInputElement) {
            // Es un input
            if (ref.current.type === 'file') {
              ref.current.value = '' // Resetea el valor del archivo cargado
            } else if (ref.current.type === 'checkbox') {
              ref.current.checked = Boolean(resetValue) // Resetea el checkbox basado en el valor booleano
            } else {
              ref.current.value = String(resetValue) // Resetea el valor de texto
            }
          } else if (ref.current instanceof HTMLTextAreaElement) {
            // Es un textarea
            ref.current.value = String(resetValue)
          } else if (ref.current instanceof HTMLSelectElement) {
            // Es un select
            ref.current.value = String(resetValue)
            ref.current.selectedIndex = 0
          } else if (
            ref.current instanceof HTMLDivElement ||
            ref.current instanceof HTMLElement
          ) {
            // Resetear contenido de otros elementos
            ref.current.innerHTML = String(resetValue)
          } else if (isTinyMCEEditor(ref.current)) {
            ref.current.setContent(String(resetValue))
          }
        }
      })
    })
  }

  return resetAllFields
}

export default ResetForm
