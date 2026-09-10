import { NotificationsInterface } from '@/interfaces/structures/notificationsInterface'
import { IconsNotifications } from './iconsNotifications'
import { GetTimeElapsed } from '@/utils/getTimeElapsed'
import { GroupButtonNotifications } from './groupButtonNotifications'

const ItemNotification = ({
  data,
  markAsRead
}: {
  data: NotificationsInterface
  markAsRead: (uuid: string) => void
}) => {
  return (
    <div className='w-full flex flex-row justify-end items-center flex-wrap border-b border-Charcoal/45'>
      <div className='w-2/12 p-3'>
        <IconsNotifications iconType={data.type} />
      </div>
      <div className='w-10/12 flex flex-col justify-center items-center p-0'>
        <div className='w-full flex flex-row justify-center items-start'>
          <div className='w-10/12'>
            <p className='py-1 font-bold w-full'>
              {data.title.length ? data.title : 'Nuevo mensaje'}
            </p>
          </div>
          <div className='w-3/12 flex flex-col justify-start items-end py-1 px-1'>
            <p className='pl-2 text-xs text-gray-600 flex flex-row justify-end items-start'>
              {GetTimeElapsed(data.created)}
            </p>
          </div>
        </div>
        <div
          className='w-full pl-1 pr-2 text-justify'
          dangerouslySetInnerHTML={{ __html: data.message }}
        ></div>
      </div>
      <GroupButtonNotifications data={data} created={data.created} markAsRead={markAsRead} />
    </div>
  )
}
export { ItemNotification }
