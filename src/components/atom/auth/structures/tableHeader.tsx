import { ChildrenInterface } from "@/interfaces/structures/childrenInterface"

const TableHeader: React.FC<ChildrenInterface> = ({ children }) => {
  return <thead className='sticky top-0 z-10'>{children}</thead>
}
export default TableHeader
