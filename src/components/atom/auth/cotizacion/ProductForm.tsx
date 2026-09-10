'use client'
import FormContainer from '@/components/molecule/auth/structures/formContainer'
import FormContent from '@/components/molecule/auth/structures/formContent'
import Formulary from '@/components/molecule/auth/structures/formulary'

// import { Button } from '../../structures/button'
import { useRef } from 'react'
import Input from '../../structures/input'

const NewProductInQutotation = () => {
  const skuRef = useRef<HTMLInputElement>(null)
  const nombreProductoRef = useRef<HTMLInputElement>(null)
  const descripcionRef = useRef<HTMLInputElement>(null)
  const unidadRef = useRef<HTMLInputElement>(null)
  const precioUnitarioRef = useRef<HTMLInputElement>(null)
  const gravadoIgvRef = useRef<HTMLInputElement>(null)
  const igvTasaRef = useRef<HTMLInputElement>(null)
  const estadoRef = useRef<HTMLInputElement>(null)

  const formData = {
    // [SKU] campo visual SKU
    sku: {
      name: 'sku',
      id: 'sku',
      showLabel: true,
      label: 'SKU',
      ref: skuRef,
      required: true,
      tiny: true
    },

    nombreProducto: {
      name: 'nombre_producto',
      id: 'nombre_producto',
      showLabel: true,
      label: 'Nombre del producto',
      ref: nombreProductoRef,
      required: true,
      tiny: true
    },

    descripcion: {
      name: 'descripcion',
      id: 'descripcion',
      showLabel: true,
      label: 'Descripcion',
      ref: descripcionRef,
      required: true,
      tiny: true
    },

    unidad: {
      name: 'unidad',
      id: 'unidad',
      showLabel: true,
      label: 'Unidad',
      ref: unidadRef,
      required: true,
      tiny: true
    },

    precioUnitario: {
      name: 'precioUnitario',
      id: 'precioUnitario',
      showLabel: true,
      label: 'Precio Unitario',
      ref: precioUnitarioRef,
      required: true,
      tiny: true
    },

    gravadoIgv: {
      name: 'gravadoIgv',
      id: 'gravadoIgv',
      showLabel: true,
      label: 'Gravado Igv',
      ref: gravadoIgvRef,
      required: true,
      tiny: true
    },

    igvTasa: {
      name: 'igvTasa',
      id: 'igvTasa',
      showLabel: true,
      label: 'IGV Tasa',
      ref: igvTasaRef,
      required: true,
      tiny: true
    },

    estado: {
      name: 'estado',
      id: 'estado',
      showLabel: true,
      label: 'Estado',
      ref: estadoRef,
      required: true,
      type: 'switch',
      value: true,
      tiny: true
    }

    // submit: {
    //   name: 'submit',
    //   id: 'submit',
    //   label: 'submit',
    //   showLabel: false,
    //   type: 'submit',
    //   buttonName: `${uuid ? 'Guardar' : 'Registrar'}`,
    //   disabled: submitLoaded,
    //   loaded: submitLoaded,
    //   tiny: true
    // }
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
  }
  return (
    <Formulary onSubmit={onSubmit}>
    
      <FormContainer>
        {/* [SKU] habilitado */}
        <FormContent className='w-full xl:w-3/12'>
          <Input data={formData.sku} />
        </FormContent>

        <FormContent className='w-full xl:w-3/12'>
          <Input data={formData.nombreProducto} />
        </FormContent>
        <FormContent className='w-full xl:w-3/12'>
          <Input data={formData.descripcion} />
        </FormContent>
        <FormContent className='w-full xl:w-3/12'>
          <Input data={formData.unidad} />
        </FormContent>
        <FormContent className='w-full xl:w-3/12'>
          <Input data={formData.precioUnitario} />
        </FormContent>
        <FormContent className='w-full xl:w-3/12'>
          <Input data={formData.gravadoIgv} />
        </FormContent>
        <FormContent className='w-full xl:w-3/12'>
          <Input data={formData.igvTasa} />
        </FormContent>
        <FormContent className='w-full xl:w-3/12 xl:pt-6'>
          <Input data={formData.estado} />
        </FormContent>
        {/* <FormContent
          className='w-full '
          classNameInter='flex flex-row justify-center items-center'
        >
          <div className='w-full xl:w-1/3 pt-5'>
            <Button data={formData.submit} />
          </div>
        </FormContent> */}
      </FormContainer>
      
    </Formulary>
  )
}
export { NewProductInQutotation }
