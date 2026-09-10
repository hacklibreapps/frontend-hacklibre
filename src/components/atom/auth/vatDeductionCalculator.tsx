import { useEffect, useRef, useState } from 'react'
import { IoIosCheckbox, IoIosWarning } from 'react-icons/io'
import Select from '../structures/select'
import { KeyValueInterface } from '@/interfaces/structures/keyValueInterface'
import Input from '../structures/input'
import { ApiFecthAuth } from '@/services/auth/axios/apiFetchAuth'
import endPoints from '@/services/auth/endPoints/endPoint'
import { useAuth } from '@/context/authContext'
import { ToastNotification } from '../structures/toast'
import { formatMoney } from '@/utils/formatMoney'
import { CopyToClipboardButton } from '@/utils/copyClipboard'
import { RiCalculatorFill, RiCalculatorLine } from 'react-icons/ri'

const VATDeductionCalculator = () => {
  const { token } = useAuth()
  const consinRef = useRef<HTMLInputElement>(null)
  const montoRef = useRef<HTMLInputElement>(null)

  const [show, setShow] = useState<boolean>(false)
  const [dataEditIgv, setDataEditIgv] = useState<KeyValueInterface | null>(null)
  const [dataEditDetractionPercent, setDataEditDetractionPercent] =
    useState<KeyValueInterface | null>(null)
  const shShow = () => {
    setShow(!show)
  }

  const [labelMonto, setLabelMonto] = useState<string>('Monto Total (con IGV)')
  const [detractionPercent, setDetractionPercent] = useState<
    KeyValueInterface[]
  >([])

  const [currentPercent, setCurrentPercent] = useState<number>(0)
  const [currentMonto, setCurrentMonto] = useState<number>(0)
  const [currentIgvType, setCurrentIgvType] = useState<string>('')

  const [hasDetraction, setHasdetraction] = useState<boolean>(false)

  const [currentBaseAmount, setCurrentBaseAmount] = useState<number>(0)
  const [currentIgvAmount, setCurrentIgvAmount] = useState<number>(0)
  const [currentTotalAmount, setCurrentTotalAmount] = useState<number>(0)

  const [currentDetraction, setCurrentDetraction] = useState<number>(0)
  const [currentNeto, setCurrentNeto] = useState<number>(0)

  useEffect(() => {
    if (!show) {
      setCurrentPercent(0)
      setCurrentMonto(0)
      setCurrentIgvType('')
      setHasdetraction(false)
      setCurrentBaseAmount(0)
      setCurrentIgvAmount(0)
      setCurrentTotalAmount(0)
      setCurrentDetraction(0)
      setCurrentNeto(0)
    }
  }, [show])

  useEffect(() => {
    const fetchData = async () => {
      if (!token) return
      try {
        const data = await getData(token)
        const detractionPercentRes = data.props.detractionPercent
        if (detractionPercentRes) setDetractionPercent(detractionPercentRes)
      } catch (error) {
        ToastNotification('danger', `Ha ocurrido un error - ${error}`)
      }
    }
    if (token) fetchData()
  }, [token])

  const changeLabelHandler = (e: string) => {
    if (e === 'igv') {
      setLabelMonto('Monto Total (con IGV)')
      setCurrentIgvType('igv')
    } else if (e === 'noIgv') {
      setLabelMonto('Monto Base (sin IGV)')
      setCurrentIgvType('noIgv')
    } else {
      setLabelMonto('Monto')
      setCurrentIgvType('')
    }
  }
  const changeDetractionPercentHandler = (e: string) => {
    try {
      setCurrentPercent(Number(e) || 0)
    } catch {
      ToastNotification('danger', `Error al cambiar porcentaje de detracción`)
    }
  }

  const handlerChangeAmount = (
    e: React.KeyboardEvent<HTMLInputElement> | string
  ) => {
    const value =
      typeof e === 'string' ? e : (e.currentTarget as HTMLInputElement).value
    setCurrentMonto(Number(value))
  }
  const formData = {
    igv: {
      name: 'igv',
      id: 'igv',
      label: 'Tipo de cálculo',
      showLabel: true,
      ref: consinRef,
      data: [
        { key: 'igv', value: 'Con IGV' },
        { key: 'noIgv', value: 'Sin IGV' }
      ],
      editData: dataEditIgv,
      onChange: changeLabelHandler,
      tiny: true,
      required: true,
      noDeleteOption: true
    },
    monto: {
      name: 'monto',
      id: 'monto',
      label: `${labelMonto}`,
      showLabel: true,
      ref: montoRef,
      tiny: true,
      type: 'number',
      step: '0.01',
      onKeyUp: handlerChangeAmount,
      required: true
    },
    porcentajeDetraccion: {
      name: 'detractionPercent',
      id: 'detractionPercent',
      label: 'Porcentaje de detracción',
      showLabel: true,
      ref: consinRef,
      data: detractionPercent,
      editData: dataEditDetractionPercent,
      tiny: true,
      onChange: changeDetractionPercentHandler,
      required: true,
      noDeleteOption: true
    }
  }

  useEffect(() => {
    setDataEditIgv({ key: 'igv', value: 'Con IGV' })
    setCurrentIgvType('igv')
  }, [])

  useEffect(() => {
    if (detractionPercent.length > 0) {
      setDataEditDetractionPercent(detractionPercent[1])
      setCurrentPercent(Number(detractionPercent[1].attr))
    }
  }, [detractionPercent])

  useEffect(() => {
    const onSubmit = async () => {
      let baseAmount = 0
      let igvAmount = 0
      let totalAmount = 0

      if (currentIgvType === 'igv') {
        baseAmount = currentMonto / 1.18
        igvAmount = currentMonto - baseAmount
        totalAmount = currentMonto
      } else if (currentIgvType === 'noIgv') {
        baseAmount = currentMonto
        igvAmount = currentMonto * 0.18
        totalAmount = baseAmount + igvAmount
      }

      setCurrentBaseAmount(baseAmount)
      setCurrentIgvAmount(igvAmount)
      setCurrentTotalAmount(totalAmount)

      // Cálculo de detracción
      const detractionThreshold = 700

      if (totalAmount >= detractionThreshold) {
        setHasdetraction(true)

        const detractionAmountRaw = (totalAmount * currentPercent) / 100
        const detractionAmount = Math.round(detractionAmountRaw)

        setCurrentDetraction(detractionAmount)
        setCurrentNeto(totalAmount - detractionAmount)
      } else {
        setHasdetraction(false)
        setCurrentDetraction(0)
        setCurrentNeto(totalAmount)
      }
    }

    if (currentIgvType && currentMonto && currentPercent) {
      onSubmit()
    } else {
      setHasdetraction(false)
    }
  }, [currentIgvType, currentMonto, currentPercent])

  return (
    <>
      <div>
        <button
          onClick={shShow}
          className='flex items-center px-4 py-2  text-2xl'
        >
          {show ? (
            <RiCalculatorFill className=' text-Charcoal/80' />
          ) : (
            <RiCalculatorLine className=' text-Charcoal/80' />
          )}
        </button>
      </div>
      {show && (
        <div className='absolute w-full sm:w-[600px] md:w-[700px] lg:w-[900px] top-[59px] right-0 bg-white flex flex-row justify-center items-center pb-0'>
          <div className='w-full flex flex-col justify-center items-center'>
            <div className='w-full flex flex-row justify-center items-center px-3 pt-3'>
              <div className='w-full flex flex-col sm:flex-row justify-center items-center bg-gray-100 rounded-t-xl p-3 flex-nowrap sm:flex-wrap lg:flex-nowrap'>
                <div className='w-full sm:w-1/2 lg:w-1/3 px-3'>
                  <Select data={formData.igv} />
                </div>
                <div className='w-full sm:w-1/2 lg:w-1/3 px-3'>
                  <Input data={formData.monto} />
                </div>
                <div className='w-full sm:w-full lg:w-1/3 px-3'>
                  <Select data={formData.porcentajeDetraccion} />
                </div>
              </div>
            </div>
            <div className='w-full flex flex-col justify-center items-center  px-3 pb-3'>
              <div
                className={`w-full flex flex-row justify-center items-center ${
                  hasDetraction
                    ? 'bg-green-100 text-green-600'
                    : 'bg-orange-100 text-orange-600'
                } text-center pt-2 pb-1 font-bold`}
              >
                {hasDetraction ? (
                  <div className=' flex flex-row justify-center items-center w-full'>
                    <div className=' leading-none h-6 flex flex-row justify-center items-center'>
                      <IoIosCheckbox size={20} />
                    </div>
                    <div className='pl-1 leading-none h-6 flex flex-row justify-center items-center'>
                      CON DETRACCIÓN{' '}
                    </div>
                    <div className='ml-2  leading-none h-6 flex flex-row justify-center items-center'>
                      <div className='w-12 rounded-lg bg-green-300 h-full  flex flex-row justify-center items-center'>
                        {currentPercent}%
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className=' flex flex-row justify-center items-center w-full'>
                    <IoIosWarning size={20} />
                    <p className='pl-1'>SIN DETRACCIÓN</p>
                  </div>
                )}
              </div>
              <div className='w-full flex flex-col lg:flex-row justify-center items-center bg-gray-100 rounded-b-xl px-3 pt-3 pb-0 xl:pb-3'>
                <div className='w-full lg:w-1/3 font-bold text-center pb-3 xl:pb-0 flex flex-row justify-center items-center'>
                  <span>Monto Base:</span>{' '}
                  {formatMoney(currentBaseAmount, 'S/')}
                  <CopyToClipboardButton
                    value={formatMoney(currentBaseAmount, '')}
                  />
                </div>
                <div className='w-full lg:w-1/3 font-bold text-blue-600 text-center pb-3 xl:pb-0 flex flex-row justify-center items-center'>
                  <span>IGV(18%):</span> {formatMoney(currentIgvAmount, 'S/')}
                  <CopyToClipboardButton
                    value={formatMoney(currentIgvAmount, '')}
                  />
                </div>
                <div className='w-full lg:w-1/3 font-bold text-green-600 text-center pb-3 xl:pb-0 flex flex-row justify-center items-center'>
                  <span>Total:</span> {formatMoney(currentTotalAmount, 'S/')}
                  <CopyToClipboardButton
                    value={formatMoney(currentTotalAmount, '')}
                  />
                </div>
              </div>
              <div className='w-full flex flex-col lg:flex-row justify-center items-center bg-gray-100 rounded-b-xl px-3 pt-0 pb-3 xl:pt-3'>
                <div className='w-full lg:w-1/2 font-bold text-center pb-3 xl:pb-0 flex flex-row justify-center items-center'>
                  <span>Detracción ({currentPercent}%):</span>{' '}
                  {formatMoney(currentDetraction, 'S/')}
                  <CopyToClipboardButton
                    value={formatMoney(currentDetraction, '')}
                  />
                </div>
                <div className='w-full lg:w-1/2 font-bold text-green-600 text-center pb-3 xl:pb-0 flex flex-row justify-center items-center'>
                  <span>Neto a recibir:</span> {formatMoney(currentNeto, 'S/')}
                  <CopyToClipboardButton value={formatMoney(currentNeto, '')} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
export { VATDeductionCalculator }

async function getData(token: string | null) {
  if (token) {
    const detractionPercent = await ApiFecthAuth(
      endPoints.mainData.detraction.percent,
      token
    )

    return {
      props: {
        detractionPercent: detractionPercent.data
      },
      revalidate: 3600
    }
  }
  return { props: { detractionPercent: null }, revalidate: 3600 }
}
