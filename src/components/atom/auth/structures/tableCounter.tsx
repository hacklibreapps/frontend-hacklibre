import { paginationSize } from "@/services/envs/envs";


const TableCounter = ({ nr, page }: { nr: number; page: string }) => {
  return nr + (Number(page) * paginationSize - paginationSize) + 1
}
export { TableCounter }
