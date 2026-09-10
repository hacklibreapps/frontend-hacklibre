// 'use client'

// import { useMemo, useState } from 'react'
// import { v4 as uuid } from 'uuid'

// // === Tipos ===
//  type Currency = 'PEN' | 'USD'
//  type Affectation = 'GRAVADA' | 'EXONERADA'

//  interface ClientForm {
//   ruc: string
//   name: string
//   address?: string
//  }

//  interface Item {
//   id: string
//   description: string
//   quantity: number
//   unitPrice: number
//   affectation: Affectation
//   detractionSubject: boolean // ¿Ítem sujeto al SPOT?
//  }

//  interface Installment {
//   id: string
//   dueDate: string // yyyy-mm-dd
//   amount: number
//  }

//  export default function InvoiceEditor() {
//   // Cabecera
//   const [issueDate, setIssueDate] = useState<string>(() => new Date().toISOString().slice(0, 10))
//   const [series, setSeries] = useState<string>('F001')
//   const [number, setNumber] = useState<number>(1)
//   const [currency, setCurrency] = useState<Currency>('PEN')

//   // Cliente
//   const [client, setClient] = useState<ClientForm>({ ruc: '', name: '', address: '' })

//   // Ítems
//   const [items, setItems] = useState<Item[]>([
//    { id: uuid(), description: 'Servicio de consultoría', quantity: 1, unitPrice: 1000, affectation: 'GRAVADA', detractionSubject: true },
//   ])

//   // Detracción SPOT (regla general > S/ 700 para la mayoría de bienes/servicios)
//   const [detractionEnabled, setDetractionEnabled] = useState<boolean>(true) // se puede forzar ON/OFF
//   const [detractionRate, setDetractionRate] = useState<number>(12) // % depende del tipo de operación (ej. 12% servicios empresariales)
//   const [bankAccount, setBankAccount] = useState<string>('0000-0000000') // Cuenta BN de detracciones del proveedor
//   const [detractionType, setDetractionType] = useState<string>('SERVICIOS EMPRESARIALES')

//   // Forma de pago (RS 123-2022): Contado / Crédito + cuotas
//   const [payForm, setPayForm] = useState<'CONTADO' | 'CREDITO'>('CONTADO')
//   const [installments, setInstallments] = useState<Installment[]>([])

//   // === Cálculos ===
//   const totals = useMemo(() => {
//    const gravada = items
//      .filter((i) => i.affectation === 'GRAVADA')
//      .reduce((acc, i) => acc + i.quantity * i.unitPrice, 0)
//    const exonerada = items
//      .filter((i) => i.affectation === 'EXONERADA')
//      .reduce((acc, i) => acc + i.quantity * i.unitPrice, 0)
//    const igv = +(gravada * 0.18).toFixed(2)
//    const total = +(gravada + exonerada + igv).toFixed(2)

//    // La detracción solo aplica si hay ítems sujetos y (regla general) total > 700 PEN
//    const anyDetractionItem = items.some((i) => i.detractionSubject)
//    const detractionBaseOk = currency === 'PEN' && total > 700
//    const detractionApplies = detractionEnabled && anyDetractionItem && detractionBaseOk
//    const detractionAmount = detractionApplies ? +(total * (detractionRate / 100)).toFixed(2) : 0

//    // Monto neto pendiente (para Forma de Pago AL CRÉDITO): total menos detracción (y otras deducciones si existieran)
//    const netPending = +(total - detractionAmount).toFixed(2)

//    return { gravada: +gravada.toFixed(2), exonerada: +exonerada.toFixed(2), igv, total, detractionApplies, detractionAmount, netPending }
//   }, [items, currency, detractionEnabled, detractionRate])

//   const installmentsSum = useMemo(
//    () => +installments.reduce((s, c) => s + (Number(c.amount) || 0), 0).toFixed(2),
//    [installments]
//   )

//   // === Helpers ===
//   const addItem = () => {
//    setItems((prev) => [
//     ...prev,
//     { id: uuid(), description: '', quantity: 1, unitPrice: 0, affectation: 'GRAVADA', detractionSubject: false },
//    ])
//   }
//   const removeItem = (id: string) => setItems((prev) => prev.filter((i) => i.id !== id))
//   const updateItem = (id: string, patch: Partial<Item>) =>
//    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, ...patch } : i)))

//   const addInstallment = () => setInstallments((p) => [...p, { id: uuid(), dueDate: '', amount: 0 }])
//   const updateInstallment = (id: string, patch: Partial<Installment>) =>
//    setInstallments((p) => p.map((q) => (q.id === id ? { ...q, ...patch } : q)))
//   const removeInstallment = (id: string) => setInstallments((p) => p.filter((q) => q.id !== id))

//   const fmt = (n: number) => new Intl.NumberFormat('es-PE', { style: 'currency', currency }).format(n || 0)

//   const cuotasOk = payForm === 'CREDITO' ? Math.abs(installmentsSum - totals.netPending) < 0.01 : true

