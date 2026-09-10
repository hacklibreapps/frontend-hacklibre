'use client'

import gilroy from '@/assets/fonts/fonts'
import { AuthProvider } from '@/context/authContext'
import { Tooltip } from 'react-tooltip'

const gilroyfont = gilroy

const HtmlBody = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang='es' className='bg-WhiteBone '>
      <body className={`${gilroyfont.className}`}>
        <AuthProvider>
          {children}
          <Tooltip id='tooltip' className='z-50' />
        </AuthProvider>
      </body>
    </html>
  )
}

export { HtmlBody }
