'use client'

import { createPortal } from 'react-dom'
import { useEffect, useState } from 'react'
import { IoClose } from 'react-icons/io5'
import { FiDownload, FiFileText } from 'react-icons/fi'

import { Table } from '@/components/atom/structures/tables'
import { InvoiceDocumentInterface } from '@/interfaces/querys/queryInterface'

interface InvoiceDocumentsModalProps {
  open: boolean
  onClose: () => void
  documents: InvoiceDocumentInterface[]
  invoiceNumber: string
}

const InvoiceDocumentsModal = ({
  open,
  onClose,
  documents,
  invoiceNumber
}: InvoiceDocumentsModalProps) => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    return () => {
      setMounted(false)
    }
  }, [])

  if (!mounted || !open) return null

  return createPortal(
    <div
      className='fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 px-4'
      style={{ zIndex: 999999 }}
      onClick={onClose}
    >
      <div
        className='relative z-[10000] w-full max-w-3xl rounded-lg bg-white shadow-xl'
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className='px-4 flex items-center justify-between border-b px-5 py-4'>
          <div>
            <h2 className='text-lg font-semibold text-Cian8'>
              Documentos del comprobante
            </h2>

            <p className='text-sm text-gray-500'>{invoiceNumber}</p>
          </div>

          <button
            type='button'
            onClick={onClose}
            className='text-2xl text-gray-500 hover:text-Red7'
          >
            <IoClose />
          </button>
        </div>

        {/* BODY */}
        <div className='max-h-[60vh] overflow-y-auto p-5'>
          {documents.length > 0 ? (
            <Table>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell className='w-1/12'>Nro.</Table.HeaderCell>

                  <Table.HeaderCell className='w-6/12'>
                    Documento
                  </Table.HeaderCell>

                  <Table.HeaderCell className='w-2/12'>
                    Archivo
                  </Table.HeaderCell>

                  <Table.HeaderCell className='w-3/12'>Acción</Table.HeaderCell>
                </Table.Row>
              </Table.Header>

              <Table.Body>
                {documents.map((doc, index) => (
                  <Table.Row key={doc.uuid}>
                    <Table.Cell>{index + 1}</Table.Cell>

                    <Table.Cell textAlign='text-center'>
                      {doc.title || '-'}
                    </Table.Cell>

                    <Table.Cell>
                      <FiFileText className='mx-auto text-xl text-Cian7' />
                    </Table.Cell>

                    <Table.Cell>
                      <a
                        href={doc.document}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='inline-flex items-center gap-2 rounded-md bg-Cian7 px-3 py-2 text-sm text-white hover:bg-Cian8'
                      >
                        <FiDownload />
                        Descargar
                      </a>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          ) : (
            <div className='py-10 text-center text-gray-500'>
              No hay documentos asociados.
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className='flex justify-end border-t px-5 py-4'>
          <button
            type='button'
            onClick={onClose}
            className='rounded-md bg-Greys mr-4 px-4 py-2 text-sm hover:bg-Cian2'
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}

export { InvoiceDocumentsModal }
