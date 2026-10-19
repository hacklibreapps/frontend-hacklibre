'use client'
import NewPath from '@/components/atom/auth/basic/newPath'
import { Loading } from '@/components/atom/auth/loading'
import PageTitle from '@/components/atom/auth/structures/pageTitlte'
import PageContainer from '@/components/atom/structures/containers/pageContainer'
import PageContent from '@/components/atom/structures/containers/pageContent'
import { ToastNotification } from '@/components/atom/structures/toast'
import { useAuth } from '@/context/authContext'
import { InvoiceRetrieveInterface } from '@/interfaces/invoice/retrieveInvoice'
import { ApiFecthAuth } from '@/services/auth/axios/apiFetchAuth'
import endPoints from '@/services/auth/endPoints/endPoint'
import { prefix } from '@/services/envs/envs'
import { amountToLetters } from '@/utils/AmountToLetter'
import { CouldNotLoad } from '@/utils/couldntLoad'
import ExceptionTable from '@/utils/exceptionTable'
import { formatMoney } from '@/utils/formatMoney'
import { formatPercent } from '@/utils/formatPercent'
import { Img } from '@/utils/img'
import { useEffect, useState } from 'react'
import { LuPackagePlus } from 'react-icons/lu'

const ViewReceipt = ({ uuid }: { uuid: string }) => {
  const {
    enterpriseLogo,
    enterpriseName,
    comercialName,
    ruc,
    address,
    telefono,
    email,
    departamento,
    provincia,
    distrito,
    ready,
    token,
    enterprise,
    detractionAccount
  } = useAuth()
  const { hasPermission } = useAuth()
  const [invoice, setInvoice] = useState<InvoiceRetrieveInterface | null>(null)

  useEffect(() => {
    if (!ready || !token || !enterprise) return

    const fetchData = async () => {
      try {
        const data = await getData(uuid, token)

        if (data?.props?.invoice) setInvoice(data.props.invoice)
      } catch (error) {
        ToastNotification('danger', `Ha ocurrido un error - ${error}`)
      }
    }

    fetchData()
  }, [uuid, token, ready, enterprise])

  const newData = hasPermission('productos.add_producto') ? (
    <NewPath
      tooltip='Nuevo producto'
      icon={<LuPackagePlus className='text-Cian8' />}
      link={`${prefix}/generales/productos/nuevo/`}
    />
  ) : null

  return invoice ? (
    <PageContainer>
      <PageTitle
        description='Alta, edición y gestión de productos'
        aditionalIcon={newData ? newData : undefined}
      />
      <PageContent>
        <div className='mx-auto min-h-[297mm] w-full max-w-[210mm] bg-white p-8 text-slate-800 shadow-lg print:min-h-0 print:max-w-none print:p-0 print:shadow-none'>
          {/* ===================== HEADER ===================== */}
          <div className='overflow-hidden rounded-xl border border-slate-200'>
            <div className='bg-Greys px-7 py-6 text-white'>
              <div className='flex items-center justify-between gap-6'>
                {/* LOGO / EMPRESA */}
                <div className='flex items-cente'>
                  <div className='flex items-center justify-center rounded-lg  text-Charcoal'>
                    {enterpriseLogo ? (
                      <Img
                        className='w-40 h-auto border'
                        src={enterpriseLogo}
                        alt={enterpriseName ? enterpriseName : ''}
                      />
                    ) : enterpriseName ? (
                      enterpriseName
                    ) : (
                      ''
                    )}
                  </div>
                </div>

                <div className='hidden text-right text-[10px] uppercase tracking-[0.25em] text-Charcoal sm:block'>
                  <div>Sistema</div>
                  <div>Facturación</div>
                  <div>Electrónica</div>
                </div>
              </div>
            </div>

            {/* ===================== EMPRESA + COMPROBANTE ===================== */}
            <div className='grid grid-cols-12 gap-6 p-6'>
              {/* DATOS EMISOR */}
              <div className='col-span-12 md:col-span-7'>
                <div className='text-xl font-black uppercase text-cyan-950'>
                  {enterpriseName}
                </div>

                <div className='mt-2 space-y-1 text-sm'>
                  <div>
                    <span className='font-bold'>RUC:</span> {ruc}
                  </div>

                  <div>
                    <span className='font-bold'>Domicilio Fiscal:</span>
                  </div>

                  <div>{address}</div>

                  <div>
                    {' '}
                    {[distrito, provincia, departamento]
                      .filter(Boolean)
                      .join(' - ')}
                  </div>

                  <div className='pt-1'>
                    <span className='font-bold'>Nombre Comercial:</span>{' '}
                    {comercialName}
                  </div>
                </div>
              </div>

              {/* CAJA FACTURA */}
              <div className='col-span-12 md:col-span-5'>
                <div className='rounded-lg border-2 border-cyan-900 p-5 text-center'>
                  <div className='text-xl font-black uppercase text-cyan-950'>
                    FACTURA ELECTRÓNICA
                  </div>

                  <div className='mt-2 text-sm font-bold'>RUC: {ruc}</div>

                  <div className='mt-4 rounded-md bg-gradient-to-r from-Cian7 to-Cian8 px-4 py-3 text-2xl font-black tracking-wide text-Cian2'>
                    {invoice.invoiceNumber}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ===================== DATOS CLIENTE ===================== */}
          <div className='mt-5 overflow-hidden rounded-lg border border-slate-300'>
            <div className='grid grid-cols-12'>
              <div className='col-span-12 border-b border-slate-300 md:col-span-7 md:border-b-0 md:border-r'>
                <div className='bg-slate-100 px-5 py-2 text-sm font-bold uppercase text-cyan-950'>
                  Datos del cliente
                </div>

                <div className='space-y-2 px-5 py-4 text-sm'>
                  {invoice.client ? (
                    <>
                      <div className='grid grid-cols-[120px_10px_1fr]'>
                        <span className='font-semibold'>Razón Social</span>
                        <span>:</span>
                        <span>{invoice.client.completeCompanyName}</span>
                      </div>
                      <div className='grid grid-cols-[120px_10px_1fr]'>
                        <span className='font-semibold'>RUC</span>
                        <span>:</span>
                        <span>{invoice.client.ruc}</span>
                      </div>
                      <div className='grid grid-cols-[120px_10px_1fr]'>
                        <span className='font-semibold'>Dirección</span>
                        <span>:</span>
                        <span>{invoice.client.address}</span>
                      </div>
                    </>
                  ) : (
                    <CouldNotLoad value='cliente' />
                  )}
                </div>
              </div>

              <div className='col-span-12 md:col-span-5'>
                <div className='space-y-2 px-5 py-4 text-sm'>
                  <div className='grid grid-cols-[145px_10px_1fr]'>
                    <span className='font-semibold'>Fecha de Emisión</span>
                    <span>:</span>
                    <span>{invoice.emitionDate}</span>
                  </div>

                  <div className='grid grid-cols-[145px_10px_1fr]'>
                    <span className='font-semibold'>Fecha Vencimiento</span>
                    <span>:</span>
                    <span>
                      {' '}
                      {invoice.paymentType === 'CONT'
                        ? invoice.emitionDate
                        : invoice.installments.length > 0
                          ? invoice.installments[
                              invoice.installments.length - 1
                            ].dueDate
                          : '-'}
                    </span>
                  </div>

                  <div className='grid grid-cols-[145px_10px_1fr]'>
                    <span className='font-semibold'>Moneda</span>
                    <span>:</span>
                    <span>
                      {invoice.moneyData?.currency} -{' '}
                      {invoice.moneyData?.pluralName}
                    </span>
                  </div>

                  <div className='grid grid-cols-[145px_10px_1fr]'>
                    <span className='font-semibold'>Forma de Pago</span>
                    <span>:</span>
                    <span>{invoice.paymentTypeDisplay}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ===================== ITEMS ===================== */}
          <div className='mt-5 overflow-hidden rounded-lg border border-slate-300'>
            <table className='w-full border-collapse text-xs'>
              <thead className='bg-cyan-950 text-white'>
                <tr>
                  <th className='border-r border-cyan-800 px-2 py-3 text-center'>
                    N°
                  </th>

                  <th className='border-r border-cyan-800 px-3 py-3 text-center'>
                    CÓDIGO
                  </th>

                  <th className='border-r border-cyan-800 px-3 py-3 text-left'>
                    DESCRIPCIÓN
                  </th>

                  <th className='border-r border-cyan-800 px-3 py-3 text-center'>
                    CANT.
                  </th>

                  <th className='border-r border-cyan-800 px-3 py-3 text-center'>
                    U.M.
                  </th>

                  <th className='border-r border-cyan-800 px-3 py-3 text-right'>
                    VALOR UNIT.
                  </th>

                  <th className='border-r border-cyan-800 px-3 py-3 text-right'>
                    IGV
                  </th>

                  <th className='px-3 py-3 text-right'>TOTAL</th>
                </tr>
              </thead>

              <tbody>
                {invoice.items && invoice.items.length > 0 ? (
                  invoice.items.map((item, index) => (
                    <tr key={index} className='border-b border-slate-200'>
                      <td className='px-2 py-4 text-center'>{index + 1}</td>
                      <td className='px-3 py-4 text-center'>
                        {item.code ? item.code : '---'}
                      </td>
                      <td className='px-3 py-4'>
                        {item.description ? item.description : '---'}
                      </td>
                      <td className='px-3 py-4 text-center'>{item.quantity}</td>
                      <td className='px-3 py-4 text-center'>
                        {item.measurementUnit?.abbr}
                      </td>
                      <td className='px-3 py-4 text-right'>{item.unitValue}</td>
                      <td className='px-3 py-4 text-right'>{item.igvValue}</td>
                      <td className='px-3 py-4 text-right font-medium'>
                        {item.totalPrice}
                      </td>
                    </tr>
                  ))
                ) : (
                  <ExceptionTable
                    colspan={8}
                    message='No se registraron items en la factura'
                  />
                )}
              </tbody>
            </table>
          </div>

          {/* ===================== INFORMACIÓN + TOTALES ===================== */}
          <div className='mt-5 grid grid-cols-12 gap-5'>
            {/* INFO ADICIONAL */}
            <div className='col-span-12 overflow-hidden rounded-lg border border-slate-300 md:col-span-7'>
              <div className='bg-slate-100 px-5 py-2 text-sm font-bold uppercase text-cyan-950'>
                Información adicional
              </div>

              <div className='space-y-2 px-5 py-4 text-sm'>
                <div className='grid grid-cols-[120px_10px_1fr]'>
                  <span className='font-semibold'>Observaciones</span>
                  <span>:</span>
                  <span>
                    {invoice.observations ? invoice.observations : '---'}
                  </span>
                </div>

                {/* <div className='grid grid-cols-[120px_10px_1fr]'>
              <span className='font-semibold'>Orden de Compra</span>
              <span>:</span>
              <span>OC-001-2026</span>
            </div> */}
              </div>
            </div>

            {/* TOTALES */}
            <div className='col-span-12 overflow-hidden rounded-lg border border-slate-300 md:col-span-5'>
              <div className='grid grid-cols-2 border-b border-slate-200'>
                <div className='bg-slate-50 px-4 py-2 font-medium'>
                  Subtotal
                </div>

                <div className='px-4 py-2 text-right'>
                  {formatMoney(
                    Number(invoice.subTotal),
                    invoice.moneyData?.sign
                  )}
                </div>
              </div>

              <div className='grid grid-cols-2 border-b border-slate-200'>
                <div className='bg-slate-50 px-4 py-2 font-medium'>
                  IGV (18%)
                </div>

                <div className='px-4 py-2 text-right'>
                  {formatMoney(Number(invoice.igv), invoice.moneyData?.sign)}
                </div>
              </div>

              <div className='grid grid-cols-2 border-b border-slate-200'>
                <div className='bg-slate-50 px-4 py-2 font-medium'>ICBPER</div>

                <div className='px-4 py-2 text-right'>
                  {formatMoney(Number(invoice.icbper), invoice.moneyData?.sign)}
                </div>
              </div>

              <div className='grid grid-cols-2 border-b border-slate-200'>
                <div className='bg-slate-50 px-4 py-2 font-medium'>
                  Otros cargos
                </div>

                <div className='px-4 py-2 text-right'>
                  {formatMoney(
                    Number(invoice.otrosCargos),
                    invoice.moneyData?.sign
                  )}
                </div>
              </div>
              <div className='grid grid-cols-2 border-b border-slate-200'>
                <div className='bg-slate-50 px-4 py-2 font-medium'>
                  Otros tributos
                </div>

                <div className='px-4 py-2 text-right'>
                  {formatMoney(
                    Number(invoice.otrosTributos),
                    invoice.moneyData?.sign
                  )}
                </div>
              </div>

              <div className='grid grid-cols-2 bg-gradient-to-r from-Cian4 to-Cian7 text-sm font-black text-white'>
                <div className='px-4 py-3'>IMPORTE TOTAL</div>

                <div className='px-4 py-3 text-right text-base'>
                  {formatMoney(
                    Number(invoice.importeTotal),
                    invoice.moneyData?.sign
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ===================== MONTO EN LETRAS ===================== */}
          <div className='mt-5 flex flex-col justify-between gap-2 rounded-lg border border-emerald-200 bg-gradient-to-r from-emerald-50 to-cyan-50 px-5 py-3 text-sm font-bold text-cyan-950 md:flex-row'>
            <div className='uppercase'>
              SON:{' '}
              {amountToLetters(
                invoice.importeTotal,
                invoice.moneyData ? invoice.moneyData.pluralName : ''
              )}
            </div>

            <div className='uppercase'>
              MONEDA: {invoice.moneyData?.pluralName}
            </div>
          </div>

          {/* ===================== DETRACCIÓN ===================== */}
          {invoice.hasDetraccion ? (
            <div className='mt-5'>
              <div className='mb-2 text-sm font-bold uppercase text-cyan-950'>
                Detalle de detracción
              </div>

              <div className='flex flex-row items-center justify-center'>
                <div className='flex w-full flex-col items-center justify-center overflow-hidden rounded-lg border border-Cian2'>
                  <div className='flex w-full flex-row items-stretch justify-center bg-slate-100 text-center text-xs font-semibold'>
                    <div className='flex w-4/12 items-center justify-center border-r border-slate-300 px-2 py-2'>
                      Leyenda
                    </div>

                    <div className='flex w-4/12 items-center justify-center border-r border-slate-300 px-2 py-2'>
                      Bien o Servicio
                    </div>

                    <div className='flex w-4/12 items-center justify-center px-2 py-2'>
                      Medio de Pago
                    </div>
                  </div>

                  <div className='flex w-full flex-row items-stretch justify-center text-center text-sm'>
                    <div className='flex w-4/12 items-center justify-center border-r border-slate-300 px-2 py-3'>
                      {invoice.legendDisplay}
                    </div>

                    <div className='flex w-4/12 items-center justify-center border-r border-slate-300 px-2 py-3'>
                      {invoice.bienServicioDisplay}
                    </div>

                    <div className='flex w-4/12 items-center justify-center px-2 py-3'>
                      {invoice.medioPagoDetraccionDisplay}
                    </div>
                  </div>
                  <div className='flex w-full flex-row items-stretch justify-center bg-slate-100 text-center text-xs font-semibold'>
                    <div className='flex w-4/12 items-center justify-center border-r border-slate-300 px-2 py-2'>
                      Nro. Cta. Banco de la Nación
                    </div>

                    <div className='flex w-4/12 items-center justify-center border-r border-slate-300 px-2 py-2'>
                      Porcentaje de detracción
                    </div>

                    <div className='flex w-4/12 items-center justify-center px-2 py-2'>
                      Medio de Pago
                    </div>
                  </div>

                  <div className='flex w-full flex-row items-stretch justify-center text-center text-sm'>
                    <div className='flex w-4/12 items-center justify-center border-r border-slate-300 px-2 py-3'>
                      {detractionAccount}
                    </div>

                    <div className='flex w-4/12 items-center justify-center border-r border-slate-300 px-2 py-3'>
                      {formatPercent(Number(invoice.detraccionPercent))}
                    </div>

                    <div className='flex w-4/12 items-center justify-center px-2 py-3'>
                      {formatMoney(
                        Number(invoice.detraccionAmount),
                        invoice.moneyData?.sign
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className='flex w-full mt-3 flex-row items-stretch justify-center text-center  rounded-lg bg-slate-50 px-5 py-3 text-xs text-slate-600 md:col-span-5'>
                La detracción deberá ser depositada de acuerdo con la normativa
                correspondiente.
              </div>

              {/* <div className='grid grid-cols-12 gap-4'>
          <div className='col-span-12 overflow-hidden rounded-lg border border-slate-300 md:col-span-7'>
            <div className='grid grid-cols-3 bg-slate-100 text-center text-xs font-semibold'>
              <div className='border-r border-slate-300 px-2 py-2'>Base</div>

              <div className='border-r border-slate-300 px-2 py-2'>
                Porcentaje
              </div>

              <div className='px-2 py-2'>Monto</div>
            </div>

            <div className='grid grid-cols-3 text-center text-sm'>
              <div className='border-r border-slate-300 px-2 py-3'>
                S/ 720.34
              </div>

              <div className='border-r border-slate-300 px-2 py-3'>10%</div>

              <div className='px-2 py-3'>S/ 72.00</div>
            </div>
          </div>

           <div className='col-span-12 flex items-center rounded-lg bg-slate-50 px-5 py-3 text-xs text-slate-600 md:col-span-5'>
            La detracción deberá ser depositada de acuerdo con la normativa
            correspondiente.
          </div>
        </div> */}
            </div>
          ) : null}

          {/* ===================== QR + REPRESENTACIÓN IMPRESA ===================== */}
          <div className='mt-6 grid grid-cols-12 gap-6 border-t border-slate-300 pt-5'>
            {/* QR */}
            <div className='col-span-12 flex justify-center md:col-span-3 md:justify-start'>
              <div className='flex h-36 w-36 items-center justify-center border-2 border-dashed border-slate-300 bg-slate-50 text-center text-xs font-semibold text-slate-400'>
                {invoice.qrCodeUrl ? invoice.qrCodeUrl : <CouldNotLoad />}
              </div>
            </div>

            {/* TEXTO SUNAT */}
            <div className='col-span-12 md:col-span-9'>
              <div className='text-sm font-bold text-cyan-950'>
                Representación impresa de la Factura Electrónica
              </div>

              <p className='mt-1 text-xs leading-relaxed text-slate-600'>
                Esta es una representación impresa del comprobante electrónico.
                La validez del documento puede ser consultada mediante los
                mecanismos correspondientes de SUNAT.
              </p>

              <div className='mt-4 rounded-md bg-slate-50 px-4 py-3 text-xs'>
                <div>
                  <span className='font-semibold'>
                    Código de verificación / Hash:
                  </span>
                </div>

                <div className='mt-1 break-all text-slate-600'>
                  {invoice.hashCode ? invoice.hashCode : <CouldNotLoad />}
                </div>

                <div className='mt-2'>
                  <span className='font-semibold'>
                    Fecha y hora de generación:
                  </span>{' '}
                  <CouldNotLoad />
                  {/* falta enviar esto desde backend */}
                </div>
              </div>
            </div>
          </div>

          {/* ===================== FOOTER ===================== */}
          <div className='mt-7 border-t-2 border-cyan-900 pt-4'>
            <div className='grid grid-cols-1 gap-4 text-xs text-slate-600 md:grid-cols-4'>
              <div>
                <div className='font-bold text-cyan-950'>Dirección</div>
                <div className='mt-1'>{address}</div>
                <div>
                  {[distrito, provincia, departamento]
                    .filter(Boolean)
                    .join(' - ')}
                </div>
              </div>

              <div>
                <div className='font-bold text-cyan-950'>Teléfono</div>
                <div className='mt-1'>
                  {telefono ? telefono : <CouldNotLoad />}
                </div>
              </div>

              <div>
                <div className='font-bold text-cyan-950'>Correo</div>
                <div className='mt-1'>{email ? email : <CouldNotLoad />}</div>
              </div>

              <div className='text-center'>
                {enterpriseLogo ? (
                  <Img
                    className='w-32'
                    src={enterpriseLogo}
                    alt={enterpriseName ? enterpriseName : ''}
                  />
                ) : enterpriseName ? (
                  <p>
                    <span className='font-bold'>{enterpriseName}</span> <br />{' '}
                    {comercialName}
                  </p>
                ) : (
                  ''
                )}
              </div>
            </div>
          </div>
        </div>
      </PageContent>
    </PageContainer>
  ) : (
    <Loading value='Importando factura...' />
  )
}

export { ViewReceipt }

async function getData(
  uuid: string,
  token: string | null
): Promise<{
  props: {
    invoice: InvoiceRetrieveInterface | null
  }
}> {
  if (!token) {
    return { props: { invoice: null } }
  }

  const invoicedata = await ApiFecthAuth(
    endPoints.invoices.retrieve(uuid),
    token
  )

  return {
    props: {
      invoice: invoicedata.data
    }
  }
}
