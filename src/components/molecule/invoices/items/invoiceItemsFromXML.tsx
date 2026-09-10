import { ItemRow, moneySymbol } from '@/modules/invoice/utils'

type Props = {
  items: ItemRow[]
  currency: 'PEN' | 'USD'
  onEnableEdit: () => void
}

/**
 * InvoiceItemsFromXML
 * -------------------
 * Muestra los ítems importados desde un XML SUNAT
 * en modo solo lectura. Permite convertirlos a modo
 * editable bajo confirmación del usuario.
 */

export function InvoiceItemsFromXML({ items, currency, onEnableEdit }: Props) {
  return (
    <div className='mt-4 border border-slate-300 rounded-lg overflow-hidden'>
      <div className='flex justify-between items-center bg-cyan-900 text-white px-4 py-2'>
        <span className='font-semibold text-sm'>
          Ítems importados desde XML
        </span>

        <button
          type='button'
          onClick={onEnableEdit}
          className='text-xs bg-white text-cyan-900 px-2 py-1 rounded hover:bg-cyan-100'
        >
          Convertir a editable
        </button>
      </div>

      {/* 🖥 Desktop */}
      <div className='hidden md:block'>
        <table className='w-full text-sm'>
          <thead className='bg-slate-100'>
            <tr>
              <th className='p-2 w-1/12 text-center'>Cantidad</th>
              <th className='p-2 w-1/12 text-center'>Unidad</th>
              <th className='p-2 w-8/12 text-left'>Descripción</th>
              <th className='p-2 w-2/12 text-right whitespace-nowrap'>
                Valor Unit.
              </th>
            </tr>
          </thead>

          <tbody>
            {items.map((it) => (
              <tr key={it.id} className='border-t align-top'>
                <td className='p-2 w-1/12 text-center'>{it.quantity}</td>

                <td className='p-2 w-1/12 text-center'>{it.unit}</td>

                <td className='p-2 w-8/12 break-words'>{it.description}</td>

                <td className='p-2 w-2/12 text-right whitespace-nowrap font-medium'>
                  {moneySymbol(currency)} {it.unitPrice.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 📱 Mobile */}
      <div className='block md:hidden divide-y'>
        {items.map((it, i) => (
          <div key={it.id} className='p-3 text-sm'>
            <div className='font-semibold'>Ítem {i + 1}</div>
            <div>Cantidad: {it.quantity}</div>
            <div>Unidad: {it.unit}</div>
            <div className='mt-1'>{it.description}</div>
            <div className='font-medium mt-1 whitespace-nowrap'>
              {moneySymbol(currency)} {it.unitPrice.toFixed(2)}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
