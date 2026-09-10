'use client'

import Input from '@/components/atom/structures/input'
import TextArea from '@/components/atom/structures/textArea'
import { CondicionesInterface } from '@/interfaces/structures/quotationsInterface'
import { BsTrash } from 'react-icons/bs'
import { FC, useEffect, useMemo, useRef, useState } from 'react'
import { KeyValueInterface } from '@/interfaces/structures/keyValueInterface'
import Select from '@/components/atom/structures/select'

interface ItemCondicionProps {
  cond: CondicionesInterface
  idx: number
  actualizarCondicion: (
    idx: number,
    campo: keyof CondicionesInterface,
    valor: string | boolean | CondicionesInterface | null
  ) => void
  eliminarCondicion: (idx: number) => void
  condicionesOptions: CondicionesInterface[]
  uuid?: string
}

function toConditionKeyValues(
  condicion: CondicionesInterface[] | undefined | null
): KeyValueInterface[] {
  const mapped = (condicion ?? [])
    .filter((p) => p?.uuid && p?.titulo)
    .map((p) => ({
      key: p.uuid,
      value: p.titulo
    }))
  const dedup = Array.from(
    new Map(mapped.map((i) => [String(i.key), i])).values()
  )
  dedup.sort((a, b) => a.value.localeCompare(b.value, 'es'))
  return dedup
}

const ItemCondicion: FC<ItemCondicionProps> = ({
  cond,
  idx,
  actualizarCondicion,
  eliminarCondicion,
  condicionesOptions,
  uuid
}) => {
  const tituloRef = useRef<HTMLInputElement>(null)
  const condicionesRef = useRef<HTMLInputElement>(null)
  const contenidoRef = useRef<HTMLTextAreaElement>(null)
  const checkboxRef = useRef<HTMLInputElement>(null)
  const [resetCondicion, setResetCondicion] = useState<boolean>(false)
  const [dataEditCondition, setDataEditCondition] =
    useState<KeyValueInterface | null>(null)
  const handlerRestartResetCondicion = () => {
    if (resetCondicion) setResetCondicion(false)
  }

  const condiciones = useMemo(
    () => toConditionKeyValues(condicionesOptions),
    [condicionesOptions]
  )

  // 🔁 Cuando se selecciona una condición desde el Select
  const handleSelectCondicion = (uuid: string) => {
    const seleccionada = condicionesOptions.find((c) => c.uuid === uuid)
    if (seleccionada) {
      actualizarCondicion(idx, 'titulo', seleccionada.titulo)
      actualizarCondicion(idx, 'contenido', seleccionada.contenido)
      actualizarCondicion(idx, 'porDefecto', seleccionada.porDefecto || false)
      actualizarCondicion(idx, 'condicionSeleccionada', seleccionada) // ✅ guarda el objeto completo
      actualizarCondicion(idx, 'guardarNuevo', false) // Desactiva el "nuevo"
    } else {
      actualizarCondicion(idx, 'condicionSeleccionada', null)
    }
  }

  useEffect(() => {
    if (uuid && cond.condicionSeleccionada && condiciones) {
      const prodSelected = condiciones.find(
        (p) => p.key === cond.condicionSeleccionada?.uuid
      )
      if (prodSelected)
        setDataEditCondition({
          key: prodSelected.key,
          value: prodSelected.value
        })
    }
  }, [uuid, cond.condicionSeleccionada, condiciones])

  const formData = {
    condiciones: {
      name: 'condiciones',
      id: 'condiciones',
      label: 'Condiciones predefinidas',
      showLabel: true,
      ref: condicionesRef,
      data: condiciones,
      tiny: true,
      required: false,
      editData: dataEditCondition,
      onChange: (e: string) => handleSelectCondicion(e),
      resetSignal: resetCondicion,
      resetHandler: handlerRestartResetCondicion,
      readOnly: cond.porDefecto
    },
    titulo: {
      name: `titulo_${idx}`,
      id: `titulo_${idx}`,
      showLabel: true,
      label: 'Título',
      required: true,
      tiny: true,
      ref: tituloRef,
      value: cond.titulo,
      // onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
      //   actualizarCondicion(idx, 'titulo', e.target.value)
      onKeyUp: (e: React.KeyboardEvent<HTMLInputElement> | string) => {
        const value =
          typeof e === 'string'
            ? e
            : (e.currentTarget as HTMLInputElement).value
        actualizarCondicion(idx, 'titulo', value)
      }
    },
    contenido: {
      name: `contenido_${idx}`,
      id: `contenido_${idx}`,
      showLabel: true,
      label: 'Condición',
      required: true,
      tiny: true,
      type: 'tinyMCE',
      row: 300,
      ref: contenidoRef,
      value: cond.contenido,
      onChange: (val: string) => actualizarCondicion(idx, 'contenido', val)
    },
    guardarNuevo: {
      name: `guardarNuevo_${idx}`,
      id: `guardarNuevo_${idx}`,
      showLabel: true,
      label: 'Guardar esta condición como nueva',
      required: true,
      tiny: true,
      type: 'checkbox',
      ref: checkboxRef,
      checked: !!cond.guardarNuevo,
      onChange2: (e: React.ChangeEvent<HTMLInputElement>) => {
        return actualizarCondicion(idx, 'guardarNuevo', e.target.checked)
      }
    }
  }

  return (
    <div className='flex w-full flex-col border-b border-Greys p-3'>
      <div className='w-full flex flex-col md:flex-row items-center'>
        <div className='w-full lg:w-1/2 pr-3'>
          <Select data={formData.condiciones} />
        </div>
        <div className='w-full lg:w-1/2 pr-3'>
          <Input data={formData.titulo} />
        </div>
      </div>

      <div className='w-full'>
        <TextArea data={formData.contenido} />
      </div>
      <div className='w-full mt-2 flex flex-col sm:flex-row items-center justify-between'>
        <div className='w-full md:w-1/2'>
          {!cond.porDefecto && !cond.condicionSeleccionada && (
            <Input data={formData.guardarNuevo} />
          )}
        </div>
        <div>
          <div className='w-full md:w-1/2 flex justify-end py-2 items-start mt-3 md:mt-0'>
            <button
              type='button'
              className='text-Red7 text-sm font-medium hover:underline flex items-center'
              onClick={() => eliminarCondicion(idx)}
            >
              <BsTrash className='mr-1' /> Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export { ItemCondicion }
