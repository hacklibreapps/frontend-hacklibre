/* eslint-disable @typescript-eslint/no-explicit-any */

import Input from '@/components/atom/structures/input'
import Select from '@/components/atom/structures/select'
import TextArea from '@/components/atom/structures/textArea'
import { TipoCambioInterface } from '@/interfaces/querys/queryInterface'
import { KeyValueInterface } from '@/interfaces/structures/keyValueInterface'
import {
  ItemCotizacionForm,
  ProductoInterface
} from '@/interfaces/structures/quotationsInterface'
import { formatMoney } from '@/utils/formatMoney'
// useCallback,
import { useEffect, useMemo, useRef, useState } from 'react'
import { BsTrash } from 'react-icons/bs'
function toProductKeyValues(
  productos: ProductoInterface[] | undefined | null,
  opts?: { includeSku?: boolean; sortByName?: boolean }
): KeyValueInterface[] {
  const { includeSku = false, sortByName = true } = opts ?? {}

  const mapped = (productos ?? [])
    .filter((p) => p?.uuid && p?.nombre) // sanea
    .map((p) => ({
      key: p.uuid,
      value:
        includeSku && p.sku
          ? `${p.nombre} - ${formatMoney(p.precioVenta, p.moneda.simbol)} (${
              p.sku
            })`
          : `${p.nombre} - ${formatMoney(p.precioVenta, p.moneda.simbol)}`
    }))

  // elimina duplicados por key (por si acaso)
  const dedup = Array.from(
    new Map(mapped.map((i) => [String(i.key), i])).values()
  )

  if (sortByName) {
    dedup.sort((a, b) => a.value.localeCompare(b.value, 'es'))
  }
  return dedup
}

