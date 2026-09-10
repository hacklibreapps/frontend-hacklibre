import { ChildrenInterface } from '@/interfaces/structures/childrenInterface'

interface TableInterface extends ChildrenInterface {
  className?: string
  onClick?: () => void
}

const TableRowHeader: React.FC<TableInterface> = ({
  children,
  className,
  onClick
}) => {
  return (
    <tr className={`${className} bg-Cian8 text-white`} onClick={onClick}>
      {children}
    </tr>
  )
}
export default TableRowHeader
