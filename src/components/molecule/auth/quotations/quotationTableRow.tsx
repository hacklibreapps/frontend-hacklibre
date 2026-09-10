import { StatusQtn } from '@/components/atom/auth/qtn/statusQtn'
import { StatusIconStates } from '@/components/atom/auth/structures/status/statusIcon'
import TableColBody from '@/components/atom/auth/structures/tableColBody'
import TableRow from '@/components/atom/auth/structures/tableRow'
import Actions from '@/components/atom/structures/actions/actions'
import { ToastNotification } from '@/components/atom/structures/toast'
import { useAuth } from '@/context/authContext'
import { CotizacionInterface } from '@/interfaces/querys/queryInterface'
import { KeyValueInterface } from '@/interfaces/structures/keyValueInterface'
import { ApiFecthAuth } from '@/services/auth/axios/apiFetchAuth'
import endPoints from '@/services/auth/endPoints/endPoint'
import { prefix } from '@/services/envs/envs'
import { useEffect, useRef, useState } from 'react'
import { MdOutlineArrowDropDown, MdOutlineArrowDropUp } from 'react-icons/md'

const QuotationTableRow = ({
  item,
  startIndex,
  idx,
  handlerDownloadPdf
}: {
  item: CotizacionInterface
  startIndex: number
  idx: number
  handlerDownloadPdf: (uuid: string, cotizacion: string) => void
}) => {
  const [showVersions, setShowVersions] = useState<boolean>(false)
  const [openStatusUuid, setOpenStatusUuid] = useState<string | null>(null)
  const hasVersions = item.versions && item.versions.length > 0
  const handlerShowVersions = () => {
    setShowVersions(!showVersions)
  }
  const statusMenuRef = useRef<HTMLDivElement | null>(null)
  const [status, setStatus] = useState<KeyValueInterface[]>([])
  const oebgcolor = idx % 2 === 0 ? 'bg-Greys/10' : 'bg-Cian2'
  const { token, ready, enterprise } = useAuth()

  useEffect(() => {
    if (!openStatusUuid) return

    const handleClickOutside = (event: MouseEvent) => {
      if (!statusMenuRef.current) return

      if (!statusMenuRef.current.contains(event.target as Node)) {
        setOpenStatusUuid(null)
      }
    }

    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpenStatusUuid(null)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEsc)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEsc)
    }
  }, [openStatusUuid])

  useEffect(() => {
    const fetchData = async () => {
      if (!ready || !token || !enterprise) return
      try {
        const resp = await getData(token)
        if (resp.props.statusQtn) {
          setStatus(resp.props.statusQtn ?? [])
        }
      } catch (e) {
        ToastNotification('danger', `Ha ocurrido un error - ${e}`)
      }
    }

    fetchData()
  }, [enterprise, ready, token])

  return (
    <>
      <TableRow key={item.uuid ?? idx} bgColor={oebgcolor}>
        {/* Nro */}
        <TableColBody
          className={`hidden sm:table-cell sm:w-1/12 text-center ${hasVersions ? 'border-l-4 border-fuchsia-700' : ''} relative`}
        >
          {startIndex + idx + 1}
          {hasVersions ? (
            <p
              onClick={handlerShowVersions}
              className='text-xl absolute top-2 right-6 cursor-pointer'
              data-tooltip-id='tooltip'
              data-tooltip-place='right'
              data-tooltip-content='versiones anteriores'
            >
              {showVersions ? (
                <MdOutlineArrowDropUp />
              ) : (
                <MdOutlineArrowDropDown />
              )}
            </p>
          ) : (
            ''
          )}
        </TableColBody>

        {/* Cotización */}
        <TableColBody className='w-7/12 lg:w-3/12 xl:w-3/12 text-center'>
          {item.cotizacion ?? '-'}
        </TableColBody>

        {/* Fecha emisión */}
        <TableColBody className='hidden lg:table-cell lg:w-2/12 text-center'>
          {item.fechaEmision ? item.fechaEmision : '-'}
        </TableColBody>

        {/* Cliente */}
        <TableColBody className='hidden lg:table-cell lg:w-2/12 text-center'>
          {item.client ?? '-'}
        </TableColBody>

        {/* Moneda */}
        <TableColBody className='hidden xl:table-cell xl:w-1/12 text-center'>
          {item.moneda ?? '-'}
        </TableColBody>

        {/* Total */}
        <TableColBody className='hidden lg:table-cell lg:w-1/12 text-center'>
          {item.total}
        </TableColBody>

        {/* Estado */}
        <TableColBody className='w-2/12 lg:w-1/12 text-center'>
          <div ref={statusMenuRef} className='w-fit mx-auto relative'>
            <StatusQtn
              item={item}
              status={status}
              isOpen={openStatusUuid === item.uuid}
              onToggle={() =>
                setOpenStatusUuid(
                  openStatusUuid === item.uuid ? null : item.uuid
                )
              }
              onClose={() => setOpenStatusUuid(null)}
            />
          </div>
        </TableColBody>

        {/* Acciones */}
        <TableColBody className='w-3/12 sm:w-2/12 xl:w-1/12 text-center'>
          <Actions
            editLink={`${prefix}/cotizaciones/${item.uuid}/editar`}
            permEdit='quotations.change_quotations'
            viewLink={`${prefix}/cotizaciones/${item.uuid}`}
            permView='quotations.view_quotations'
            pdfLink={item.uuid}
            permPdf='quotations.view_quotations'
            onDownloadPdf={() => handlerDownloadPdf(item.uuid, item.cotizacion)}
          />
        </TableColBody>
      </TableRow>
      {hasVersions && showVersions
        ? item.versions?.map((cnt, indx) => (
            <TableRow key={cnt.uuid ?? indx} bgColor={oebgcolor}>
              {/* Nro */}
              <TableColBody
                className={`hidden sm:table-cell sm:w-1/12 text-center ${hasVersions ? 'border-l-4 border-fuchsia-700' : ''} relative`}
              >
                {startIndex + idx + 1}.{indx + 1}
              </TableColBody>

              {/* Cotización */}
              <TableColBody className='w-7/12 lg:w-3/12 xl:w-3/12 text-center'>
                {cnt.cotizacion ?? '-'}
              </TableColBody>

              {/* Fecha emisión */}
              <TableColBody className='hidden lg:table-cell lg:w-2/12 text-center'>
                {cnt.fechaEmision ? cnt.fechaEmision : '-'}
              </TableColBody>

              {/* Cliente */}
              <TableColBody className='hidden lg:table-cell lg:w-2/12 text-center'>
                {cnt.client ?? '-'}
              </TableColBody>

              {/* Moneda */}
              <TableColBody className='hidden xl:table-cell xl:w-1/12 text-center'>
                {cnt.moneda ?? '-'}
              </TableColBody>

              {/* Total */}
              <TableColBody className='hidden lg:table-cell lg:w-1/12 text-center'>
                {cnt.total}
              </TableColBody>

              {/* Estado */}
              <TableColBody className='w-2/12 lg:w-1/12 text-center'>
                <StatusIconStates
                  status={cnt.status.key as string}
                  labelActivo={cnt.status.value}
                  full={false}
                />
              </TableColBody>

              {/* Acciones */}
              <TableColBody className='w-3/12 sm:w-2/12 xl:w-1/12 text-center'>
                <Actions
                  editLink={`${prefix}/cotizaciones/${cnt.uuid}/editar`}
                  permEdit='quotations.change_quotations'
                  viewLink={`${prefix}/cotizaciones/${cnt.uuid}`}
                  permView='quotations.view_quotations'
                  pdfLink={cnt.uuid}
                  permPdf='quotations.view_quotations'
                  onDownloadPdf={() =>
                    handlerDownloadPdf(cnt.uuid, cnt.cotizacion)
                  }
                />
              </TableColBody>
            </TableRow>
          ))
        : null}
    </>
  )
}
export { QuotationTableRow }

async function getData(token: string) {
  if (token) {
    const response = await ApiFecthAuth(endPoints.quotations.status, token)
    return {
      props: {
        statusQtn: response.data
      },
      revalidate: 3600
    }
  }

  // Caso sin token
  return { props: { statusQtn: null }, revalidate: 3600 }
}
