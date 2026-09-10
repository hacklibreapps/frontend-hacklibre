import { HiInformationCircle } from 'react-icons/hi2'
import { IoWarningSharp } from 'react-icons/io5'
import { MdDangerous } from 'react-icons/md'
import { GoCheckCircleFill } from 'react-icons/go'
import { KeyValueInterface } from '@/interfaces/structures/keyValueInterface'

const icon = [
  { key: 'info', value: <HiInformationCircle className='text-blue-600' /> },
  { key: 'warning', value: <IoWarningSharp className='text-orange-500' /> },
  { key: 'error', value: <MdDangerous className='text-red-600' /> },
  { key: 'success', value: <GoCheckCircleFill className='text-green-600' /> }
]
const IconsNotifications = ({ iconType }: { iconType: KeyValueInterface }) => {
  const currentIcon = icon.find((icon) => icon.key === iconType.key)
  return (
    <div className='text-3xl flex flex-row justify-center items-center'>
      {currentIcon?.value}
    </div>
  )
}
export { IconsNotifications }
