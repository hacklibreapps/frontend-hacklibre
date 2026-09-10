import React from 'react'

export type InvoiceFormRefs = {
  invoiceNumberRef: React.RefObject<HTMLInputElement>
  emissionDateRef: React.RefObject<HTMLInputElement>
  senoresRef: React.RefObject<HTMLInputElement>
  rucClienteRef: React.RefObject<HTMLInputElement>
  direccionClienteRef: React.RefObject<HTMLInputElement>
  opGravadaRef: React.RefObject<HTMLInputElement>
  igvRef: React.RefObject<HTMLInputElement>
  importeTotalRef: React.RefObject<HTMLInputElement>
  observationRef?: React.RefObject<HTMLTextAreaElement>
  bienServicioRef?: React.RefObject<HTMLInputElement>
  porcentajeDetraccionRef?: React.RefObject<HTMLInputElement>
  montoDetraccionRef?: React.RefObject<HTMLInputElement>
  leyendaDetraccionRef?: React.RefObject<HTMLInputElement>
  medioPagoDetraccionRef?: React.RefObject<HTMLInputElement>
  nroCuentaBNRef?: React.RefObject<HTMLInputElement>
}