//   return (
//    <div className="mx-auto max-w-6xl p-6 space-y-6 text-sm">
//     {/* Header */}
//     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//      <div className="space-y-2">
//       <h1 className="text-2xl font-semibold">Factura electrónica</h1>
//       <div className="flex items-center gap-2">
//        <label className="w-24">Serie</label>
//        <input value={series} onChange={(e) => setSeries(e.target.value.toUpperCase())} className="input" />
//       </div>
//       <div className="flex items-center gap-2">
//        <label className="w-24">Número</label>
//        <input type="number" value={number} onChange={(e) => setNumber(Number(e.target.value))} className="input" />
//       </div>
//      </div>

//      <div className="space-y-2">
//       <div className="flex items-center gap-2">
//        <label className="w-28">F. Emisión</label>
//        <input type="date" value={issueDate} onChange={(e) => setIssueDate(e.target.value)} className="input" />
//       </div>
//       <div className="flex items-center gap-2">
//        <label className="w-28">Moneda</label>
//        <select value={currency} onChange={(e) => setCurrency(e.target.value as Currency)} className="input">
//         <option value="PEN">PEN - Soles</option>
//         <option value="USD">USD - Dólares</option>
//        </select>
//       </div>
//      </div>

//      <div className="space-y-2">
//       <div className="flex items-center gap-2">
//        <label className="w-28">RUC Cliente</label>
//        <input value={client.ruc} onChange={(e) => setClient({ ...client, ruc: e.target.value })} className="input" />
//       </div>
//       <div className="flex items-center gap-2">
//        <label className="w-28">Razón social</label>
//        <input value={client.name} onChange={(e) => setClient({ ...client, name: e.target.value })} className="input" />
//       </div>
//       <div className="flex items-center gap-2">
//        <label className="w-28">Dirección</label>
//        <input value={client.address} onChange={(e) => setClient({ ...client, address: e.target.value })} className="input" />
//       </div>
//      </div>
//     </div>

//     {/* Items */}
//     <div className="rounded-2xl border p-4">
//      <div className="flex items-center justify-between mb-2">
//       <h2 className="font-semibold">Ítems</h2>
//       <button className="btn" onClick={addItem}>Agregar ítem</button>
//      </div>

//      <div className="overflow-x-auto">
//       <table className="w-full text-left">
//        <thead>
//         <tr className="text-xs text-gray-500">
//          <th className="py-2">Descripción</th>
//          <th className="py-2 w-24">Cant.</th>
//          <th className="py-2 w-32">P. Unit</th>
//          <th className="py-2 w-28">Afectación</th>
//          <th className="py-2 w-40">Sujeta a detracción</th>
//          <th className="py-2 w-28 text-right">Importe</th>
//          <th className="py-2 w-14" />
//         </tr>
//        </thead>
//        <tbody>
//         {items.map((it) => {
//          const line = +(it.quantity * it.unitPrice).toFixed(2)
//          return (
//           <tr key={it.id} className="border-t">
//            <td className="py-2 pr-2">
//             <input className="input" value={it.description} onChange={(e) => updateItem(it.id, { description: e.target.value })} />
//            </td>
//            <td className="py-2 pr-2">
//             <input className="input" type="number" min={0} step={1} value={it.quantity} onChange={(e) => updateItem(it.id, { quantity: Number(e.target.value) })} />
//            </td>
//            <td className="py-2 pr-2">
//             <input className="input" type="number" min={0} step={0.01} value={it.unitPrice} onChange={(e) => updateItem(it.id, { unitPrice: Number(e.target.value) })} />
//            </td>
//            <td className="py-2 pr-2">
//             <select className="input" value={it.affectation} onChange={(e) => updateItem(it.id, { affectation: e.target.value as Affectation })}>
//              <option value="GRAVADA">Gravada (IGV 18%)</option>
//              <option value="EXONERADA">Exonerada</option>
//             </select>
//            </td>
//            <td className="py-2 pr-2">
//             <select className="input" value={String(it.detractionSubject)} onChange={(e) => updateItem(it.id, { detractionSubject: e.target.value === 'true' })}>
//              <option value="false">No</option>
//              <option value="true">Sí</option>
//             </select>
//            </td>
//            <td className="py-2 pr-2 text-right">{fmt(line)}</td>
//            <td className="py-2 text-right">
//             <button className="btn danger" onClick={() => removeItem(it.id)}>✕</button>
//            </td>
//           </tr>
//          )
//         })}
//        </tbody>
//       </table>
//      </div>
//     </div>

//     {/* Totales */}
//     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//      <div className="rounded-2xl border p-4 space-y-3">
//       <h3 className="font-semibold">Forma de pago</h3>
//       <div className="flex items-center gap-4">
//        <label className="flex items-center gap-2">
//         <input type="radio" name="payform" checked={payForm === 'CONTADO'} onChange={() => setPayForm('CONTADO')} />
//         <span>Contado</span>
//        </label>
//        <label className="flex items-center gap-2">
//         <input type="radio" name="payform" checked={payForm === 'CREDITO'} onChange={() => setPayForm('CREDITO')} />
//         <span>Crédito</span>
//        </label>
//       </div>

