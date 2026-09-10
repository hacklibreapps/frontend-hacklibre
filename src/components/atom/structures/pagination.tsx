import { PageItem } from "./pageItem"

const Pagination = ({
  handleChangePage,
  totalPages,
  actualPage
}: {
  handleChangePage: (pageNr: number) => void
  totalPages: number
  actualPage: string
}) => {
  const pageNumbers = Array.from(
    { length: totalPages },
    (_, index) => index + 1
  )

  return (
    <div className='w-full py-3 flex flex-row justify-center items-center'>
      {pageNumbers.map((pageNumber) => (
        <PageItem
          handleChangePage={handleChangePage}
          key={pageNumber}
          pageNumber={pageNumber}
          actualPage={actualPage}
        />
      ))}
    </div>
  )
}

export { Pagination }
