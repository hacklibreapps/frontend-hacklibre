import {
  ButtonInterface,
  InputInterface
} from '@/interfaces/structures/inputInterface'

export interface FilteredFormDataCotizacionInterface {
  cotizacion: InputInterface
  cliente: InputInterface
  estado: InputInterface
  submit: ButtonInterface
  reset: ButtonInterface
}

export interface FilteredFormDataFacturacionInterface {
  tipoComprobante: InputInterface
  empresa: InputInterface
  mes: InputInterface
  año: InputInterface
  submit: ButtonInterface
  reset: ButtonInterface
}