//       {payForm === 'CREDITO' && (
//        <div className="space-y-3">
//         <div className="text-sm text-gray-600">Monto neto pendiente (campo 64-A): <strong>{fmt(totals.netPending)}</strong></div>
//         <div className="flex items-center justify-between">
//          <h4 className="font-medium">Cronograma de cuotas (64-B)</h4>
//          <button className="btn" onClick={addInstallment}>Agregar cuota</button>
//         </div>
//         <div className="space-y-2">
//          {installments.map((c) => (
//           <div key={c.id} className="grid grid-cols-12 gap-2">
//            <input className="input col-span-5" type="date" value={c.dueDate} onChange={(e) => updateInstallment(c.id, { dueDate: e.target.value })} />
//            <input className="input col-span-5" type="number" min={0} step={0.01} value={c.amount} onChange={(e) => updateInstallment(c.id, { amount: Number(e.target.value) })} />
//            <button className="btn danger col-span-2" onClick={() => removeInstallment(c.id)}>Eliminar</button>
//           </div>
//          ))}
//         </div>
//         <div className={`text-sm ${cuotasOk ? 'text-green-700' : 'text-red-600'}`}>
//          Suma de cuotas: <strong>{fmt(installmentsSum)}</strong> {cuotasOk ? '(OK)' : '(Debe coincidir con el monto neto pendiente)'}
//         </div>
//        </div>
//       )}
//      </div>

//      <div className="rounded-2xl border p-4 space-y-2">
//       <div className="flex items-center justify-between"><span>Op. Gravadas</span><strong>{fmt(totals.gravada)}</strong></div>
//       <div className="flex items-center justify-between"><span>Op. Exoneradas</span><strong>{fmt(totals.exonerada)}</strong></div>
//       <div className="flex items-center justify-between"><span>IGV (18%)</span><strong>{fmt(totals.igv)}</strong></div>
//       <div className="flex items-center justify-between text-lg"><span>Total</span><strong>{fmt(totals.total)}</strong></div>
//      </div>
//     </div>

//     {/* Detracción */}
//     <div className="rounded-2xl border p-4 space-y-3">
//      <div className="flex items-center justify-between">
//       <h3 className="font-semibold">Detracción (SPOT)</h3>
//       <label className="flex items-center gap-2 text-sm">
//        <input type="checkbox" checked={detractionEnabled} onChange={(e) => setDetractionEnabled(e.target.checked)} />
//        Habilitar
//       </label>
//      </div>
//      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
//       <div className="flex items-center gap-2">
//        <label className="w-28">Tipo</label>
//        <select className="input" value={detractionType} onChange={(e) => setDetractionType(e.target.value)}>
//         <option value="SERVICIOS EMPRESARIALES">Servicios empresariales</option>
//         <option value="INTERMEDIACIÓN LABORAL">Intermediación laboral</option>
//         <option value="OTROS">Otros</option>
//        </select>
//       </div>
//       <div className="flex items-center gap-2">
//        <label className="w-28">Tasa (%)</label>
//        <input className="input" type="number" min={0} step={0.01} value={detractionRate} onChange={(e) => setDetractionRate(Number(e.target.value))} />
//       </div>
//       <div className="flex items-center gap-2">
//        <label className="w-28">Cta. BN</label>
//        <input className="input" value={bankAccount} onChange={(e) => setBankAccount(e.target.value)} />
//       </div>
//      </div>
//      <div className="rounded-xl bg-gray-50 p-3 text-sm">
//       <div>Aplica detracción: <strong>{totals.detractionApplies ? 'Sí' : 'No'}</strong> {currency !== 'PEN' && '(solo aplica en PEN)'} </div>
//       <div>Monto detracción: <strong>{fmt(totals.detractionAmount)}</strong></div>
//       <div>Monto neto a pagar (Total - detracción): <strong>{fmt(totals.netPending)}</strong></div>
//      </div>
//      <p className="text-xs text-gray-500">Regla general: si el total supera S/ 700 y el bien/servicio está afecto al SPOT. Algunas partidas tienen umbrales distintos (p. ej., media UIT). Ajusta la tasa según el rubro.</p>
//     </div>

//     {/* Acciones */}
//     <div className="flex items-center gap-3">
//      <button className="btn primary" onClick={() => alert('Aquí convertirías a XML UBL y enviarías a SUNAT via tu backend.')}>Guardar / Emitir</button>
//      <button className="btn" onClick={() => window.print()}>Imprimir</button>
//     </div>

//     {/* Estilos utilitarios (Tailwind)
//         Usamos clases abreviadas aquí para inputs y botones.
//     */}
//     <style jsx global>{`
//       .input { @apply w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-400; }
//       .btn { @apply rounded-lg border px-3 py-2 text-sm hover:bg-gray-50; }
//       .btn.primary { @apply bg-blue-600 text-white border-blue-600 hover:bg-blue-700; }
//       .btn.danger { @apply text-red-600 border-red-600 hover:bg-red-50; }
//     `}</style>
//    </div>
//   )
//  }
