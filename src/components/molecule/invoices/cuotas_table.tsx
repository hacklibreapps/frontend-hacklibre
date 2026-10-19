import { moneySymbol } from '@/modules/invoice/utils'

export type Cuota = {
  nro: number
  fechaVencimiento: string
  monto: number
}

type Money = 'PEN' | 'USD'

type Props = {
  cuotas: Cuota[]
  money: Money
  locked: boolean
  onChangeFecha?: (nro: number, fecha: string) => void
}

const CuotasTable: React.FC<Props> = ({
  cuotas,
  money,
  locked,
  onChangeFecha
}) => (
  <div className='mt-4'>
    <table className='w-full text-xs border border-slate-300'>
      <thead className='bg-slate-200'>
        <tr>
          <th className='border px-2 py-1'>N° Cuota</th>
          <th className='border px-2 py-1'>Fec. Venc.</th>
          <th className='border px-2 py-1 text-right'>Monto</th>
        </tr>
      </thead>
      <tbody>
        {cuotas.map((c) => (
          <tr key={c.nro}>
            <td className='border px-2 py-1 text-center'>{c.nro}</td>
            <td className='border px-2 py-1'>
              {locked ? (
                c.fechaVencimiento
              ) : (
                <input
                  type='date'
                  value={c.fechaVencimiento}
                  onChange={(e) => onChangeFecha?.(c.nro, e.target.value)}
                  className='w-full border rounded px-1 h-8'
                />
              )}
            </td>
            <td className='border px-2 py-1 text-right'>
              {moneySymbol(money)} {c.monto.toFixed(2)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)

export { CuotasTable }
