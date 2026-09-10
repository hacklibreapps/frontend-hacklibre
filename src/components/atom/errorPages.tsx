'use client'

import { useEffect, useState } from 'react'

import error404Image from '@/assets/images/not-found.webp'
import error401Image from '@/assets/images/no-authorized.webp'
import { Img } from '@/utils/img'
import { Button } from './structures/button'
import { BsArrowLeft } from 'react-icons/bs'
import { useRouter } from 'next/navigation'

interface ErrorItem {
  [key: string]: string
}

const errorsText: ErrorItem[] = [
  { '404': 'Página no encontrada' },
  { '401': 'No autorizado' }
]
const errorsTextDisclaimer: ErrorItem[] = [
  { '404': 'La página que estas buscando no se encuentra.' },
  { '401': 'No está autorizado para visualizar estos módulos.' }
]

interface ErrorPagesProps {
  error: string | number
  isAuth?: boolean
}

const ErrorPages: React.FC<ErrorPagesProps> = ({ error, isAuth }) => {
  const [errorImage, setErrorImage] = useState<string>('')
  const [errorMessage, setErrorMessage] = useState<string>(
    'Ocurrió un error inesperado'
  )
  const [errorDisclaimer, setErrorDisclaimer] = useState<string>(
    'Tuvimos problemas para procesar esta información'
  )

  useEffect(() => {
    const errorKey = String(error)

    // Buscar mensaje en la lista
    const found = errorsText.find((item) => item[errorKey])
    if (found) {
      setErrorMessage(found[errorKey])
    } else {
      setErrorMessage('Ocurrió un error inesperado')
    }

    const founded = errorsTextDisclaimer.find((item) => item[errorKey])
    if (founded) {
      setErrorDisclaimer(founded[errorKey])
    } else {
      setErrorDisclaimer('Tuvimos problemas para procesar esta información')
    }

    // Seleccionar imagen según el código
    switch (errorKey) {
      case '404':
        setErrorImage(error404Image.src)
        break
      case '401':
        setErrorImage(error401Image.src)
        break
      default:
        setErrorImage(error404Image.src)
        break
    }
  }, [error])

  const router = useRouter()

  const goBack = () => {
    if (isAuth) router.push('/auth/')
    else router.push('/')
  }
  return (
    <div className='flex flex-col items-center justify-center h-[calc(100vh-90px)]'>
      {errorImage && <Img src={errorImage} alt={`Error ${error}`} />}

      <h1 className='text-center text-4xl font-bold text-Charcoal pt-10'>
        {errorMessage}
      </h1>
      <p className='text-center text-Charcoal font-medium text-lg py-5'>
        {errorDisclaimer}
      </p>

      <div className='w-full flex flex-row justify-center items-center'>
        <div className='w-full sm:w-10/12 md:w-8/12 lg:w-6/12 xl:w-4/12 2xl:w-2/12'>
          <Button
            data={{
              name: 'logout',
              id: 'logout',
              label: '',
              showLabel: false,
              type: 'submit',
              buttonName: (
                <div className='flex flex-row justify-center items-center '>
                  <BsArrowLeft className='mr-2 text-2xl' />
                  <p className='pl-2'>REGRESAR</p>
                </div>
              ),
              compact: true,
              onClick: goBack
            }}
          />
        </div>
      </div>
    </div>
  )
}

export { ErrorPages }
