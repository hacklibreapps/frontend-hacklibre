'use client'
import unauthorized from '@/assets/images/no-authorized.webp'
import ErrorPage from '../../errorsPage'

const Unauthorized = () => {
  return (
    <ErrorPage
      description='No tiene permisos para acceder a esta página.'
      imageUrl={unauthorized.src}
    />
  )
}

export { Unauthorized }
