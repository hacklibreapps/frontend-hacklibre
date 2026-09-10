/* eslint-disable @next/next/no-img-element */
import logoHacklibre from '@/assets/images/logo-hacklibre.webp'
import logoHacklibredm from '@/assets/images/logo-hacklibre-dm.webp'
import Link from 'next/link'
const LogoHacklibre = () => {
  return (
    <div className='w-48 sm:w-64'>
      <Link href='/'>
        <img
          src={logoHacklibre.src}
          alt='Hacklibre'
          className='w-full dark:hidden'
        />
        <img
          src={logoHacklibredm.src}
          alt='Hacklibre'
          className='w-full hidden dark:block'
        />
      </Link>
    </div>
  )
}
export { LogoHacklibre }
