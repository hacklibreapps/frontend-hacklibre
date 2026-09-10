const PageItem = ({
  handleChangePage,
  pageNumber,
  actualPage
}: {
  handleChangePage: (pageNr: number) => void
  pageNumber: number
  actualPage: string
}) => {
  const pageActual = parseInt(actualPage)
  return (
    <div
      onClick={() => handleChangePage(pageNumber)}
      className={`${
        pageNumber === pageActual
          ? 'border-2 border-TechnologyCian6 text-TechnologyCian6 dark:text-PinguinRed6 dark:border-PinguinRed6'
          : 'text-WhiteBone bg-TechnologyCian6 dark:bg-PinguinRed6'
      } cursor-pointer mx-1 w-12 h-12 text-lg flex flex-row justify-center items-center rounded-xl font-bold`}
    >
      {pageNumber}
    </div>
  )
}

export { PageItem }
