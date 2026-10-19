import Link from 'next/link'

const ItemActionGroup = ({
  url,
  icon,
  onClick
}: {
  url?: string
  icon?: React.ReactNode
  onClick?: () => void
}) => {
  return (
    <div className={`py-1 px-2 text-xl `}>
      {url ? (
        <Link href={url}>{icon ? icon : 'enlace'}</Link>
      ) : (
        <span onClick={onClick} className='cursor-pointer'>
          {icon ? icon : 'enlace'}
        </span>
      )}
    </div>
  )
}
const ActionGroupButton = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='w-full flex flex-row justify-center items-center'>
      {children}
    </div>
  )
}

export { ActionGroupButton, ItemActionGroup }
