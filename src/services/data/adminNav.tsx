import { NavItem } from '@/interfaces/navigation'
import { FaProjectDiagram } from 'react-icons/fa'
import {
  FiHome,
  FiFileText,
  FiCreditCard,
  FiUsers,
  FiFile,
  FiGlobe
} from 'react-icons/fi'
import { IoCogOutline } from 'react-icons/io5'
import { LuPackagePlus } from 'react-icons/lu'
import { MdSwapHoriz } from 'react-icons/md'
import { TbCategoryPlus } from 'react-icons/tb'

export const ADMIN_NAV: NavItem[] = [
  { label: 'Escritorio', href: '/auth', icon: <FiHome /> },
  { label: 'Cotizaciones', href: '/auth/cotizaciones', icon: <FiFile /> },

  { label: 'Facturación', href: '/auth/facturacion', icon: <FiFileText /> },

  {
    label: 'Movimientos Bancarios',
    href: '/auth/movimientos',
    icon: <MdSwapHoriz />
  },
  {
    label: 'Proyectos',
    href: '/auth/proyectos',
    icon: <FaProjectDiagram />
  },
  {
    label: 'Pagos',
    href: '/auth/pagos',
    icon: <FiCreditCard />
  },
  { label: 'Clientes', href: '/auth/clientes', icon: <FiUsers /> },

  {
    label: 'Generales',
    href: '/auth/generales',
    icon: <TbCategoryPlus />,
    parent: true,
    children: [
      {
        label: 'Productos',
        href: '/auth/generales/productos',
        icon: <LuPackagePlus />
      },
      {
        label: 'Condiciones',
        href: '/auth/generales/condiciones',
        icon: <FiFile />
      },
      { label: 'Bancos', href: '/auth/generales/bancos', icon: <FiFile /> },
      {
        label: 'Unidad de medida',
        href: '/auth/generales/unidadmedida',
        icon: <FiFile />
      },
      {
        label: 'Tipo de cambio',
        href: '/auth/generales/tipocambio',
        icon: <FiFile />
      }
    ]
  },

  {
    label: 'Administración',
    href: '/auth/administracion',
    icon: <IoCogOutline className='animate-spin' />,
    parent: true,
    children: [
      {
        label: 'Usuarios',
        href: '/auth/administracion/usuarios',
        icon: <LuPackagePlus />
      }
    ]
  },
  {
    label: 'Website',
    icon: <FiGlobe />,
    href: '/auth/website',
    parent: true,
    children: [
      { label: 'Publicaciones', href: '/auth/website/posts' },
      { label: 'Historias de éxito', href: '/auth/website/success-stories' },
      { label: 'Testimonios', href: '/auth/website/testimonials' }
    ]
  }
]
