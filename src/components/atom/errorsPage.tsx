'use client'
import { Img } from '@/utils/img'
import Link from 'next/link'
import { prefix } from '@/services/envs/envs'
import { LuArrowLeft } from 'react-icons/lu'
interface ErrorPagesProps {
  title?: string
  description: string
  returnText?: string
  imageUrl: string
}
const ErrorPage = ({
  title,
  description = 'Ha ocurrido un problema.',
  returnText = 'Regresar',
  imageUrl
}: ErrorPagesProps) => {
  const goBack = `${prefix}`
  return (
    <div className='w-full h-full flex pt-10 flex-col '>
      <div className='w-full text-center flex flex-col justify-center items-center'>
        <Img src={imageUrl} alt='UNAUTHORIZED' className='w-64' />
        {title ? (
          <p className='text-5xl font-bold text-DarkBlue py-5 '>{title}</p>
        ) : null}
        <p className={`text-2xl text-DarkBlue ${title ? 'pb-5' : 'py-5'}`}>
          {description}
        </p>
        <Link
          href={`${goBack}/`}
          className='w-full flex flex-col  pb-5 justify-center items-center text-black'
        >
          <div className='flex flex-row justify-center text-DarkBlue items-center'>
            <p className='text-4xl pr-2'>
              <LuArrowLeft />
            </p>
            <p className='text-2xl'>{returnText}</p>
          </div>
        </Link>
      </div>
    </div>
  )
}

export default ErrorPage
