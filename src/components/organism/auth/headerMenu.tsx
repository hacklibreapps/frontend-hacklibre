import logo from '@/assets/images/logo-hacklibre.webp'
import { Img } from '@/utils/img'

const HeaderMenu = ({ children }: { children?: React.ReactNode }) => {
  return (
    <header className='sticky z-20 top-0 w-full h-20 flex flex-row justify-center items-center bg-DarkBlue'>
      <div className='w-3/12 lg:w-2/12 flex flex-row justify-center items-center'>
        <Img src={logo.src} alt='logo' className='w-48 h-full px-3' />
      </div>
      <div className='w-9/12 lg:w-10/12 '>{children}</div>
    </header>
  )
}
export default HeaderMenu
