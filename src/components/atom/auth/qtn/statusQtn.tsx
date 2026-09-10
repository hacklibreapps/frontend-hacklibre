import { CotizacionInterface } from '@/interfaces/querys/queryInterface'
import { StatusIconStates } from '../structures/status/statusIcon'
import { KeyValueInterface } from '@/interfaces/structures/keyValueInterface'
import { useEffect, useState } from 'react'
import { ApiPatchAuth } from '@/services/auth/axios/apiPatchAuth'
import endPoints from '@/services/auth/endPoints/endPoint'
import { useAuth } from '@/context/authContext'
import { ToastNotification } from '../../structures/toast'

const StatusQtn = ({
  item,
  status,
  isOpen,
  onToggle,
  onClose
}: {
  item: CotizacionInterface
  status: KeyValueInterface[]
  isOpen: boolean
  onToggle: () => void
  onClose: () => void
}) => {
  const [currentStatus, setCurrentStatus] = useState<KeyValueInterface>({
    key: item.status.key as string,
    value: item.status.value
  })
  const { token } = useAuth()

  useEffect(() => {
    setCurrentStatus({
      key: item.status.key as string,
      value: item.status.value
    })
  }, [item.status.key, item.status.value])

  const handleChangeStatus = async (
    statusItem: KeyValueInterface,
    uuid: string
  ) => {
    const previousStatus = currentStatus
    setCurrentStatus(statusItem)
    onClose()
    try {
      const body = {
        uuid: item.uuid,
        status: statusItem.key as string
      }

      await ApiPatchAuth(
        endPoints.quotations.changeStatus(uuid),
        token ? token : '',
        body
      )

      ToastNotification('success', 'Estado actualizado correctamente')
    } catch (error) {
      setCurrentStatus(previousStatus)
      ToastNotification('danger', `No se pudo actualizar el estado - ${error}`)
    }
  }

  return (
    <>
      <StatusIconStates
        status={currentStatus.key as string}
        labelActivo={currentStatus.value}
        full={false}
        className='cursor-pointer'
        onClick={onToggle}
      />

      <div
        className={`${!isOpen ? 'hidden' : ''} absolute top-full left-1/2 -translate-x-1/2 mt-1 min-w-[140px] border border-gray-200 text-xs font-semibold z-50 bg-white shadow-md`}
      >
        {status.map((statusItem) => (
          <div
            key={statusItem.key as string}
            onClick={() => handleChangeStatus(statusItem, item.uuid)}
            className='p-1 bg-gray-100 border-b border-b-gray-200 last:border-b-0 cursor-pointer hover:bg-gray-200'
          >
            {statusItem.value}
          </div>
        ))}
      </div>
    </>
  )
}

export { StatusQtn }
