import Link from 'next/link'

const UlFilters = ({
  children,
  className
}: Readonly<{
  children: React.ReactNode
  className?: string
}>) => {
  return (
    <ul
      className={`${className} w-full xl:w-auto flex-col xl:flex-row justify-center items-center`}
    >
      {children}
    </ul>
  )
}
const Lifilter = ({
  children,
  on_click,
  className,
  asLink,
  linkUrl
}: Readonly<{
  children: React.ReactNode
  on_click?: React.MouseEventHandler<HTMLLIElement> // antes estaba "any"
  className?: string
  asLink?: boolean
  linkUrl?: string
}>) => {
  return (
    <li
      onClick={on_click}
      className={`${className} hover:bg-TechnologyCian1 dark:hover:bg-PinguinRed1 hover:text-WhiteBoneDark z-20 w-full xl:w-auto py-2 mr-1 border border-t-TechnologyCian8 dark:border-t-PinguinRed8 border-x-TechnologyCian8 dark:border-x-PinguinRed8 border-b-0 mb-0 rounded-0 xl:rounded-t-xl flex flex-row justify-center items-center px-0 xl:px-4`}
    >
      {asLink ? (
        <Link href={linkUrl ? linkUrl : '#'}>{children}</Link>
      ) : (
        children
      )}
    </li>
  )
}

export { UlFilters, Lifilter }
