import { IconType } from 'react-icons'
import { BsEyeFill } from 'react-icons/bs'

import { LiaFileInvoiceDollarSolid } from 'react-icons/lia'
// import { BsTrash } from 'react-icons/bs'
// import { FiUser, FiSettings, FiDownload } from 'react-icons/fi'

const defaultClassName = 'text-Cian8'

const icons = {
  invoice: LiaFileInvoiceDollarSolid,
  view: BsEyeFill
  //   trash: BsTrash,
  //   user: FiUser,
  //   settings: FiSettings,
  //   download: FiDownload
} satisfies Record<string, IconType>

export type SystemIconName = keyof typeof icons

interface SystemIconProps {
  name: SystemIconName
  className?: string
  color?: string
}

const Icons = ({ name, className = '', color }: SystemIconProps) => {
  const Icon = icons[name]

  return <Icon className={`${className} ${color ?? defaultClassName}`} />
}

export { Icons }
