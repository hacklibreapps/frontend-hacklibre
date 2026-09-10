export interface DataServices {
  title: string
  subTitle: string
  url: string
  image: string
}

export interface ServiceCharacteristic {
  icon: JSX.Element
  title: string
  description: string
}

export interface ServiceTechUsedInterface {
  icon: JSX.Element
  name: string
}

export interface CallToActionInterface {
  content: string
  schedule: boolean
  contactUs: boolean
}
