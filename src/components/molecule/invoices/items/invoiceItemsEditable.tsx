/**
 * InvoiceItemsEditable
 * --------------------
 * Módulo responsable de mostrar y manejar la edición manual
 * de los ítems de una factura.
 *
 * Se utiliza cuando:
 * - La factura se crea manualmente
 * - O cuando el usuario decide convertir los ítems importados
 *   desde XML a un formato editable
 *
 * Este componente:
 * - Permite agregar, editar y eliminar ítems
 * - Es completamente responsive (desktop + mobile)
 * - No contiene lógica de importación XML
 *
 * La fuente de verdad de los ítems es el estado `items`
 * manejado en FacturaMod.tsx
 */

'use client'

import { RiAddLine } from 'react-icons/ri'
import { ItemRow, uid, parseNum } from '@/modules/invoice/utils'
import { KeyValueInterface } from '@/interfaces/structures/keyValueInterface'
import Select from '@/components/atom/structures/select'
import { useRef } from 'react'

type InvoiceItemsEditableProps = {
  items: ItemRow[]
  setItems: React.Dispatch<React.SetStateAction<ItemRow[]>>
  currency: 'PEN' | 'USD'
  unidadMedidaList: KeyValueInterface[]
  locked?: boolean
}

const InvoiceItemsEditable: React.FC<InvoiceItemsEditableProps> = ({
  items,
  setItems,
  unidadMedidaList,
  locked = false
}) => {
  // Ref
  const unitRef = useRef<HTMLInputElement>(null)

  if (!unidadMedidaList || unidadMedidaList.length === 0) {
    return null
  }

  return (
    <div className='mt-4'>
      <p className='font-bold text-md uppercase mb-2'>PRODUCTOS</p>

      {/* =====================
          📱 VISTA MÓVIL
      ===================== */}

      <div className='block md:hidden space-y-4'>
        {items.map((it, index) => (
          <div
            key={it.id}
            className='border border-slate-300 rounded-lg p-3 bg-white shadow-sm space-y-2'
          >
            <div className='flex justify-between items-center'>
              <h4 className='font-semibold text-slate-700'>Ítem {index + 1}</h4>
              <button
                type='button'
                onClick={() =>
                  setItems((prev) => prev.filter((r) => r.id !== it.id))
                }
                className='h-6 w-6 flex items-center justify-center border border-rose-400 text-rose-600 rounded hover:bg-rose-50'
                title='Eliminar ítem'
              >
                ✕
              </button>
            </div>

            <div className='grid grid-cols-1 gap-2 text-sm'>
              <div>
                <label className='block font-medium'>Cantidad</label>
                <input
                  type='number'
                  min={0}
                  className='w-full border rounded px-2 h-9 text-right'
                  value={it.quantity}
                  onChange={(e) =>
                    setItems((prev) =>
                      prev.map((r) =>
                        r.id === it.id
                          ? { ...r, quantity: parseNum(e.target.value) }
                          : r
                      )
                    )
                  }
                />
              </div>

              <div>
                <label className='block font-medium'>Unidad</label>
                <Select
                  data={{
                    name: `unit_${it.id}`,
                    id: `unit_${it.id}`,
                    label: 'Unidad',
                    showLabel: false,
                    ref: unitRef,
                    tiny: true,
                    readOnly: locked,
                    data: unidadMedidaList,
                    editData:
                      unidadMedidaList.find((u) => u.key === it.unit) ??
                      unidadMedidaList.find((u) => u.value === it.unit),
                    onChange: (key: string) =>
                      setItems((prev) =>
                        prev.map((r) =>
                          r.id === it.id ? { ...r, unit: key } : r
                        )
                      )
                  }}
                />
              </div>

              <div>
                <label className='block font-medium'>Código</label>
                <input
                  className='w-full border rounded px-2 h-9 text-center'
                  value={it.code}
                  onChange={(e) =>
                    setItems((prev) =>
                      prev.map((r) =>
                        r.id === it.id ? { ...r, code: e.target.value } : r
                      )
                    )
                  }
                />
              </div>

              <div>
                <label className='block font-medium'>Descripción</label>
                <input
                  className='w-full border rounded px-2 h-9'
                  value={it.description}
                  onChange={(e) =>
                    setItems((prev) =>
                      prev.map((r) =>
                        r.id === it.id
                          ? { ...r, description: e.target.value }
                          : r
                      )
                    )
                  }
                />
              </div>

              <div>
                <label className='block font-medium'>Valor unitario</label>
                <input
                  type='number'
                  min={0}
                  className='w-full border rounded px-2 h-9 text-right'
                  value={it.unitPrice}
                  onChange={(e) =>
                    setItems((prev) =>
                      prev.map((r) =>
                        r.id === it.id
                          ? { ...r, unitPrice: parseNum(e.target.value) }
                          : r
                      )
                    )
                  }
                />
              </div>
            </div>
          </div>
        ))}

        {/* Botón agregar ítem */}
        <div className='flex justify-end'>
          <button
            type='button'
            onClick={() =>
              setItems((prev) => [
                ...prev,
                {
                  id: uid(),
                  quantity: 1,
                  unit: 'UNIDAD',
                  code: '',
                  description: '',
                  unitPrice: 0
                }
              ])
            }
            className='flex items-center gap-2 px-4 py-2 border border-emerald-500 text-emerald-600 rounded-md text-sm hover:bg-emerald-50'
          >
            <RiAddLine size={18} />
            Agregar ítem
          </button>
        </div>
      </div>

      {/* =====================
          🖥 VISTA ESCRITORIO
      ===================== */}
      <div className='hidden md:block '>
        <table className='w-full border border-slate-300 text-sm'>
          <thead className='bg-slate-100'>
            <tr>
              <th className='p-2 w-[90px]'>Cantidad</th>
              <th className='p-2 w-[160px]'>Unidad</th>
              <th className='p-2 w-[140px]'>Código</th>
              <th className='p-2'>Descripción</th>
              <th className='p-2 w-[140px] text-right'>Valor Unit.</th>
              <th className='p-2 w-[90px]'></th>
            </tr>
          </thead>

          <tbody>
            {items.map((it) => (
              <tr key={it.id} className='border-t'>
                <td className='p-2'>
                  <input
                    type='number'
                    className='w-full h-9 border rounded px-2 text-right'
                    value={it.quantity}
                    onChange={(e) =>
                      setItems((prev) =>
                        prev.map((r) =>
                          r.id === it.id
                            ? { ...r, quantity: parseNum(e.target.value) }
                            : r
                        )
                      )
                    }
                  />
                </td>
                <td className='p-2 min-w-[140px]'>
                  <Select
                    data={{
                      name: `unit_${it.id}`,
                      id: `unit_${it.id}`,
                      label: 'Unidad',
                      showLabel: false,
                      ref: unitRef,
                      tiny: true,
                      readOnly: locked,
                      data: unidadMedidaList,
                      editData:
                        unidadMedidaList.find((u) => u.key === it.unit) ??
                        unidadMedidaList.find((u) => u.value === it.unit),
                      onChange: (key: string) =>
                        setItems((prev) =>
                          prev.map((r) =>
                            r.id === it.id ? { ...r, unit: key } : r
                          )
                        )
                    }}
                  />
                </td>

                <td className='p-2'>
                  <input
                    className='w-full h-9 border rounded px-2'
                    value={it.code}
                    onChange={(e) =>
                      setItems((prev) =>
                        prev.map((r) =>
                          r.id === it.id ? { ...r, code: e.target.value } : r
                        )
                      )
                    }
                  />
                </td>
                <td className='p-2'>
                  <input
                    className='w-full h-9 border rounded px-2'
                    value={it.description}
                    onChange={(e) =>
                      setItems((prev) =>
                        prev.map((r) =>
                          r.id === it.id
                            ? { ...r, description: e.target.value }
                            : r
                        )
                      )
                    }
                  />
                </td>
                <td className='p-2 text-right'>
                  <input
                    type='number'
                    className='w-full h-9 border rounded px-2 text-right'
                    value={it.unitPrice}
                    onChange={(e) =>
                      setItems((prev) =>
                        prev.map((r) =>
                          r.id === it.id
                            ? { ...r, unitPrice: parseNum(e.target.value) }
                            : r
                        )
                      )
                    }
                  />
                </td>
                <td className='p-2 text-center'>
                  <button
                    type='button'
                    onClick={() =>
                      setItems((prev) => prev.filter((r) => r.id !== it.id))
                    }
                    className='text-rose-600 hover:underline text-xs'
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className='flex justify-end mt-3'>
          <button
            type='button'
            onClick={() =>
              setItems((prev) => [
                ...prev,
                {
                  id: uid(),
                  quantity: 1,
                  unit: 'UNIDAD',
                  code: '',
                  description: '',
                  unitPrice: 0
                }
              ])
            }
            className='flex items-center gap-2 px-4 py-2 border border-emerald-500 text-emerald-600 rounded-md text-sm hover:bg-emerald-50'
          >
            <RiAddLine size={18} />
            Agregar ítem
          </button>
        </div>
      </div>
    </div>
  )
}

export default InvoiceItemsEditable
