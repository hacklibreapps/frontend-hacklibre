export function IconButton({
  title,
  onClick,
  children
}: {
  title: string
  onClick?: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type='button'
      title={title}
      onClick={onClick}
      className='
        inline-flex h-9 w-9 items-center justify-center rounded-md
        text-Charcoal/80 transition 
         hover:text-Charcoal focus:outline-none 
      '
    >
      {children}
    </button>
  )
}
