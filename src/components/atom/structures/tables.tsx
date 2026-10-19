import React from 'react'

interface ChildrenProps {
  children: React.ReactNode
  className?: string
}

/* =====================================================
   TABLE ROOT
===================================================== */

const TableRoot = ({ children, className = '' }: ChildrenProps) => {
  return (
    <div className='w-full overflow-x-auto'>
      <table
        className={`
          table-fixed
          w-full
          border-collapse
          ${className}
        `}
      >
        {children}
      </table>
    </div>
  )
}

/* =====================================================
   TABLE HEADER
===================================================== */

const TableHeader = ({ children, className = '' }: ChildrenProps) => {
  return <thead className={`sticky top-0 z-10 ${className}`}>{children}</thead>
}

/* =====================================================
   TABLE BODY
===================================================== */

const TableBody = ({ children, className = '' }: ChildrenProps) => {
  return <tbody className={className}>{children}</tbody>
}

/* =====================================================
   TABLE ROW
===================================================== */

interface TableRowProps extends ChildrenProps {
  onClick?: () => void
  alert?: boolean
  exception?: boolean
  bgColor?: string
}

const TableRow = ({
  children,
  className = '',
  onClick,
  alert = false,
  exception = false,
  bgColor
}: TableRowProps) => {
  const background = alert
    ? 'bg-red-100'
    : bgColor
      ? bgColor
      : 'odd:bg-Cian2 even:bg-Greys/10'

  const hover = exception ? '' : 'hover:bg-Cian8/10'

  return (
    <tr
      onClick={onClick}
      className={`
        ${background}
        ${hover}
        transition-colors
        duration-200
        ${className}
      `}
    >
      {children}
    </tr>
  )
}

/* =====================================================
   TABLE HEADER CELL
===================================================== */

interface TableHeaderCellProps extends ChildrenProps {
  colSpan?: number
  rowSpan?: number
  textAlign?: string
}

const TableHeaderCell = ({
  children,
  className = '',
  colSpan = 1,
  rowSpan,
  textAlign = 'text-center'
}: TableHeaderCellProps) => {
  return (
    <th
      scope='col'
      colSpan={colSpan}
      rowSpan={rowSpan}
      className={`
        py-2
        bg-Cian7
        text-white
        ${textAlign}
        ${className}
      `}
    >
      {children}
    </th>
  )
}

/* =====================================================
   TABLE BODY CELL
===================================================== */

interface TableCellProps extends ChildrenProps {
  colSpan?: number
  rowSpan?: number
  border?: boolean
  textAlign?: string
}

const TableCell = ({
  children,
  className = '',
  colSpan = 1,
  rowSpan,
  border = false,
  textAlign = 'text-center'
}: TableCellProps) => {
  return (
    <td
      colSpan={colSpan}
      rowSpan={rowSpan}
      className={`
        py-2
        ${textAlign}
        ${border ? 'border-r border-white' : ''}
        ${className}
      `}
    >
      {children}
    </td>
  )
}

/* =====================================================
   COMPOUND COMPONENT
===================================================== */

const Table = Object.assign(TableRoot, {
  Header: TableHeader,
  Body: TableBody,
  Row: TableRow,
  HeaderCell: TableHeaderCell,
  Cell: TableCell
})

export { Table }
