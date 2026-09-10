import Link from 'next/link'
import { BsArrowLeftCircleFill } from 'react-icons/bs'

const GoBack = ({enlace='/', descripcion="Regresar"}:{enlace:string; descripcion?:string}) => {
  return (
    <div className='border border-Cian8 bg-white rounded-full text-Cian8 hover:text-DarkBlue hover:border-DarkBlue cursor-pointer text-4xl absolute top-2 left-4'>
      <Link
        href={enlace}
        data-tooltip-id='tooltip'
        data-tooltip-place='right'
        data-tooltip-content={descripcion}
      >
        <BsArrowLeftCircleFill />
      </Link>
    </div>
  )
}

export default GoBack
