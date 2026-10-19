import React from 'react'
import { FacturaCompraItemInterface } from '@/interfaces/structures/bodyFormInterface'
import { KeyValueInterface } from '@/interfaces/structures/keyValueInterface'
import { RiAddLine, RiDeleteBin6Line } from 'react-icons/ri'

interface Props {
  items: FacturaCompraItemInterface[]
  setItems: React.Dispatch<
    React.SetStateAction<FacturaCompraItemInterface[]>
  >
  unidadMedidaList: KeyValueInterface[]
}

const FacturaCompraItems: React.FC<Props> = ({
  items,
  setItems,
  unidadMedidaList
}) => {
  const addItem = () => {
    setItems((prev) => [
      ...prev,
      {
        cantidad: 1,
        unidad_medida: '',
        descripcion: '',
        valor_unitario: '0.00',
        icbper: '0.00'
      }
    ])
  }

  const updateItem = <K extends keyof FacturaCompraItemInterface>(
    index: number,
    field: K,
    value: FacturaCompraItemInterface[K]
  ) => {
    setItems((prev) =>
      prev.map((item, currentIndex) =>
        currentIndex === index
          ? {
              ...item,
              [field]: value
            }
          : item
      )
    )
  }

  const removeItem = (index: number) => {
    setItems((prev) =>
      prev.filter((_, currentIndex) => currentIndex !== index)
    )
  }

  return (
    <div className='space-y-3'>
      <div className='overflow-x-auto'>
        <table className='w-full text-sm border border-slate-300 rounded-md'>
          <thead className='bg-slate-100 text-slate-700'>
            <tr>
              <th className='px-2 py-2 text-center w-[8%]'>
                Cant.
              </th>

              <th className='px-3 py-2 text-center w-[12%]'>
                UM
              </th>

              <th className='px-3 py-2 text-center'>
                Descripción
              </th>

              <th className='px-2 py-2 text-center w-[15%]'>
                Valor Unit.
              </th>

              <th className='px-2 py-2 text-center w-[12%]'>
                ICBPER
              </th>

              <th className='px-2 py-2 w-[5%]'></th>
            </tr>
          </thead>

          <tbody>
            {items.map((it, i) => (
              <tr key={i} className='border-t'>
                {/* CANTIDAD */}
                <td className='px-2 py-1 text-right'>
                  <input
                    type='number'
                    min={1}
                    step='1'
                    className='w-full text-center border rounded px-2 py-1'
                    value={it.cantidad}
                    onChange={(e) =>
                      updateItem(
                        i,
                        'cantidad',
                        Number(e.target.value)
                      )
                    }
                  />
                </td>

                {/* UNIDAD DE MEDIDA */}
                <td className='px-2 py-1 text-center'>
                  <select
                    className='w-full border rounded px-2 py-1 text-center'
                    value={it.unidad_medida}
                    onChange={(e) =>
                      updateItem(
                        i,
                        'unidad_medida',
                        e.target.value
                      )
                    }
                  >
                    <option value=''>
                      Seleccione
                    </option>

                    {unidadMedidaList.map((unidad) => (
                      <option
                        key={String(unidad.key)}
                        value={String(unidad.key)}
                      >
                        {String(unidad.value)}
                      </option>
                    ))}
                  </select>
                </td>

                {/* DESCRIPCIÓN */}
                <td className='px-2 py-1'>
                  <input
                    type='text'
                    className='w-full border rounded px-2 py-1'
                    value={it.descripcion}
                    onChange={(e) =>
                      updateItem(
                        i,
                        'descripcion',
                        e.target.value
                      )
                    }
                  />
                </td>

                {/* VALOR UNITARIO */}
                <td className='px-2 py-1 text-right'>
                  <input
                    type='number'
                    min='0'
                    step='0.01'
                    className='w-full text-right border rounded px-2 py-1'
                    value={it.valor_unitario}
                    onFocus={(e) => e.target.select()}
                    onChange={(e) =>
                      updateItem(
                        i,
                        'valor_unitario',
                        e.target.value
                      )
                    }
                  />
                </td>

                {/* ICBPER */}
                <td className='px-2 py-1 text-right'>
                  <input
                    type='number'
                    min='0'
                    step='0.01'
                    className='w-full text-right border rounded px-2 py-1'
                    value={it.icbper ?? '0.00'}
                    onFocus={(e) => e.target.select()}
                    onChange={(e) =>
                      updateItem(
                        i,
                        'icbper',
                        e.target.value
                      )
                    }
                  />
                </td>

                {/* ELIMINAR */}
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