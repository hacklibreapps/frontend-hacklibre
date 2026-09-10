'use client'

import Dialogs from '../../../atom/structures/dialogo'
import { ModalSize } from '@/interfaces/querys/queryInterface'
import { NewProductInQutotation } from '@/components/atom/auth/cotizacion/ProductForm'
import { ProductoInterface } from '@/interfaces/structures/quotationsInterface'

type Props = {
  open: ModalSize | null
  onClose: () => void
  onProductCreated: (producto: ProductoInterface) => void
}

const NewProductInQuotation: React.FC<Props> = ({
  open,
  onClose,
  onProductCreated
}) => {
  const HandlerSaveProduct = () => {
    // ⚠️ placeholder temporal (hasta conectar refs)
    const producto: ProductoInterface = {
      uuid: crypto.randomUUID(),
      nombre: '',
      descripcion: '',
      precioUnitario: 0,
      precioVenta: 0,
      sku: '',
      incluyeIgv: false,
      igvTasa: 18,
      gravadoIgv: true,
      unidad: { key: 'UNIDAD', value: 'Unidad' },
      moneda: {
        key: 'PEN',
        value: 'SOLES',
        simbol: 'S/'
      }
    }

    onProductCreated(producto)
    onClose()
  }

  return (
    <Dialogs
      open={open === 'xxl'}
      onClose={onClose}
      onConfirm={HandlerSaveProduct}
      size='xxl'
      title='Nuevo Producto'
      confirmText='Confirmar'
      cancelText='Cancelar'
    >
      <NewProductInQutotation />
    </Dialogs>
  )
}

export { NewProductInQuotation }
