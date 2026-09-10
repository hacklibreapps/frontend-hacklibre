import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const ToastNotification = (type: string, message: string) => {
  if (type === 'success') {
    return toast.success(message)
  } else if (type === 'warning') {
    return toast.warning(message)
  } else if (type === 'danger') {
    return toast.error(message)
  } else if (type === 'info') {
    return toast.warning(message)
  } else {
    return toast(message)
  }
}

export { ToastNotification }
