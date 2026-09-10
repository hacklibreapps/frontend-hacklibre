/* eslint-disable @typescript-eslint/no-explicit-any */
import { ToastNotification } from '@/components/atom/structures/toast'
import { prefix } from '@/services/envs/envs'

const ResponseFromEdited = ({
  response,
  returnSuccess
}: {
  response: {
    data: any
    status: any
  }
  returnSuccess: string
}) => {
  if (response.status === 200 || response.status === 201) {
    window.location.href = `${prefix}${returnSuccess}`
  } else {
    if (response.status === 400) {
      const errorMessages = response.data
      const errorList = []

      if (errorMessages.docNumber) {
        errorList.push(...errorMessages.docNumber)
      }

      if (errorMessages.productImage) {
        errorList.push(...errorMessages.productImage)
      }
      if (errorList.length > 0) {
        errorList.forEach((errorMessage) => {
          ToastNotification('warning', errorMessage)
        })
      }
    } else {
      ToastNotification('danger', 'Error al enviar la consulta')
    }
  }
}
export default ResponseFromEdited
