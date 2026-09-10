import { ToastNotification } from '@/components/atom/structures/toast'
import { MdOutlineContentCopy } from 'react-icons/md'

const copyToClipboard = async (value: string | number) => {
  try {
    await navigator.clipboard.writeText(String(value))
    ToastNotification('success', 'Copiado al portapapeles')
  } catch (error) {
    ToastNotification('danger', `No se pudo copiar ${error}`)
  }
}

const CopyToClipboardButton = ({ value }: { value: string | number }) => {
  return (
    <span
      className='pl-1 text-Red7 cursor-pointer'
      onClick={() => copyToClipboard(value)}
      data-tooltip-id='tooltip'
      data-tooltip-place='right'
      data-tooltip-content={'Copiar a portapapeles'}
    >
      <MdOutlineContentCopy />
    </span>
  )
}
export { copyToClipboard, CopyToClipboardButton }
