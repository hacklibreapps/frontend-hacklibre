'use client'

import React from 'react'
import { CreditoState } from '../xml/types'

type Props = {
  credito: CreditoState
  onChangeFecha: (nro: number, fecha: string) => void
}

export const InvoiceCreditoUI: React.FC<Props> = ({
  credito,
  onChangeFecha
}) => {
  return (
    <div className='mt-4 border border-slate-300 rounded-lg p-4'>
      <p className='font-bold text-sm uppercase mb-2'>Crédito / Cuotas</p>

      <table className='w-full text-sm'>
        <thead className='bg-slate-100'>
          <tr>
            <th className='p-2 text-center'>#</th>
            <th className='p-2'>Fecha vencimiento</th>
            <th className='p-2 text-right'>Monto</th>
          </tr>
        </thead>
        <tbody>
          {credito.cuotas.map((c) => (
            <tr key={c.nro} className='border-t'>
              <td className='p-2 text-center'>{c.nro}</td>
              <td className='p-2'>
                <input
                  type='date'
                  className='border rounded px-2 h-8 w-full'
                  value={c.fechaVencimiento}
                  onChange={(e) => onChangeFecha(c.nro, e.target.value)}
                />
              </td>
              <td className='p-2 text-right'>{c.monto.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className='text-right mt-2 font-semibold'>
        Monto pendiente: {credito.montoPendiente.toFixed(2)}
      </div>
    </div>
  )
}
