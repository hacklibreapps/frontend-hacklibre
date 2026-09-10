'use client'

/* eslint-disable @next/next/no-img-element */
import bgHacklibreFooter from '@/assets/images/hacklibre_footer.webp'
import bgHacklibreFooterdm from '@/assets/images/hacklibre_footer_dm.webp'
import { GiCoffeeCup } from 'react-icons/gi'
import { RiHeartFill } from 'react-icons/ri'
import { useAuth } from '@/context/authContext'
import { Img } from '@/utils/img'
import Logout from '../atom/auth/logoutButton'

const Footer = () => {
  const currentYear = new Date().getFullYear()
  const { isAuthenticated } = useAuth()

  return (
    <div className='w-full flex flex-col justify-center items-center pt-10 pb-20 md:pt-32 md:pb-20'>
      <Img
        src={bgHacklibreFooter.src}
        alt='Hacklibre'
        className='w-12 h-auto block dark:hidden'
      />
      <Img
        src={bgHacklibreFooterdm.src}
        alt='Hacklibre'
        className='w-12 h-auto hidden dark:block'
      />

      <p className='py-5'>
        Todos los derechos reservados Copyright &copy; {currentYear}
      </p>

      <div className='flex flex-row justify-center items-center py-1 gap-2'>
        Hecho con
        <RiHeartFill className='text-PinguinRed6 text-xl' />
        y mucho
        <GiCoffeeCup className='text-Coffe text-xl' />
        por <span className='pl-1 font-bold'>Hacklibre</span>
        {isAuthenticated() && (
          <span className='pl-4'>
            <Logout
              label='Cerrar sesión'
              redirectTo='/auth/login'
              className='!min-w-0 px-0 text-Red7 hover:text-Red8 underline bg-transparent border-0 shadow-none'
            />
          </span>
        )}
      </div>
    </div>
  )
}

export { Footer }
