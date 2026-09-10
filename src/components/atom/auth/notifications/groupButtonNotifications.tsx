import { NotificationsInterface } from '@/interfaces/structures/notificationsInterface'
import { prefix } from '@/services/envs/envs'
import { formatDateTime } from '@/utils/formatDate'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FaBookReader } from 'react-icons/fa'
import { IoMdDownload } from 'react-icons/io'
import { RiDeleteBin6Fill } from 'react-icons/ri'

const GroupButtonNotifications = ({
  data,
  created,
  markAsRead
}: {
  data: NotificationsInterface
  created: string
  markAsRead: (uuid: string) => void
}) => {
  const pathname = usePathname()
  const url = data.url ? data.url.toString() : '#'
  const urlPath = `${prefix}/notifications/${data.uuid}/?u=${url !== '#' ? data.url : ''}&r=${pathname}`
  return (
    <div className='w-10/12 flex flex-row justify-between items-center p-2'>
      <div className='text-xs text-gray-600'>{formatDateTime(created)}</div>
      <div className='flex flex-row justify-center items-center'>
        {data.downloadable ? (
          <ButtonGroup
            data={data}
            icon={<IoMdDownload />}
            title='Descargar'
            color='text-Red7'
            link={urlPath}
            target='_blank'
          />
        ) : (
          <ButtonGroup
            data={data}
            icon={<FaBookReader />}
            title='Leer notificación'
            color='text-green-600'
            link={urlPath}
          />
        )}

        <ButtonGroup
          data={data}
          icon={<RiDeleteBin6Fill />}
          title='Eliminar notificación'
          color='text-red-500'
          markAsRead={() => markAsRead(data.uuid)}
        />
      </div>
    </div>
  )
}

const ButtonGroup = ({
  icon,
  title,
  color,
  markAsRead,
  data,
  link,
  target
}: {
  icon: React.ReactNode
  title: string
  color: string
  markAsRead?: (uuid: string) => void
  data: NotificationsInterface
  link?: string
  target?: string
}) => {
  const butn = (
    <span
      className={`py-1 px-3 text-2xl cursor-pointer ${color}`}
      data-tooltip-id='tooltip'
      data-tooltip-place='right'
      data-tooltip-content={title}
      onClick={() => markAsRead?.(data.uuid)}
    >
      {icon}
    </span>
  )
  return link && link !== '#' ? (
    <Link className='inline-flex' href={link} target={target}>
      {butn}
    </Link>
  ) : (
    butn
  )
}

export { GroupButtonNotifications }
