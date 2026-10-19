'use client'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'
import { TbLoaderQuarter } from 'react-icons/tb'

const LoadingQuarter = ({ value }: { value?: string }) => {
  return (
    <div className={`w-full flex flex-col justify-center items-center`}>
      <p className=''>
        <TbLoaderQuarter className={`text-Cian8 w-12 h-auto animate-spin`} />
      </p>
      {value ? <p className='pt-5 font-medium text-lg'>{value}</p> : null}
    </div>
  )
}

// 🐢 Tortuga animada (rebote suave + huellitas)
const LoadingTurtle = ({ value }: { value?: string }) => {
  return (
    <div className='w-full h-full flex flex-col justify-center items-center text-center overflow-hidden'>
      <svg
        width='140'
        height='120'
        viewBox='0 0 140 120'
        xmlns='http://www.w3.org/2000/svg'
        className='animate-bounce-slow'
      >
        {/* 👣 Huellitas detrás */}
        <g opacity='0.5'>
          {[10, 25, 40, 55].map((x, i) => (
            <circle key={i} cx={x} cy='90' r='3' fill='#b7e1a1'>
              <animate
                attributeName='opacity'
                values='0;1;0'
                dur='3s'
                begin={`${i * 0.5}s`}
                repeatCount='indefinite'
              />
            </circle>
          ))}
        </g>

        {/* 🐢 Cuerpo principal */}
        {/* Caparazón */}
        <ellipse cx='70' cy='60' rx='35' ry='25' fill='#2e7d32' />
        {/* Detalle caparazón */}
        <path
          d='M35 60 Q70 30 105 60 Q70 90 35 60 Z'
          fill='none'
          stroke='#145a32'
          strokeWidth='2'
        />
        <polygon
          points='70,45 80,57 70,69 60,57'
          fill='#43a047'
          stroke='#2e7d32'
          strokeWidth='1'
        />

        {/* Cabeza */}
        <circle cx='30' cy='60' r='10' fill='#66bb6a' />
        <circle cx='28' cy='57' r='2' fill='black' />
        <path
          d='M26 63 Q29 65 32 63'
          stroke='black'
          strokeWidth='1'
          fill='none'
        />

        {/* Patas */}
        <ellipse cx='50' cy='85' rx='8' ry='4' fill='#66bb6a' />
        <ellipse cx='90' cy='85' rx='8' ry='4' fill='#66bb6a' />
        <ellipse cx='50' cy='35' rx='8' ry='4' fill='#66bb6a' />
        <ellipse cx='90' cy='35' rx='8' ry='4' fill='#66bb6a' />

        {/* Cola */}
        <path d='M105 60 Q112 58 115 60 Q112 62 105 60' fill='#388e3c' />
      </svg>

      {value && (
        <p className='pt-4 font-medium text-lg text-gray-700 animate-fadeIn'>
          {value}
        </p>
      )}
    </div>
  )
}

//  Pingüino animado
const Loading = ({ value }: { value?: string }) => {
  return (
    <div className='w-full h-full flex flex-row justify-center items-center text-center'>
      <div className='text-xl animate-spin text-Cian8'>
        <AiOutlineLoading3Quarters />
      </div>

      {value && (
        <p className='pl-4 font-medium text-lg text-gray-700 '>{value}</p>
      )}
    </div>
  )
}

//Si quieres que el pingüino “camine” o “salude”, puedes usar animaciones SVG puras:

{
  /* <svg ...>
  <circle cx='50' cy='50' r='10'>
    <animate
      attributeName='cy'
      values='50;55;50'
      dur='1s'
      repeatCount='indefinite'
    />
  </circle>
</svg> */
}

export { Loading, LoadingQuarter, LoadingTurtle }
