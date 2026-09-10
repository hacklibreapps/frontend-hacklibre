import type { Metadata } from 'next'
import '../assets/css/globals.css'
import '../assets/css/GrapesCss.css'
import '../assets/css/bglogin.css'
import '../assets/css/waves.css'
import '../assets/css/appointlet.css'
import '../assets/css/login.css'
import '../assets/css/notfound.css'

import { ToastContainer } from 'react-toastify'
import { HtmlBody } from '@/components/atom/structures/htmlBody'
import GoogleAnalytics from '@/services/google/googleAnalitics'

export const metadata: Metadata = {
  metadataBase: new URL('https://hacklibre.com'),
  title: {
    template: '%s - Hacklibre',
    default: 'Hacklibre - Soluciones Digitales Personalizadas'
  },
  description:
    'Hacklibre ofrece soluciones tecnológicas personalizadas, incluyendo desarrollo web, aplicaciones móviles y sistemas de gestión empresarial.',
  keywords:
    'Hacklibre, desarrollo web, soluciones digitales, aplicaciones móviles, sistemas de gestión, software personalizado, optimización SEO',

  // alternates: {
  //   canonical: 'https://hacklibre.com',
  //   languages: {
  //     'es-ES': 'https://hacklibre.com/es',
  //     'en-US': 'https://hacklibre.com/en'
  //   }
  // },
  openGraph: {
    type: 'website',
    locale: 'es_PE',
    url: 'https://hacklibre.com/',
    title: 'Hacklibre - Soluciones Digitales Personalizadas',
    description:
      'Mejora tu experiencia digital con nuestras soluciones personalizadas en desarrollo web y aplicaciones.',
    siteName: 'Hacklibre',
    images: [
      {
        url: 'http://hacklibre.com/images/hacklibre_og.png',
        width: 1200,
        height: 630,
        alt: 'Hacklibre - Desarrollo web y aplicaciones'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    site: '@hacklibre',
    title: 'Hacklibre - Soluciones Digitales Personalizadas',
    description:
      'Ofrecemos soluciones tecnológicas a medida, desde desarrollo web hasta aplicaciones móviles.',
    images: [
      {
        url: 'https://hacklibre.com/hacklibre_x.png',
        width: 1200,
        height: 675,
        alt: 'Hacklibre - Soluciones tecnológicas personalizadas'
      }
    ]
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png'
  }
}

const ga_id = process.env.NEXT_PUBLIC_GA || ''

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <HtmlBody>
      <GoogleAnalytics ga_id={ga_id} />
      <ToastContainer
        position='top-center'
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme='light'
      />
      {children}
    </HtmlBody>
  )
}
