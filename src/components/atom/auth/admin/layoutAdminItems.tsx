const LayoutAdminItems = ({
  children,
  title
}: {
  children: React.ReactNode
  title: string
}) => {
  return (
    <div className='w-full flex flex-col justify-center items-center relative'>
      <p className='text-DarkBlue font-bold text-3xl py-3'>{title}</p>
      {children}
    </div>
  )
}

export default LayoutAdminItems
