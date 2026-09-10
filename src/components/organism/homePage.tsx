'use client'

import Link from 'next/link'

const HomePage = () => {
  return (
    <div className='flex h-screen w-full flex-col items-center justify-center bg-Charcoal'>
      <p className='mb-4 text-4xl text-Cian2'>Página Principal</p>

      <Link
        href='/auth/login'
        className='rounded bg-Cian8 px-6 py-2 text-white transition hover:bg-Cian7'
      >
        Ir al Login
      </Link>

      <Link
        href='/tests2'
        className='mt-4 rounded bg-Green8 px-6 py-2 text-white transition hover:bg-Green9'
      >
        Probar Inputs
      </Link>
    </div>
  )
}
export default HomePage
