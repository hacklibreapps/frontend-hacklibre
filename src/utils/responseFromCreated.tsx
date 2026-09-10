/* eslint-disable @typescript-eslint/no-explicit-any */

import { ToastNotification } from '@/components/atom/structures/toast'

const ResponseFromCreated = ({
  response,
  successMessage,
  handlerResetfield,
  handlerResponseData
}: {
  response: {
    data: any
    status: any
  }
  successMessage?: string
  handlerResetfield: () => void
  handlerResponseData?: (data: any) => void
}) => {
  const successResponse = successMessage
    ? successMessage
    : 'Creado SATISFACTORIAMENTE'

  if (response) {
    if (response.status === 200 || response.status === 201) {
      ToastNotification('success', successResponse)
      if (handlerResponseData) handlerResponseData(response.data)
      handlerResetfield()
    } else {
      if (response.status === 400) {
        const errorMessages = response.data
        const errorList: string[] = []
        Object.keys(errorMessages).forEach((key) => {
          // Si el error es una lista, mostrar cada error individualmente
          if (Array.isArray(errorMessages[key])) {
            errorMessages[key].forEach((error: string) => {
              errorList.push(`${error}`)
            })
          } else {
            errorList.push(`${key}: ${errorMessages[key]}`)
          }
        })
        if (errorList.length > 0) {
          errorList.forEach((errorMessage) => {
            ToastNotification('warning', errorMessage)
          })
        }
      } else if (response.status === 404) {
        ToastNotification('warning', response.data.error)
      } else {
        ToastNotification('danger', 'Error al enviar la consulta')
      }
    }
  } else {
    ToastNotification('danger', 'Error al realizar el registro')
  }
}

export default ResponseFromCreated
