'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
  LineChart,
  Line,
  Legend
} from 'recharts'

/* === Datos demo === */

// Cotizaciones
const cotizacionesData = [
  { mes: 'Ene', enviadas: 35, porVencer: 10, vencidas: 5 },
  { mes: 'Feb', enviadas: 40, porVencer: 12, vencidas: 8 },
  { mes: 'Mar', enviadas: 55, porVencer: 8, vencidas: 4 },
  { mes: 'Abr', enviadas: 50, porVencer: 15, vencidas: 9 }
]

// Declaraciones
const declaracionesData = [
  { tipo: 'Clientes A', valor: 22 },
  { tipo: 'Clientes B', valor: 15 },
  { tipo: 'Clientes C', valor: 8 }
]

// Fraccionamientos
const fraccionamientosData = [
  { cuota: '1ra', pagadas: 120, pendientes: 30 },
  { cuota: '2da', pagadas: 100, pendientes: 50 },
  { cuota: '3ra', pagadas: 80, pendientes: 70 }
]

// Flujo bancario
const flujoBancarioData = [
  { banco: 'Interbank', entradas: 22000, salidas: 18000 },
  { banco: 'BCP', entradas: 18500, salidas: 14500 },
  { banco: 'Banco Nación', entradas: 9000, salidas: 7500 }
]

const resumenAnual = [
  {
    año: 2023,
    ventasSoles: 'S/ 425,000',
    ventasDolares: '$ 112,000',
    comprasSoles: 'S/ 295,000',
    comprasDolares: '$ 80,000',
    cotizaciones: 450,
    declaradas: 430,
    trabajadores: 32
  },
  {
    año: 2024,
    ventasSoles: 'S/ 310,000',
    ventasDolares: '$ 95,000',
    comprasSoles: 'S/ 210,000',
    comprasDolares: '$ 62,000',
    cotizaciones: 380,
    declaradas: 355,
    trabajadores: 35
  },
  {
    año: 2025,
    ventasSoles: 'S/ 276,000',
    ventasDolares: '$ 85,000',
    comprasSoles: 'S/ 198,000',
    comprasDolares: '$ 57,000',
    cotizaciones: 340,
    declaradas: 330,
    trabajadores: 37
  }
]

/* === Componentes base === */

