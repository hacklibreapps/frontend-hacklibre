import React from 'react'
import { FacturaCompraItemInterface } from '@/interfaces/structures/bodyFormInterface'
import { RiAddLine, RiDeleteBin6Line } from 'react-icons/ri'

interface Props {
  items: FacturaCompraItemInterface[]
  setItems: React.Dispatch<React.SetStateAction<FacturaCompraItemInterface[]>>
}

const FacturaCompraItems: React.FC<Props> = ({ items, setItems }) => {
  const addItem = () =>
    setItems([
      ...items,
      {
        cantidad: 1,
        unidad_medida: 'NIU',
        descripcion: '',
        valor_unitario: '0.00',
        icbper: '0.00'
      }
    ])

  const updateItem = <K extends keyof FacturaCompraItemInterface>(
    index: number,
    field: K,
    value: FacturaCompraItemInterface[K]
  ) => {
    const copy = [...items]
    copy[index] = { ...copy[index], [field]: value }
    setItems(copy)
  }

  const removeItem = (index: number) =>
    setItems(items.filter((_, i) => i !== index))

  return (
    <div className='space-y-3'>
      <div className='overflow-x-auto'>
        <table className='w-full text-sm border border-slate-300 rounded-md'>
          <thead className='bg-slate-100 text-slate-700'>
            <tr>
              <th className='px-2 py-2 text-center w-[8%]'>Cant.</th>
              <th className='px-3 py-2 text-center w-[12%]'>UM</th>
              <th className='px-3 py-2 text-center'>Descripción</th>
              <th className='px-2 py-2 text-center w-[15%]'>Valor Unit.</th>
              <th className='px-2 py-2 text-center w-[12%]'>ICBPER</th>
              <th className='px-2 py-2 w-[5%]'></th>
            </tr>
          </thead>

          <tbody>
            {items.map((it, i) => (
              <tr key={i} className='border-t'>
                {/* Cantidad */}
                <td className='px-2 py-1 text-right'>
                  <input
                    type='number'
                    min={1}
                    className='w-full text-center border  rounded px-2 py-1'
                    value={it.cantidad}
                    onChange={(e) =>
                      updateItem(i, 'cantidad', Number(e.target.value))
                    }
                  />
                </td>

                {/* UM */}
                <td className='px-2 py-1 text-center'>
                  <select
                    className='w-full border rounded px-2 py-1 text-center'
                    value={it.unidad_medida}
                    onChange={(e) =>
                      updateItem(i, 'unidad_medida', e.target.value)
                    }
                  >
                    <option value='NIU'>Unidad</option>
                    <option value='KG'>Kg</option>
                    <option value='ZZ'>Servicio</option>
                  </select>
                </td>

                {/* Descripción */}
                <td className='px-2 py-1'>
                  <input
                    className='w-full border rounded px-2 py-1'
                    value={it.descripcion}
                    onFocus={(e) => e.target.select()}
                    onChange={(e) =>
                      updateItem(i, 'descripcion', e.target.value)
                    }
                  />
                </td>

                {/* Valor unitario */}
                <td className='px-2 py-1 text-right'>
                  <input
                    type='number'
                    className='w-full text-right border rounded px-2 py-1'
                    value={it.valor_unitario}
                    onFocus={() => {
                      updateItem(i, 'valor_unitario', '')
                    }}
                    onChange={(e) =>
                      updateItem(i, 'valor_unitario', e.target.value)
                    }
                  />
                </td>

                {/* ICBPER */}
                <td className='px-2 py-1 text-right'>
                  <input
                    type='number'
                    className='w-full text-right border rounded px-2 py-1'
                    value={it.icbper}
                    onFocus={() => {
                      updateItem(i, 'icbper', '')
                    }}
                    onChange={(e) => updateItem(i, 'icbper', e.target.value)}
                  />
                </td>

                {/* Eliminar */}
                <td className='px-2 py-1 text-center'>
                  <button
                    type='button'
                    onClick={() => removeItem(i)}
                    className='text-red-500 hover:text-red-700'
                    title='Eliminar ítem'
                  >
                    <RiDeleteBin6Line size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Agregar ítem */}
      <button
        type='button'
        onClick={addItem}
        className='inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800'
      >
        <RiAddLine size={18} />
        Agregar ítem
      </button>
    </div>
  )
}

export default FacturaCompraItems
