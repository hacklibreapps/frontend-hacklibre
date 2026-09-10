import { ChildrenInterface } from '@/interfaces/structures/childrenInterface'

interface TableColBodyInterface extends ChildrenInterface {
  className?: string
  colSpan?: number
  border?:boolean
}
const TableColBody: React.FC<TableColBodyInterface> = ({
  children,
  className,
  colSpan,
  border
}) => {
  return (
    <td
      colSpan={colSpan ? colSpan : 1}
      className={`${className ? className : 'text-center'} py-2 ${border?'border-r border-white':''}`}
    >
      {children}
    </td>
  )
}
export default TableColBody
