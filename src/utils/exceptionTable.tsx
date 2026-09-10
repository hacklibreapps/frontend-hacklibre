import TableRow from '@/components/atom/auth/structures/tableRow'

const ExceptionTable = ({
  colspan,
  message
}: {
  colspan?: number
  message?: JSX.Element | string
}) => {
  const nrColspan = colspan ? colspan : 1
  const msg = message
    ? message
    : 'No se encontraron resultados que coincidan con el criterio de búsqueda.'
  return (
    <TableRow exception>
      <td colSpan={nrColspan} className='align-middle py-5'>
        <div className='h-11 flex items-center text-Charcoal justify-center text-center font-bold'>
          {msg}
        </div>
      </td>
    </TableRow>
  )
}

export default ExceptionTable
