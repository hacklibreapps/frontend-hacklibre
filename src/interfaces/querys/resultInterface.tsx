import {
  BancoInterface,
  ClienteInterface,
  CotizacionInterface,
  FacturacionInterface,
  ProductosInterface
} from './queryInterface'

interface BaseResultInterface {
  count: number
  next: null | string
  previous: null | string
}

export interface ClienteResultInterface extends BaseResultInterface {
  results: ClienteInterface | []
}

export interface ProductosResultInterface extends BaseResultInterface {
  results: ProductosInterface | []
}

export interface BancosResultInterface extends BaseResultInterface {
  results: BancoInterface | []
}
export interface CotizacionResultInterface extends BaseResultInterface {
  results: CotizacionInterface[] | []
}
export interface FacturacionResultInterface extends BaseResultInterface {
  results: FacturacionInterface[] | []
}