const ItemCotizacion = ({
  it,
  idx,
  actualizarItem,
  productosQtn,
  eliminarItem,
  tc,
  currentMoney,
  uuid
}: {
  it: ItemCotizacionForm
  idx: number
  actualizarItem: (
    idx: number,
    campo: keyof ItemCotizacionForm | 'producto_uuid',
    valor: any
  ) => void
  productosQtn: ProductoInterface[]
  eliminarItem: (idx: number) => void
  currentMoney: KeyValueInterface | null
  tc: TipoCambioInterface
  uuid?: string
}) => {
  const productRef = useRef<HTMLInputElement>(null)
  const qtyRef = useRef<HTMLInputElement>(null)
  const unitPriceRef = useRef<HTMLInputElement>(null)
  const dsctoRef = useRef<HTMLInputElement>(null)
  const textAreaRef = useRef<HTMLTextAreaElement>(null)
  const tituloRef = useRef<HTMLInputElement>(null)
  const [dataEditProduct, setDataEditProduct] =
    useState<KeyValueInterface | null>(null)

  const productosOptions = useMemo(
    () => toProductKeyValues(productosQtn, { includeSku: true }), // o false si no quieres SKU
    [productosQtn]
  )
  const [resetProduct, setResetProduct] = useState<boolean>(false)

  const activarYactualizarItem = (id: number, e: string) => {
    actualizarItem(id, 'producto_uuid', e)
  }

  const lastAppliedRef = useRef<string | null>(null)
  const lastProductRef = useRef<string | null>(null)

  useEffect(() => {
    if (uuid && it.producto) {
      const prodSelected = productosOptions.find(
        (p) => p.key === it.producto?.uuid
      )
      if (prodSelected)
        setDataEditProduct({
          key: prodSelected.key,
          value: prodSelected.value
        })
    }
  }, [it.producto, productosOptions, uuid])
  
  useEffect(() => {
    if (!it) return
    // 🚫 No aplicar conversión si el item no tiene producto aún (recién creado)
    if (!it.producto?.uuid) return
    // 🚫 No aplicar si aún no hay tipo de cambio válido
    if (!tc) return
    // 🚫 No aplicar si el precio está vacío o inicial
    if (it.precioUnitario <= 0) return

    const currentProduct = it.producto?.moneda.value || null
    const currentCurrency = currentMoney

    const productChanged = currentProduct !== lastProductRef.current
    const currencyChanged = currentCurrency !== lastAppliedRef.current

    if (!productChanged && !currencyChanged) return

    if (!currentCurrency) return

    // ⚠️ Evita aplicar si la moneda del producto ya coincide
    if (currentCurrency.value === it.producto.moneda.value) {
      lastProductRef.current = currentProduct
      lastAppliedRef.current = currentCurrency.value
      return
    }

    // 🔁 Aplica tipo de cambio una sola vez
    let nuevoPrecioUnitario = it.precioUnitario

    if (currentCurrency.value === 'USD') {
      nuevoPrecioUnitario = Number((it.precioUnitario / tc.venta).toFixed(3))
    } else if (currentCurrency.value === 'PEN') {
      nuevoPrecioUnitario = Number((it.precioUnitario * tc.compra).toFixed(3))
    }

    // 🧮 Recalcular los valores dependientes
    const descuentoFactor = 1 - (it.descuentoPct || 0) / 100
    const nuevoSubtotal = Number(
      (it.cantidad * nuevoPrecioUnitario * descuentoFactor).toFixed(3)
    )
    const nuevoIgv = Number(((nuevoSubtotal * it.igvPct) / 100).toFixed(3))
    const nuevoTotal = Number((nuevoSubtotal + nuevoIgv).toFixed(3))

    // 🔁 Actualizar todo el item
    const nuevoItem = {
      ...it,
      precioUnitario: nuevoPrecioUnitario,
      subtotal: nuevoSubtotal,
      igv: nuevoIgv,
      total: nuevoTotal,
      moneda: {
        ...it.moneda,
        value: currentCurrency,
        key: currentCurrency,
        simbol: currentCurrency.value === 'USD' ? '$' : 'S/'
      }
    }

    actualizarItem(idx, 'precioUnitario', nuevoPrecioUnitario)
    actualizarItem(idx, 'subtotal', nuevoSubtotal)
    actualizarItem(idx, 'igv', nuevoIgv)
    actualizarItem(idx, 'total', nuevoTotal)
    actualizarItem(idx, 'moneda', nuevoItem.moneda)

    // 🧭 Actualiza referencias de control
    lastAppliedRef.current = currentCurrency.value
    lastProductRef.current = currentProduct
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentMoney, it?.producto?.uuid])

  const handlerRestartResetProduct = () => {
    if (resetProduct) {
      setResetProduct(false)
    }
    it.cantidad = 1
    it.nombre = ''
    it.descripcion = ''
    it.descuentoPct = 0
    it.igv = 0
    it.moneda = {
      key: String(currentMoney?.key),
      value: currentMoney?.value || '',
      simbol: currentMoney?.attr || ''
    } as { key: string; value: string; simbol: string }
    it.precioUnitario = 0
    it.producto = undefined
    it.subtotal = 0
    it.total = 0
  }

  const baseUnitUSDRef = useRef<number | null>(null)
  const lastWrittenRef = useRef<number | null>(null)

  useEffect(() => {
    baseUnitUSDRef.current = null
    lastWrittenRef.current = null
  }, [it?.producto?.uuid])

  const formData = {
    product: {
      name: 'product',
      id: 'product',
      label: 'Producto',
      ref: productRef,
      showLabel: true,
      data: productosOptions,
      tiny: true,
      required: true,
      editData: dataEditProduct,
      onChange: (e: string) => activarYactualizarItem(idx, e),
      resetSignal: resetProduct,
      resetHandler: handlerRestartResetProduct
    },
    qty: {
      name: 'Qty',
      id: 'Qty',
      showLabel: true,
      ref: qtyRef,
      required: true,
      label: 'Cantidad',
      tiny: true,
      minLen: 0,
      value: it.cantidad,
      type: 'number',
      onKeyUp: (e: React.KeyboardEvent<HTMLInputElement> | string) => {
        const value =
          typeof e === 'string'
            ? e
            : (e.currentTarget as HTMLInputElement).value
        actualizarItem(idx, 'cantidad', Number(value))
      }
    },
    unitPrice: {
      name: 'unitPrice',
      id: 'unitPrice',
      showLabel: true,
      ref: unitPriceRef,
      required: true,
      label: `Precio Unitario (${
        currentMoney
          ? currentMoney.attr
            ? currentMoney.attr
            : currentMoney.value
          : ' '
      }) (no inc. IGV)`,
      tiny: true,
      minLen: 0,
      inputMode: 'decimal' as const,
      step: '0.001',
      defaultValue: 0,
      type: 'number',
      onKeyUp: (e: React.KeyboardEvent<HTMLInputElement> | string) => {
        const value =
          typeof e === 'string'
            ? e
            : (e.currentTarget as HTMLInputElement).value
        actualizarItem(idx, 'precioUnitario', Number(value))
      }
    },
    dcto: {
      name: 'desc',
      id: 'desc',
      showLabel: true,
      ref: dsctoRef,
      required: true,
      label: 'Desc. %',
      tiny: true,
      value: it.descuentoPct,
      minLen: 0,
      maxLen: 100,
      type: 'number',
      onKeyUp: (e: React.KeyboardEvent<HTMLInputElement> | string) => {
        const value =
          typeof e === 'string'
            ? e
            : (e.currentTarget as HTMLInputElement).value
        actualizarItem(idx, 'descuentoPct', Number(value))
      }
    },
    nombre: {
      name: 'nombre',
      id: 'nombre',
      showLabel: true,
      ref: tituloRef,
      required: true,
      label: 'Nombre Producto',
      tiny: true,
      value: it.nombre ? it.nombre : '',
      type: 'input',
      onKeyUp: (e: React.KeyboardEvent<HTMLInputElement> | string) => {
        const value =
          typeof e === 'string'
            ? e
            : (e.currentTarget as HTMLInputElement).value
        actualizarItem(idx, 'nombre', value)
      }
    },
    descripcion: {
      name: 'descripcion',
      id: 'desc',
      showLabel: true,
      ref: textAreaRef,
      required: true,
      label: 'Descripción',
      tiny: true,
      value: it.descripcion,
      type: 'tinyMCE',
      row: 300,
      defaultValue: it.descripcion,
      onChange: (e: React.KeyboardEvent<HTMLTextAreaElement> | string) =>
        actualizarItem(idx, 'descripcion', e)
    }
  }
  return (
    <div className='w-full flex flex-col items-center justify-center border-b border-b-Greys'>
      <div className='w-full flex flex-col lg:flex-row justify-between items-center lg:items-start'>
        <div className=' w-full lg:w-7/12 2xl:w-8/12 relative pl-3 2xl:pr-3 flex flex-col justify-between items-start'>
          <div className='w-full'>
            <Select data={formData.product} />
          </div>
          <div className='w-full'>
            {!it.producto?.uuid ? <Input data={formData.nombre} /> : null}
          </div>
        </div>
        <div className='w-full lg:w-4/12 xl:w-4/12 2xl:w-4/12 flex flex-row justify-end items-end flex-wrap'>
          <div className='w-full sm:w-1/3 md:w-1/3 lg:w-full pr-3 pl-3 lg:pl-0'>
            {!it.producto?.uuid ? <Input data={formData.unitPrice} /> : null}
          </div>
          <div className='w-1/2 sm:w-1/3 md:w-1/3 lg:w-1/2 pr-3 pl-3  sm:pl-0'>
            <Input data={formData.qty} />
          </div>
          <div className='w-1/2 sm:w-1/3 md:w-1/3 lg:w-1/2 pr-3 '>
            <Input data={formData.dcto} />
          </div>
        </div>
      </div>
      <div className='flex flex-row w-full justify-between font-medium items-center px-3'>
        <TextArea data={formData.descripcion} />
      </div>
      <div className='flex flex-col md:flex-row w-full justify-between items-center'>
        <div className='w-full md:w-auto pl-3 text-sm text-Cian8 py-2 flex flex-col xl:flex-row'>
          <div className='w-auto px-4'>
            <p className='pb-1 xl:pb-0'>
              Precio Unitario:{' '}
              <b>{formatMoney(it.precioUnitario, it.moneda.simbol)}</b>
            </p>
          </div>
          <p className='pb-1 xl:pb-0'>
            <span className='hidden xl:inline xl:px-2'>·</span> Dscto:{' '}
            <b>{Number(it.descuentoPct || 0).toFixed(3)}% </b>
          </p>
          <p className='pb-1 xl:pb-0'>
            <span className='hidden xl:inline xl:px-2'>·</span> Subtotal:{' '}
            <b>{formatMoney(it.subtotal, it.moneda.simbol)}</b>
          </p>
          <p className='pb-1 xl:pb-0'>
            <span className='hidden xl:inline xl:px-2'>·</span> IGV:{' '}
            <b>{formatMoney(it.igv, it.moneda.simbol)}</b>
          </p>
          <p className='pb-1 xl:pb-0'>
            <span className='hidden xl:inline xl:px-2'>·</span> Total ítem:{' '}
            <b>{formatMoney(it.total, it.moneda.simbol)}</b>
          </p>
        </div>
        {!it.producto?.uuid && (
          <div className='px-3 pb-2'>
            <label className='flex items-center text-sm text-Charcoal'>
              <input
                type='checkbox'
                checked={!!it.guardarNuevo}
                onChange={(e) =>
                  actualizarItem(idx, 'guardarNuevo', e.target.checked)
                }
                className='mr-2 accent-Cian8 cursor-pointer'
              />
              Guardar este producto como nuevo
            </label>
          </div>
        )}
        <div className='pr-3 pb-3 md:pb-0'>
          <div className='w-full flex justify-end py-2 items-start mt-3 md:mt-0'>
            <button
              type='button'
              className='text-Red7 text-sm font-medium hover:underline flex items-center'
              onClick={() => eliminarItem(idx)}
            >
              <BsTrash className='mr-1' /> Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export { ItemCotizacion }
