'use client'

import React, { useEffect, useRef, useState } from 'react'
import { BsTrash } from 'react-icons/bs'

import Input from '@/components/atom/structures/input'
import Select from '@/components/atom/structures/select'

import { ItemRow, parseNum } from '@/modules/invoice/utils'

import { KeyValueInterface } from '@/interfaces/structures/keyValueInterface'

interface ItemInvoicesModProps {
  item: ItemRow
  index: number
  setItems: React.Dispatch<React.SetStateAction<ItemRow[]>>
  unidadMedidaList: KeyValueInterface[]
}

const ItemInvoicesMod = ({
  item,
  index,
  setItems,
  unidadMedidaList
}: ItemInvoicesModProps) => {
  const quantityRef = useRef<HTMLInputElement>(null)
  const unitRef = useRef<HTMLInputElement>(null)
  const codeRef = useRef<HTMLInputElement>(null)
  const descriptionRef = useRef<HTMLInputElement>(null)
  const unitPriceRef = useRef<HTMLInputElement>(null)
  const deleteItem = () => {
    setItems((prev) => prev.filter((row) => row.id !== item.id))
  }
  const [dataEditUnit, setDataEditUnit] = useState<KeyValueInterface>()

  const updateItem = <K extends keyof ItemRow>(field: K, value: ItemRow[K]) => {
    setItems((prev) =>
      prev.map((row) =>
        row.id === item.id
          ? {
              ...row,
              [field]: value
            }
          : row
      )
    )
  }

  useEffect(() => {
    if (unidadMedidaList && unidadMedidaList.length > 0) {
      setDataEditUnit(
        unidadMedidaList.find((u) => u.key === 'NIU') ?? unidadMedidaList[0]
      )
    }
  }, [unidadMedidaList])

  const formData = {
    quantity: {
      name: `quantity-${item.id}`,
      id: `quantity-${item.id}`,
      label: 'Cantidad',
      showLabel: true,
      ref: quantityRef,
      type: 'number',
      min: 0,
      step: 'any',
      value: item.quantity,
      tiny: true,
      required: true,
      onChange: (value: string) => {
        updateItem('quantity', parseNum(value))
      }
    },

    unit: {
      name: `unit-${item.id}`,
      id: `unit-${item.id}`,
      label: 'Unidad',
      showLabel: true,
      ref: unitRef,
      data: unidadMedidaList,
      editData: dataEditUnit,
      tiny: true,
      required: true,
      noDeleteOption: true,
      onChange: (key: string) => {
        updateItem('unit', key)
      }
    },

    code: {
      name: `code-${item.id}`,
      id: `code-${item.id}`,
      label: 'Código',
      showLabel: true,
      ref: codeRef,
      value: item.code,
      tiny: true,
      required: false,
      onChange: (value: string) => {
        updateItem('code', value)
      }
    },

    description: {
      name: `description-${item.id}`,
      id: `description-${item.id}`,
      label: 'Descripción',
      showLabel: true,
      ref: descriptionRef,
      value: item.description,
      placeHolder: 'Detalle del servicio / producto',
      tiny: true,
      required: true,
      onChange: (value: string) => {
        updateItem('description', value)
      }
    },

    unitPrice: {
      name: `unitPrice-${item.id}`,
      id: `unitPrice-${item.id}`,
      label: 'Valor unitario',
      showLabel: true,
      ref: unitPriceRef,
      type: 'number',
      min: 0,
      step: '0.01',
      value: item.unitPrice,
      tiny: true,
      required: true,
      onChange: (value: string) => {
        updateItem('unitPrice', parseNum(value))
      }
    }
  }

  return (
    <div className='border-b border-slate-300 p-3 bg-white shadow-sm space-y-2 mt-2'>
      {/* HEADER */}
      <div className='flex justify-between items-center mb-1'>
        <h4 className='font-semibold text-slate-700'>Ítem {index + 1}</h4>

        <button
          type='button'
          className='h-6 w-6 flex items-center justify-center text-Red7 rounded'
          onClick={deleteItem}
          title='Eliminar ítem'
        >
          <BsTrash />
        </button>
      </div>

      {/* CAMPOS */}
      <div className='flex flex-col lg:flex-row justify-center items-end text-sm lg:flex-wrap'>
        {/* CANTIDAD */}
        <div className='w-full lg:w-2/12 xl:w-1/12 px-2'>
          <Input data={formData.quantity} />
        </div>

        {/* UNIDAD */}
        <div className='w-full lg:w-3/12 xl:w-2/12 px-2'>
          <Select data={formData.unit} />
        </div>

        {/* CÓDIGO */}
        <div className='w-full lg:w-2/12 xl:w-1/12 px-2'>
          <Input data={formData.code} />
        </div>

        {/* DESCRIPCIÓN */}
        <div className='w-full lg:w-5/12 xl:w-6/12 px-2'>
          <Input data={formData.description} />
        </div>

        {/* VALOR UNITARIO */}
        <div className='w-full lg:w-3/12 xl:w-2/12 px-2'>
          <Input data={formData.unitPrice} />
        </div>
      </div>
    </div>
  )
}

export { ItemInvoicesMod }
