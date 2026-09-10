import { ChildrenInterface } from "@/interfaces/structures/childrenInterface"

interface TableColHeaderInterface extends ChildrenInterface {
  className?: string
  colSpan?: number
  textAlign?: string
}

const TableColHeader: React.FC<TableColHeaderInterface> = ({
  children,
  className,
  colSpan,
  textAlign
}) => {
  return (
    <th
      colSpan={colSpan ? colSpan : 1}
      className={`py-2 ${textAlign ? textAlign : 'text-center'} ${className}`}
    >
      {children}
    </th>
  )
}

export default TableColHeader
