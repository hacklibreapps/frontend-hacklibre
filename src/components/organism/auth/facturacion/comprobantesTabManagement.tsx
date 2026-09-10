'use client'

import { useEffect, useState } from 'react'
import PageContainer from '@/components/atom/structures/containers/pageContainer'
import PageTitle from '@/components/atom/auth/structures/pageTitlte'
import PageContent from '@/components/atom/structures/containers/pageContent'
import { TbFileInvoice, TbFileText } from 'react-icons/tb'

// === Formularios de cada tipo de comprobante ===
import { FacturaMod } from '@/components/organism/auth/facturas/facturaMod'
import { FacturaCompraMod } from './facturaCompraMod'
import { ReciboHonorariosMod } from './reciboHonorariosMod'
import { deleteCookie, setCookie } from '@/services/cookies/cookies'

// === Estilos de color por pestaña ===
const tabStyles: Record<
  string,
  { bg: string; border: string; lightBg: string }
> = {
  sales: {
    bg: 'bg-[#0d4a5a]',
    border: 'border-[#0d4a5a]',
    lightBg: '#e9f3f6'
  },
  buys: {
    bg: 'bg-[#2db784]',
    border: 'border-[#2db784]',
    lightBg: '#e9f9f1'
  },
  boleta_compra: {
    bg: 'bg-[#e16d2c]',
    border: 'border-[#e16d2c]',
    lightBg: '#fff3e9'
  },
  buys_fee_recipt: {
    bg: 'bg-[#c93b50]',
    border: 'border-[#c93b50]',
    lightBg: '#fbeaec'
  }
}

// === Tabs Config ===
const tabs = [
  {
    key: 'sales',
    label: 'Factura de Venta',
    icon: <TbFileInvoice className='text-white text-lg' />
  },
  {
    key: 'buys',
    label: 'Factura de Compra',
    icon: <TbFileInvoice className='text-white text-lg' />
  },
  // {
  //   key: 'boleta_compra',
  //   label: 'Boleta de Compra',
  //   icon: <TbReceipt2 className='text-white text-lg' />
  // },
  {
    key: 'buys_fee_recipt',
    label: 'Recibo por Honorarios',
    icon: <TbFileText className='text-white text-lg' />
  }
]

const ComprobantesTabsManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('sales')
  useEffect(() => {
    deleteCookie('currentInvoiceType')
    if (activeTab) {
      setCookie('currentInvoiceType', activeTab)
    }
  }, [activeTab])
  return (
    <PageContainer>
      <PageTitle description='Selecciona el tipo de comprobante para registrar o visualizar' />

      <PageContent>
        {/* ==== Pestañas ==== */}
        <div className='flex flex-wrap justify-start gap-1 mb-0'>
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center justify-center gap-1 
        px-2 py-1 sm:px-3 sm:py-2
        rounded-t-lg font-semibold text-white 
        text-xs sm:text-sm transition-all duration-200 
        ${
          activeTab === tab.key
            ? `${tabStyles[tab.key].bg}`
            : 'bg-Cian4 text-gray-700 hover:bg-Cian2'
        }
        basis-[48%] sm:basis-[48%] md:basis-auto
      `}
            >
              <span className='text-lg sm:text-base'>{tab.icon}</span>
              <span className='truncate'>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* ==== Contenedor del Formulario ==== */}
        <div
          className={`rounded-b-lg border p-0 transition-colors duration-300 ${tabStyles[activeTab].border}`}
          style={{
            backgroundColor: tabStyles[activeTab].lightBg
          }}
        >
          {/* FACTURA DE VENTA */}
          {activeTab === 'sales' && (
            <div className='animate-fadeIn'>
              <FacturaMod />
            </div>
          )}

          {/* FACTURA DE COMPRA */}
          {activeTab === 'buys' && (
            <div className='animate-fadeIn'>
              <FacturaCompraMod />
            </div>
          )}

          {/* BOLETA DE COMPRA */}
          {/* {activeTab === 'boleta_compra' && (
            <div className='animate-fadeIn'>
              <BoletaCompraMod />
            </div>
          )} */}

          {/* RECIBO POR HONORARIOS */}
          {activeTab === 'buys_fee_recipt' && (
            <div className='animate-fadeIn'>
              <ReciboHonorariosMod />
            </div>
          )}
        </div>
      </PageContent>
    </PageContainer>
  )
}

export default ComprobantesTabsManagement
