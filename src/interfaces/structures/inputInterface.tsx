import React, { RefObject } from 'react'
import { KeyValueInterface } from './keyValueInterface'
export type ButtonUiType = 'solid' | 'badge'
export type ButtonBadgeVariant = 'cian' | 'red' | 'green' | 'neutral'
import type { Editor as TinyMCEEditor } from 'tinymce'

export interface InputContainerProps {
  children: React.ReactNode
}

export interface InputInterface {
  name: string
  id: string
  label: string
  showLabel: boolean

  // Eventos
  onClick?: (key: string) => void
  onClickEvent?: (e: React.ChangeEvent<HTMLInputElement>) => void
  onKeyUp?: (e: React.KeyboardEvent<HTMLInputElement> | string) => void
  onChange?: (key: string) => void
  onChangeSearch?: (key: string) => void
  onChange2?: (e: React.ChangeEvent<HTMLInputElement>) => void

  ref: RefObject<HTMLInputElement>

  // Config
  type?: string
  step?: string
  decimal?: boolean
  placeHolder?: string
  required?: boolean
  minLen?: number
  maxLen?: number
  minDate?: string
  maxDate?: string
  readOnly?: boolean
  pattern?: string
  errorMessage?: string
  regex?: RegExp
  value?: string | number | boolean | null
  defaultValue?: string | number | boolean | null
  acceptedDocuments?: string // para <input accept="...">
  alertColor?: boolean
  validInput?: boolean
  preview?: string
  simple?: boolean
  disabled?: boolean
  data?: KeyValueInterface[]
  editData?: KeyValueInterface | null
  resetSignal?: boolean
  resetHandler?: () => void
  noDeleteOption?: boolean
  checked?: boolean
  className?: string
  tiny?: boolean

  // Extras para el bloque agregado
  isLogin?: boolean
  hiddenLabel?: boolean
  darkLabel?: boolean
  labelRef?: RefObject<HTMLLabelElement>
  allToUp?: boolean
  asHorizontal?: boolean
}

export interface TextAreaInterface {
  name: string
  id: string
  label: string
  showLabel: boolean
  onClick?: () => void
  onKeyUp?: () => void
  onChange?: (() => void) | ((contenido: string) => void)
  ref: RefObject<HTMLTextAreaElement>
  tinyMceRef?: React.MutableRefObject<TinyMCEEditor | null>
  type?: string
  decimal?: boolean
  placeHolder?: string
  required?: boolean
  minLen?: number
  maxLen?: number
  minDate?: string
  maxDate?: string
  readOnly?: boolean
  pattern?: string
  errorMessage?: string
  regex?: RegExp
  value?: string | number | boolean | null
  acceptedDocuments?: string
  alertColor?: boolean
  validInput?: boolean
  preview?: string
  simple?: boolean
  disabled?: boolean
  row?: number
  tiny?: boolean
  className?: string
}

export interface ButtonInterface {
  name: string
  id: string
  label: string
  showLabel: boolean
  type?: string
  onClick?: () => void
  buttonName: string | React.ReactNode
  disabled?: boolean
  loaded?: boolean
  compact?: boolean
  tiny?: boolean

  // 🔽 nuevos opcionales para badge/estilos
  className?: string
  uiType?: ButtonUiType // 'solid' (default) | 'badge'
  badgeCount?: number // sólo si uiType === 'badge'
  badgeVariant?: ButtonBadgeVariant // 'cian' | 'red' | 'green' | 'neutral'
}

export interface InputProps {
  data: InputInterface
}
export interface TextAreaProps {
  data: TextAreaInterface
}
export interface ButtonProps {
  data: ButtonInterface
}
