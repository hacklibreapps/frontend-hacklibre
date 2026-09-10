import { ChildrenInterface } from "@/interfaces/structures/childrenInterface"


const TableBody: React.FC<ChildrenInterface> = ({ children }) => {
  return <tbody>{children}</tbody>
}
export { TableBody }
