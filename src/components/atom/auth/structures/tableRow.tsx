import { ChildrenInterface } from '@/interfaces/structures/childrenInterface'

interface TableInterface extends ChildrenInterface {
  className?: string
  onClick?: () => void
  alert?: boolean
  exception?: boolean
  bgColor?: string
}

const TableRow: React.FC<TableInterface> = ({
  children,
  className,
  onClick,
  alert,
  exception,
  bgColor
}) => {
  return (
    <tr
      className={`${className}  ${
        alert
          ? 'bg-red-100'
          : bgColor
            ? bgColor
            : 'odd:bg-Cian2 even:bg-Greys/10'
      } ${exception ? '' : 'hover:bg-Cian8/10'} transition-colors duration-200`}
      onClick={onClick}
    >
      {children}
    </tr>
  )
}
export default TableRow
