import localFont from 'next/font/local'
const gilroy = localFont({
  src: [
    {
      path: 'gilroy/gilroy_thin.otf',
      weight: '100',
      style: 'normal'
    },
    {
      path: 'gilroy/gilroy_thin_italic.otf',
      weight: '100',
      style: 'italic'
    },
    {
      path: 'gilroy/gilroy_ultra_light.otf',
      weight: '200',
      style: 'normal'
    },
    {
      path: 'gilroy/gilroy_ultra_light_italic.otf',
      weight: '200',
      style: 'italic'
    },
    {
      path: 'gilroy/gilroy_light.otf',
      weight: '300',
      style: 'normal'
    },
    {
      path: 'gilroy/gilroy_light_italic.otf',
      weight: '300',
      style: 'italic'
    },
    {
      path: 'gilroy/gilroy_regular.otf',
      weight: '400',
      style: 'normal'
    },
    {
      path: 'gilroy/gilroy_regular_italic.otf',
      weight: '400',
      style: 'italic'
    },
    {
      path: 'gilroy/gilroy_medium.otf',
      weight: '500',
      style: 'normal'
    },
    {
      path: 'gilroy/gilroy_medium_italic.otf',
      weight: '500',
      style: 'italic'
    },
    {
      path: 'gilroy/gilroy_semi_bold.otf',
      weight: '600',
      style: 'normal'
    },
    {
      path: 'gilroy/gilroy_semi_bold_italic.otf',
      weight: '600',
      style: 'italic'
    },
    {
      path: 'gilroy/gilroy_bold.otf',
      weight: '700',
      style: 'normal'
    },
    {
      path: 'gilroy/gilroy_bold_italic.otf',
      weight: '700',
      style: 'italic'
    },
    {
      path: 'gilroy/gilroy_extra_bold.otf',
      weight: '800',
      style: 'normal'
    },
    {
      path: 'gilroy/gilroy_extra_bold_italic.otf',
      weight: '800',
      style: 'italic'
    },
    {
      path: 'gilroy/gilroy_black.otf',
      weight: '900',
      style: 'normal'
    },
    {
      path: 'gilroy/gilroy_black_italic.otf',
      weight: '900',
      style: 'italic'
    }
  ],
  variable: '--font-gilroy',
  display: 'swap',
  preload: true
})

export default gilroy
