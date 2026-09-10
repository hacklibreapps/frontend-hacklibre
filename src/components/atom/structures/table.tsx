const Table = ({
  children,
  className
}: Readonly<{
  children: React.ReactNode
  className?: string
}>) => {
  return (
    <table className={`${className} border-collapse table-fixed w-full`}>
      {children}
    </table>
  )
}

const THead = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return <thead>{children}</thead>
}

const TBody = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return <tbody>{children}</tbody>
}

const TR = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return <tr>{children}</tr>
}

const TD = ({
  children,
  odd,
  colspan,
  className,
  textColor
}: Readonly<{
  children: React.ReactNode
  odd: number
  colspan?: number
  className?: string
  textColor?: string
}>) => {
  const oddData =
    odd % 2 === 0
      ? 'bg-WhiteBone dark:bg-GrayReadOnly'
      : 'bg-TechnologyCian1 dark:bg-PinguinRed1'
  const colorText = textColor ? textColor : 'text-Obsidian'
  return (
    <td
      colSpan={colspan}
      className={`${oddData} ${className} text-center border-b border-b-TechnologyCian8 ${colorText} dark:border-b-PinguinRed8 py-1 h-12 font-normal`}
    >
      {children}
    </td>
  )
}

export { Table, THead, TR, TBody, TD }
