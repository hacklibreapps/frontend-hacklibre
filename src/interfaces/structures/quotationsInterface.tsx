import { KeyValueInterface } from './keyValueInterface'
export type CondicionInterface = {
  uuid: string
  titulo: string
  contenido: string
  porDefecto: boolean
  guardarNuevo?: boolean
}
export type CondicionesInterface = {
  uuid: string
  titulo: string
  contenido: string
  porDefecto: boolean
  guardarNuevo?: boolean
  condicionSeleccionada?: Omit<
    CondicionInterface,
    'condicionSeleccionada'
  > | null
}
export type ProductoInterface = {
  uuid: string
  nombre: string
  descripcion: string
  sku?: string
  precioUnitario: number
  precioVenta: number
  incluyeIgv: boolean
  igvTasa: number
  gravadoIgv: boolean
  unidad: KeyValueInterface
  moneda: {
    key: string
    value: string
    simbol: string
  }
}
export type ItemCotizacionForm = {
  producto?: ProductoInterface
  nombre?: string
  descripcion: string
  cantidad: number
  precioUnitario: number
  precioUnitarioOriginal: number
  descuentoPct: number
  incluyeIgv: boolean
  igvPct: number
  subtotal: number
  igv: number
  total: number
  moneda: {
    key: string
    value: string
    simbol: string
  }
  guardarNuevo?: boolean
}
