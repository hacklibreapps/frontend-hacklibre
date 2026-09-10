'use client'

import PerfectScrollbar from '@ofsajd/react-perfect-scrollbar'
import { ReactNode } from 'react'

interface PerfectScrollbarWrapperProps {
  children: ReactNode
  className?: string
  style?: React.CSSProperties
}

const PerfectScrollbarWrapper: React.FC<PerfectScrollbarWrapperProps> = ({
  children,
  className,
  style
}) => {
  return (
    <PerfectScrollbar className={className} style={style}>
      {children}
    </PerfectScrollbar>
  )
}

export default PerfectScrollbarWrapper
