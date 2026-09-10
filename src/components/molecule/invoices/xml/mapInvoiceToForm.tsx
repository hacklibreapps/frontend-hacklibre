// src/modules/invoice/xml/mapInvoiceToForm.tsx

/**
 * mapInvoiceToForm
 * ----------------
 * Toma un ParsedInvoiceXML y:
 * - Asigna valores a los refs del formulario
 * - Setea moneda
 * - Convierte los items del XML a ItemRow para el módulo de factura
 */

import { uid } from '@/modules/invoice/utils'
import { ParsedInvoiceXML } from './types'
import { ItemRow } from '@/modules/invoice/utils'
import React from 'react'
import { InvoiceFormRefs } from './formRefs'
import { KeyValueInterface } from '@/interfaces/structures/keyValueInterface'

export function mapInvoiceToForm(
  parsed: ParsedInvoiceXML,
  refs: InvoiceFormRefs,
  setItems: React.Dispatch<React.SetStateAction<ItemRow[]>>,
  setHasDetraccion: (val: boolean) => void,
  setDataEditLeyendaDetraccion: (val?: KeyValueInterface) => void,
  setDataEditBienServicio: (val?: KeyValueInterface) => void,
  setDataEditMedioPagoDetraccion: (val?: KeyValueInterface) => void
) {
  // console.log('[MAP INVOICE TO FORM]', parsed)

  // ======================
  // DATOS DE FACTURA
  // ======================
  if (refs.invoiceNumberRef.current) {
    refs.invoiceNumberRef.current.value = parsed.invoiceNumber
  }

  if (refs.emissionDateRef.current) {
    refs.emissionDateRef.current.value = parsed.emissionDate
  }

  // ======================
  // DATOS DEL CLIENTE
  // ======================
  if (refs.senoresRef.current) {
    refs.senoresRef.current.value = parsed.customer.name
  }

  if (refs.rucClienteRef.current) {
    refs.rucClienteRef.current.value = parsed.customer.ruc
  }

  if (refs.direccionClienteRef.current) {
    refs.direccionClienteRef.current.value = parsed.customer.address
  }

  // ======================
  // TOTALES
  // ======================
  if (refs.opGravadaRef.current) {
    refs.opGravadaRef.current.value = Number(parsed.totals.opGravada).toFixed(2)
  }

  if (refs.igvRef.current) {
    refs.igvRef.current.value = Number(parsed.totals.igv).toFixed(2)
  }

  if (refs.importeTotalRef.current) {
    refs.importeTotalRef.current.value = Number(parsed.totals.total).toFixed(2)
  }

  // ======================
  // DETRACCIÓN (SPOT)
  // ======================

  if (parsed.detraccion) {
    setHasDetraccion(true)

    // Leyenda (fija por SUNAT cuando hay detracción)
    setDataEditLeyendaDetraccion({
      key: 'operacion_sujeta',
      value: 'Operación sujeta al Sistema de Pago de Obligaciones Tributarias'
    })

    // Bien / Servicio SPOT
    setDataEditBienServicio({
      key: parsed.detraccion.codigo,
      value: parsed.detraccion.codigo // luego el back pondrá el texto real
    })

    // Medio de pago
    if (parsed.detraccion.medioPago) {
      setDataEditMedioPagoDetraccion({
        key: parsed.detraccion.medioPago,
        value: parsed.detraccion.medioPago
      })
    }
  } else {
    setHasDetraccion(false)

    // Inputs normales
    // if (refs.porcentajeDetraccionRef?.current) {
    //   refs.porcentajeDetraccionRef.current.value = Number(
    //     parsed.detraccion.porcentaje
    //   ).toFixed(2)
    // }

    // if (refs.montoDetraccionRef?.current) {
    //   refs.montoDetraccionRef.current.value = Number(
    //     parsed.detraccion.monto
    //   ).toFixed(2)
    // }

    // if (refs.nroCuentaBNRef?.current && parsed.detraccion.cuenta) {
    //   refs.nroCuentaBNRef.current.value = parsed.detraccion.cuenta
  }
  // } else {
  //   setHasDetraccion(false)
  // }

  // ======================
  // OBSERVACIÓN
  // ======================
  if (refs.observationRef?.current) {
    refs.observationRef.current.value = parsed.observation
  }

  // ======================
  // ÍTEMS
  // ======================
  const mappedItems: ItemRow[] = parsed.items.map((it) => ({
    id: uid(),
    quantity: it.quantity || 1,
    unit: it.unit || 'UNIDAD',
    code: '',
    description: it.description || '',
    unitPrice: it.unitPrice || 0
  }))

  setItems(mappedItems)
}
