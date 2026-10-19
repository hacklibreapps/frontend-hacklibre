'use client'
import { FacturacionInterface } from '@/interfaces/querys/queryInterface'
import { TiArrowLeft, TiArrowRight } from 'react-icons/ti'
import { TableCounter } from '@/components/atom/auth/structures/tableCounter'
import { formatDateTime } from '@/utils/formatDate'
import { StatusIcon } from '@/components/atom/auth/structures/status/statusIcon'
import { ActionGroupButton, ItemActionGroup } from '@/utils/actionGroupButton'
import { Table } from '@/components/atom/structures/tables'
import { formatMoney } from '@/utils/formatMoney'
import { LuGalleryVerticalEnd } from 'react-icons/lu'
import { InvoiceDocumentsModal } from '@/utils/modals/invoiceModal'
import { useState } from 'react'
import { Icons } from '@/utils/icons'

const InvoiceItem = ({
  item,
  idx,
  page
}: {
  item: FacturacionInterface
  idx: number
  page: string
}) => {
  const [documentsOpen, setDocumentsOpen] = useState(false)

  const invoiceNumber = `${item.invoiceSerialNr}-${item.invoiceCorrelativeNr}`

  return (
    <>
      <Table.Row className='border-t hover:bg-slate-50 transition-colors'>
        <Table.Cell className='text-center hidden sm:table-cell sm:w-1/12'>
          <div className='flex flex-col lg:flex-row justify-center items-center'>
            <div className='lg:pr-1 text-xl order-2 lg:order-1'>
              {item.invoiceType === 'Venta' ? (
                <span
                  className='text-Green7'
                  data-tooltip-id='tooltip'
                  data-tooltip-place='left'
                  data-tooltip-content={'Ingreso'}
                >
                  <TiArrowRight />
                </span>
              ) : (
                <span
                  className='text-Red7'
                  data-tooltip-id='tooltip'
                  data-tooltip-place='left'
                  data-tooltip-content={'Egreso'}
                >
                  <TiArrowLeft />
                </span>
              )}
            </div>
            <div className='order-1 lg:order-2'>
              <TableCounter nr={idx} page={page} />
            </div>
          </div>
        </Table.Cell>
        <Table.Cell className='text-center w-3/12 lg:w-1/12'>
          {item.invoiceType || '-'}
        </Table.Cell>
        <Table.Cell className='text-center w-4/12 lg:w-1/12'>
          {`${item.invoiceSerialNr}-${item.invoiceCorrelativeNr}`}
        </Table.Cell>
        <Table.Cell className='text-center hidden lg:table-cell lg:w-1/12'>
          {formatDateTime(item.emitionDate, true)}
        </Table.Cell>
        <Table.Cell className='text-center hidden lg:table-cell lg:w-2/12'>
          {item.clientName ?? '-'}
        </Table.Cell>
        <Table.Cell className='text-center hidden xl:table-cell xl:w-1/12'>
          {item.moneyName ?? '-'}
        </Table.Cell>
        <Table.Cell className='text-center hidden lg:table-cell lg:w-1/12'>
          {formatMoney(item.importeTotal ?? 0, item.moneySign, 2)}
        </Table.Cell>
        <Table.Cell className='text-center text-xs hidden lg:table-cell lg:w-2/12'>
          {item.observations ? item.observations : '---'}
        </Table.Cell>
        <Table.Cell className='text-center w-2/12 lg:w-1/12'>
          <StatusIcon status={item.status} />{' '}
          {/*PENDIENTE EN CAMBIO DE STATUS*/}
        </Table.Cell>
        <Table.Cell className='text-center  w-3/12 sm:w-2/12 xl:w-1/12'>
          <ActionGroupButton>
            <ItemActionGroup
              url={`facturacion/comprobantes/${item.uuid}`}
              icon={<Icons name='view' className='text-Green7' />}
            />
            <ItemActionGroup
              onClick={() => setDocumentsOpen(true)}
              icon={<LuGalleryVerticalEnd className='text-Cian7' />}
            />
          </ActionGroupButton>
          <InvoiceDocumentsModal
            open={documentsOpen}
            onClose={() => setDocumentsOpen(false)}
            documents={item.documents ?? []}
            invoiceNumber={invoiceNumber}
          />
        </Table.Cell>
      </Table.Row>
    </>
  )
}
export { InvoiceItem }