function KpiCardGroup({
  title,
  values
}: {
  title: string
  values: { label: string; value: string; color?: string }[]
}) {
  return (
    <div className='rounded-xl border border-gray-200 bg-white p-4 shadow-sm'>
      <h3 className='text-sm font-semibold text-gray-700 mb-2'>{title}</h3>
      <div className='space-y-1'>
        {values.map((item, i) => (
          <div
            key={i}
            className='flex items-center justify-between text-sm text-gray-800'
          >
            <span>{item.label}</span>
            <span
              className={`font-semibold ${
                item.color ? item.color : 'text-gray-900'
              }`}
            >
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function ChartCard({
  title,
  children,
  filterOptions
}: {
  title: string
  children: React.ReactNode
  filterOptions?: string[]
}) {
  const [selectedFilter, setSelectedFilter] = useState(filterOptions?.[0] || '')

  return (
    <div className='rounded-xl border border-gray-200 bg-white p-4 shadow-sm'>
      <div className='mb-2 flex justify-between items-center'>
        <h2 className='text-sm font-semibold text-gray-900'>{title}</h2>
        {filterOptions && (
          <select
            className='rounded-md border border-gray-300 text-sm px-2 py-1'
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
          >
            {filterOptions.map((opt) => (
              <option key={opt}>{opt}</option>
            ))}
          </select>
        )}
      </div>
      <div className='h-60 w-full'>{children}</div>
    </div>
  )
}

/* === Tabla resumen anual (formato responsive 12 columnas) === */
function TablaResumenAnual() {
  return (
    <div className='rounded-xl border border-gray-200 bg-white p-4 shadow-sm'>
      <h2 className='text-sm font-semibold text-gray-900 mb-2'>
        📊 Resumen Anual General
      </h2>

      <div className='overflow-x-auto'>
        <table className='min-w-full border-collapse text-[11px] sm:text-sm md:text-base'>
          <thead className='bg-gray-50'>
            <tr>
              <th className='w-1/12 px-2 py-2 text-center font-semibold text-gray-700'>
                Nro
              </th>
              <th className='w-6/12 sm:w-4/12 lg:w-2/12 px-2 py-2 text-center font-semibold text-gray-700'>
                Año
              </th>
              <th className='hidden lg:table-cell lg:w-2/12 px-2 py-2 text-center font-semibold text-gray-700'>
                Ventas (S/)
              </th>
              <th className='w-6/12 sm:w-4/12 lg:w-2/12 px-2 py-2 text-center font-semibold text-gray-700'>
                Ventas ($)
              </th>
              <th className='hidden lg:table-cell lg:w-2/12 px-2 py-2 text-center font-semibold text-gray-700'>
                Compras (S/)
              </th>
              <th className='hidden lg:table-cell lg:w-2/12 px-2 py-2 text-center font-semibold text-gray-700'>
                Compras ($)
              </th>
              <th className='hidden sm:table-cell sm:w-2/12 lg:w-1/12 px-2 py-2 text-center font-semibold text-gray-700'>
                Cotizaciones
              </th>
              <th className='hidden sm:table-cell sm:w-2/12 lg:w-1/12 px-2 py-2 text-center font-semibold text-gray-700'>
                Declaradas
              </th>
              {/* <th className='w-1/12 px-2 py-2 text-center font-semibold text-gray-700'>
                Trab.
              </th> */}
            </tr>
          </thead>
          <tbody>
            {resumenAnual.map((row, i) => (
              <tr
                key={i}
                className={`border-t ${
                  i % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                } hover:bg-gray-100 transition-colors`}
              >
                <td className='text-center px-2 py-2 font-semibold text-gray-800'>
                  {i + 1}
                </td>
                <td className='text-center px-2 py-2'>{row.año}</td>
                <td className='hidden lg:table-cell text-center px-2 py-2'>
                  {row.ventasSoles}
                </td>
                <td className='text-center px-2 py-2'>{row.ventasDolares}</td>
                <td className='hidden lg:table-cell text-center px-2 py-2'>
                  {row.comprasSoles}
                </td>
                <td className='hidden lg:table-cell text-center px-2 py-2'>
                  {row.comprasDolares}
                </td>
                <td className='hidden sm:table-cell text-center px-2 py-2'>
                  {row.cotizaciones}
                </td>
                <td className='hidden sm:table-cell text-center px-2 py-2'>
                  {row.declaradas}
                </td>
                {/* <td className='text-center px-2 py-2'>{row.trabajadores}</td> */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

/* === Página principal === */
export default function DashboardPage() {
  const router = useRouter()

  useEffect(() => {
    const token =
      typeof window !== 'undefined' ? localStorage.getItem('token') : null
    if (!token) router.replace('/auth/login')
  }, [router])

  return (
    <div className='min-h-screen w-full bg-gray-100'>
      <div className='mx-auto max-w-7xl space-y-6 px-4 py-6'>
        {/* Header */}
        <div>
          <h1 className='text-2xl font-bold text-gray-900'>
            Dashboard General
          </h1>
          <p className='text-sm text-gray-600'>
            Cotizaciones, ventas, compras, bancos y trabajadores.
          </p>
        </div>

        {/* KPIs */}
        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          <KpiCardGroup
            title='🏦 Banco'
            values={[
              {
                label: 'Saldo en soles',
                value: 'S/ 45,200',
                color: 'text-green-600'
              },
              {
                label: 'Saldo en dólares',
                value: '$ 8,750',
                color: 'text-blue-600'
              },
              {
                label: 'Detracciones',
                value: 'S/ 2,300',
                color: 'text-yellow-600'
              }
            ]}
          />
          <KpiCardGroup
            title='💸 Ventas del mes'
            values={[
              {
                label: 'Ventas en soles',
                value: 'S/ 27,800',
                color: 'text-green-600'
              },
              {
                label: 'Ventas en dólares',
                value: '$ 4,900',
                color: 'text-blue-600'
              }
            ]}
          />
          <KpiCardGroup
            title='🧾 Compras del mes'
            values={[
              {
                label: 'Compras en soles',
                value: 'S/ 18,600',
                color: 'text-rose-600'
              },
              {
                label: 'Compras en dólares',
                value: '$ 3,100',
                color: 'text-indigo-600'
              }
            ]}
          />
        </div>

        {/* FILA 1 - Cotizaciones, Declaciones, Fraccionamientos */}
        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
          <ChartCard
            title='Cotizaciones por estado'
            filterOptions={['Mensual', 'Semestral', 'Anual']}
          >
            <ResponsiveContainer>
              <BarChart data={cotizacionesData}>
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis dataKey='mes' />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey='enviadas' fill='#16a34a' name='Enviadas 🟢' />
                <Bar dataKey='porVencer' fill='#facc15' name='Por vencer 🟡' />
                <Bar dataKey='vencidas' fill='#dc2626' name='Vencidas 🔴' />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard
            title='Declaciones'
            filterOptions={['Último mes', 'Trimestre']}
          >
            <ResponsiveContainer>
              <BarChart
                data={declaracionesData}
                layout='vertical'
                margin={{ left: 40, right: 10 }}
              >
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis type='number' />
                <YAxis dataKey='tipo' type='category' />
                <Tooltip />
                <Bar dataKey='valor' fill='#2563eb' radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard
            title='Fraccionamientos por cuota'
            filterOptions={['Mes actual', 'Trimestre', 'Año']}
          >
            <ResponsiveContainer>
              <LineChart data={fraccionamientosData}>
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis dataKey='cuota' />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type='monotone'
                  dataKey='pagadas'
                  stroke='#16a34a'
                  name='Pagadas'
                />
                <Line
                  type='monotone'
                  dataKey='pendientes'
                  stroke='#f97316'
                  name='Pendientes'
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* FILA 2 - Facturas, Bancos, Detracciones */}
        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
          <ChartCard
            title='Flujo Bancario (Entradas vs Salidas)'
            filterOptions={['Mensual', 'Semestral']}
          >
            <ResponsiveContainer>
              <BarChart
                data={flujoBancarioData}
                layout='vertical'
                margin={{ left: 40, right: 10 }}
              >
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis type='number' />
                <YAxis dataKey='banco' type='category' />
                <Tooltip />
                <Legend />
                <Bar dataKey='entradas' fill='#16a34a' name='Entradas' />
                <Bar dataKey='salidas' fill='#dc2626' name='Salidas' />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* TABLA - Resumen anual */}
        <TablaResumenAnual />
      </div>
    </div>
  )
}
