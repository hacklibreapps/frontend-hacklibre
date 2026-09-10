import software_development from '@/assets/images/services/software_development.webp'
import e_commerce from '@/assets/images/services/e_commerce.webp'
import app_development from '@/assets/images/services/app_development.webp'
import infraestructure from '@/assets/images/services/infraestructure.webp'
import corporative_capacitation from '@/assets/images/services/corporative_capacitation.webp'
import { DataServices } from '@/interfaces/services'

export const serviceData: DataServices[] = [
  {
    title: 'Desarrollo de software',
    subTitle: 'Software a medida',
    url: '/services/software-development/',
    image: software_development.src
  },
  {
    title: 'Desarrollo móvil',
    subTitle: 'Android & iOS',
    url: '/services/mobile-development/',
    image: e_commerce.src
  },
  {
    title: 'Desarrollo ecommerce',
    subTitle: 'Impulsamos tus ventas',
    url: '/services/ecommerce/',
    image: app_development.src
  },
  {
    title: 'Infraestructura',
    subTitle: 'Servidores a medida',
    url: '/services/infraestructure/',
    image: infraestructure.src
  },
  {
    title: 'Automatización',
    subTitle: 'Control climático',
    url: '/services/automation/',
    image: corporative_capacitation.src
  }
]
