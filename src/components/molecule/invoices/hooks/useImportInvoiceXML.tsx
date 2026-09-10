// src/components/molecule/invoices/hooks/useImportInvoiceXML.tsx

/**
 * useImportInvoiceXML
 * -------------------
 * Hook encargado de importar un XML SUNAT,
 * parsearlo y mapearlo al formulario de factura.
 */

import { useState } from 'react'
import { ItemRow } from '@/modules/invoice/utils'

import { mapInvoiceToForm } from '../xml/mapInvoiceToForm'
import { parseInvoiceXML } from '../xml/parseInvoiceXML'
import { InvoiceFormRefs } from '../xml/formRefs'
import { KeyValueInterface } from '@/interfaces/structures/keyValueInterface'
import { ParsedInvoiceXML } from '../xml/types'

export type InvoiceDocumentType =
  | 'FACTURA ELECTRÓNICA'
  | 'BOLETA ELECTRÓNICA'
  | 'NOTA DE CRÉDITO'
  | 'NOTA DE DÉBITO'

type UseImportInvoiceXMLProps = {
  refs: InvoiceFormRefs
  setItems: React.Dispatch<React.SetStateAction<ItemRow[]>>
  setMoney: (val: 'PEN' | 'USD') => void
  setDataEditMoneda: (val?: KeyValueInterface) => void
  setResetMoneda?: React.Dispatch<React.SetStateAction<boolean>>

  setObservation: (val: string) => void
  setItemsFromXML: (val: boolean) => void

  // detracción (UI auxiliar)
  setHasDetraccion: (val: boolean) => void
  setDetraccionFromXML: (val: boolean) => void
  setDataEditLeyendaDetraccion: (val?: KeyValueInterface) => void
  setDataEditBienServicio: (val?: KeyValueInterface) => void
  setDataEditMedioPagoDetraccion: (val?: KeyValueInterface) => void

  setTipoDePago: (val: 'CONT' | 'CRED') => void
  setNroDeCuotas: (val: number) => void
  setCreditoFromXML: (val: ParsedInvoiceXML['credito'] | null) => void

  setDataEditFormaPago: (val?: KeyValueInterface) => void

  setPorcentajeDetraccion: (val: number) => void
  setMontoDetraccion: (val: number) => void
  setCuentaBN: (val: string) => void

  setLockedFromXML: (val: boolean) => void //BLoqueo Campos luego de la importacion
  setIsXMLImport: (val: boolean) => void
  onSuccess?: (tipo: InvoiceDocumentType) => void
  onError?: () => void
}

export function useImportInvoiceXML({
  refs,
  setItems,
  setMoney,
  setDataEditMoneda,

  setObservation,
  setItemsFromXML,
  setHasDetraccion,
  setDetraccionFromXML,
  setDataEditLeyendaDetraccion,
  setDataEditBienServicio,
  setDataEditMedioPagoDetraccion,
  setTipoDePago,
  setNroDeCuotas,
  setCreditoFromXML,
  setDataEditFormaPago,
  setPorcentajeDetraccion,
  setMontoDetraccion,
  setCuentaBN,
  setIsXMLImport,
  setLockedFromXML,
  onSuccess,
  onError
}: UseImportInvoiceXMLProps) {
  const [loading, setLoading] = useState(false)
  const importXML = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setLoading(true)

    try {
      const buffer = await file.arrayBuffer()
      const decoder = new TextDecoder('iso-8859-1') // SUNAT encoding
      const xmlText = decoder.decode(buffer)

      const parsed = parseInvoiceXML(xmlText)

      // ======================
      // FORMA DE PAGO / CRÉDITO
      // ======================
      setTipoDePago(parsed.formaPago)

      setDataEditFormaPago({
        key: parsed.formaPago === 'CRED' ? 'credito' : 'contado',
        value: parsed.formaPago === 'CRED' ? 'Crédito' : 'Al contado'
      })

      // CRÉDITO
      if (parsed.formaPago === 'CRED' && parsed.credito) {
        setCreditoFromXML(parsed.credito) // 🔥 CLAVE
        setNroDeCuotas(parsed.credito.cuotas.length)
      } else {
        setCreditoFromXML(null)
        setNroDeCuotas(1)
      }

      // ======================
      // MONEDA
      // ======================

      if (parsed.currency === 'PEN' || parsed.currency === 'USD') {
        setMoney(parsed.currency)

        setDataEditMoneda({
          key: parsed.currency,
          value: parsed.currency === 'USD' ? 'DÓLAR AMERICANO' : 'SOLES'
        })
      }

      // ======================
      // DETRACCIÓN (SUNAT)
      // ======================
      const hasDetraccion = !!parsed.detraccion
      setHasDetraccion(hasDetraccion)
      setDetraccionFromXML(hasDetraccion) // ✅ AQUÍ ES EL LUGAR CORRECTO

      if (parsed.detraccion) {
        setPorcentajeDetraccion(Number(parsed.detraccion.porcentaje) || 0)
        setMontoDetraccion(Number(parsed.detraccion.monto) || 0)
        setCuentaBN(parsed.detraccion.cuenta || '')
      } else {
        setPorcentajeDetraccion(0)
        setMontoDetraccion(0)
        setCuentaBN('')
      }

      //DOM
      mapInvoiceToForm(
        parsed,
        refs,
        setItems,
        setHasDetraccion,
        setDataEditLeyendaDetraccion,
        setDataEditBienServicio,
        setDataEditMedioPagoDetraccion
      )
      setIsXMLImport(true)
      setItemsFromXML(true)

      setLockedFromXML(true)

      // ✅ OBSERVACIÓN
      if (parsed.observation) {
        setObservation(parsed.observation)
      }

      onSuccess?.('FACTURA ELECTRÓNICA')
    } catch (error) {
      console.error('[XML IMPORT]', error)
      onError?.()
    } finally {
      setLoading(false)
      e.target.value = ''
    }
  }

  return {
    importXML,
    loading
  }
}
