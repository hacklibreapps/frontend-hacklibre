'use client'

import PageTitle from '@/components/atom/auth/structures/pageTitlte'
import GoBack from '@/components/atom/goback'
import { Button } from '@/components/atom/structures/button'
import PageContainer from '@/components/atom/structures/containers/pageContainer'
import PageContent from '@/components/atom/structures/containers/pageContent'
import Input from '@/components/atom/structures/input'
import Select from '@/components/atom/structures/select'
import TextArea from '@/components/atom/structures/textArea'
import { ToastNotification } from '@/components/atom/structures/toast'
import FormContainer from '@/components/molecule/auth/structures/formContainer'
import FormContent from '@/components/molecule/auth/structures/formContent'
import Formulary from '@/components/molecule/auth/structures/formulary'
import { useAuth } from '@/context/authContext'
import { ProductosInterface } from '@/interfaces/querys/queryInterface'
import { ProductosBodyInterface } from '@/interfaces/structures/bodyFormInterface'
import { KeyValueInterface } from '@/interfaces/structures/keyValueInterface'
import { UUIDInterface } from '@/interfaces/structures/uuidInterface'
import { ApiFecthAuth } from '@/services/auth/axios/apiFetchAuth'
import { ApiPatchAuth } from '@/services/auth/axios/apiPatchAuth'
import { ApiPostAuth } from '@/services/auth/axios/apiPostAuth'
import endPoints from '@/services/auth/endPoints/endPoint'
import { prefix } from '@/services/envs/envs'
import { CheckForm } from '@/utils/checkForm'
import ResetForm from '@/utils/resetForm'
import ResponseFromCreated from '@/utils/responseFromCreated'
import ResponseFromEdited from '@/utils/responseFromEdited'
import { useEffect, useRef, useState } from 'react'
import type { Editor as TinyMCEEditor } from 'tinymce'

const ProductosMod: React.FC<UUIDInterface> = ({ uuid }) => {
  const { token, enterprise, ready } = useAuth()
  const [submitLoaded, setSubmitLoaded] = useState<boolean>(false)

  const [producto, setProducto] = useState<ProductosInterface | null>(null)
  const [unidades, setUnidades] = useState<KeyValueInterface[]>([])
  const [monedas, setMonedas] = useState<KeyValueInterface[]>([])

  const [dataEditUnidades, setDataEditUnidades] =
    useState<KeyValueInterface | null>(null)

  const [dataEditMonedas, setDataEditMonedas] =
    useState<KeyValueInterface | null>(null)

  const [resetUnidades, setResetUnidades] = useState<boolean>(false)
  const handlerRestartResetUnidades = () => {
    if (resetUnidades) setResetUnidades(false)
  }

  const [resetMonedas, setResetMonedas] = useState<boolean>(false)

  const handlerRestartResetMonedas = () => {
    if (resetMonedas) setResetMonedas(false)
  }

  const [descripcion, setDescripcion] = useState('')

  const nombreProductoRef = useRef<HTMLInputElement>(null)
  const descripcionRef = useRef<TinyMCEEditor | null>(null)
  const unidadRef = useRef<HTMLInputElement>(null)
  const precioUnitarioRef = useRef<HTMLInputElement>(null)
  const precioVentaRef = useRef<HTMLInputElement>(null)
  const gravadoIgvRef = useRef<HTMLInputElement>(null)
  const includeIgvRef = useRef<HTMLInputElement>(null)
  const igvTasaRef = useRef<HTMLInputElement>(null)
  const monedaRef = useRef<HTMLInputElement>(null)
  const estadoRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!uuid && igvTasaRef.current) {
      igvTasaRef.current.value = '18' // Valor por defecto
    }
  }, [uuid])

  // Cargar producto (si es edición)
  useEffect(() => {
    const fetchData = async () => {
      if (!ready || !token || !enterprise) return
      try {
        const data = await getData(uuid ? uuid : '', token)
        const producto = data.props.producto

        if (producto) {
          setProducto(producto)
        }
      } catch (error) {
        ToastNotification('danger', `Ha ocurrido un error - ${error}`)
      }
    }

    if (uuid && token) {
      fetchData()
    }
  }, [uuid, token, ready, enterprise])

  useEffect(() => {
    const fetchMonedas = async () => {
      try {
        if (!token) return
        const res = await ApiFecthAuth(
          endPoints.mainData.money.noPaged,
          token as string
        )
        setMonedas(res?.data || [])
      } catch {
        ToastNotification('danger', 'Error cargando monedas')
      }
    }

    fetchMonedas()
  }, [token])

  useEffect(() => {
    if (!token) return
    const fetchUnidades = async () => {
      try {
        const res = await ApiFecthAuth(
          endPoints.mainData.unidadMedida.noPaged,
          token
        )
        setUnidades(res?.data || [])
      } catch {
        ToastNotification('danger', 'Error cargando unidades')
      }
    }
    fetchUnidades()
  }, [token])

  // Prefill de datos en edición
  useEffect(() => {
    if (producto) {
      if (nombreProductoRef.current) {
        nombreProductoRef.current.value = producto.nombre || ''
      }
      setDescripcion(producto.descripcion || '')
      // if (editorReady && descripcionRef.current) {
      //   descripcionRef.current.setContent(producto.descripcion || '')
      // }

      if (producto.unidad && producto.unidad.key && unidadRef.current) {
        setDataEditUnidades({
          key: producto.unidad.key,
          value: producto.unidad.value
        })
        unidadRef.current.value = producto.unidad.key
      }

      if (producto.moneda && producto.moneda.key && monedaRef.current) {
        setDataEditMonedas({
          key: producto.moneda.key,
          value: producto.moneda.value
        })
        monedaRef.current.value = producto.moneda.key
      }

      if (precioUnitarioRef.current) {
        precioUnitarioRef.current.value =
          producto.precioUnitario?.toString() || ''
      }
      if (precioVentaRef.current) {
        precioVentaRef.current.value = producto.precioVenta?.toString() || '0'
      }
      if (gravadoIgvRef.current) {
        gravadoIgvRef.current.checked = !!producto.gravadoIgv
      }
      if (igvTasaRef.current) {
        igvTasaRef.current.value = producto
          ? producto.igvTasa?.toString() || ''
          : '18'
      }
      if (includeIgvRef.current) {
        includeIgvRef.current.checked = producto.incluyeIgv ? true : false
      }
      if (estadoRef.current) {
        estadoRef.current.checked = producto.estado ? true : false
      }
    }
  }, [producto])

  const formData = {
    nombre: {
      name: 'nombre',
      id: 'nombre',
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
      tinyMceRef: descripcionRef,
      ref: useRef<HTMLTextAreaElement>(null),
      required: true,
      tiny: true,
      type: 'tinyMCE',
      row: 450,
      minLen: 100,
      maxLen: 10000,
      value: descripcion,
      onChange: (content: string) => {
        setDescripcion(content) // ✅ AQUÍ
      }
    },

    unidad: {
      name: 'unidad',
      id: 'unidad',
      showLabel: true,
      label: 'Unidad de Medida',
      ref: unidadRef,
      required: true,
      data: unidades,
      editData: dataEditUnidades,
      resetSignal: resetUnidades,
      resetHandler: handlerRestartResetUnidades,
      tiny: true
    },

    precioUnitario: {
      name: 'precioUnitario',
      id: 'precioUnitario',
      showLabel: true,
      label: 'Precio Compra',
      ref: precioUnitarioRef,
      required: true,
      tiny: true
    },
    precioVenta: {
      name: 'precioVenta',
      id: 'precioVenta',
      showLabel: true,
      label: 'Precio Venta',
      ref: precioVentaRef,
      required: true,
      tiny: true
    },
    incluyeIgv: {
      name: 'incluyeIgv',
      id: 'incluyeIgv',
      showLabel: true,
      label: 'Incluye IGV',
      ref: includeIgvRef,
      required: true,
      type: 'switch',
      value: uuid ? producto?.incluyeIgv : true,
      tiny: true
    },
    gravadoIgv: {
      name: 'gravadoIgv',
      id: 'gravadoIgv',
      showLabel: true,
      label: 'IGV Gravado',
      ref: gravadoIgvRef,
      required: true,
      tiny: true,
      type: 'switch'
    },

    igvTasa: {
      name: 'igvTasa',
      id: 'igvTasa',
      showLabel: true,
      label: 'IGV Tasa (%)',
      ref: igvTasaRef,
      required: true,
      tiny: true
    },

    moneda: {
      name: 'moneda',
      id: 'moneda',
      showLabel: true,
      label: 'Moneda',
      ref: monedaRef,
      required: true,
      data: monedas,
      editData: dataEditMonedas,
      resetSignal: resetMonedas,
      resetHandler: handlerRestartResetMonedas,
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
      value: uuid ? producto?.estado : true,
      tiny: true
    },

    submit: {
      name: 'submit',
      id: 'submit',
      label: 'submit',
      showLabel: false,
      type: 'submit',
      buttonName: `${uuid ? 'Guardar' : 'Registrar'}`,
      disabled: submitLoaded,
      loaded: submitLoaded,
      tiny: true
    }
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const fields = [
      {
        ref: nombreProductoRef,
        message: 'Debe ingresar el nombre del producto'
      },
      {
        ref: descripcionRef,
        message: 'Debe ingresar la descripcion del producto'
      },
      {
        ref: monedaRef,
        message: 'Debe seleccionar una moneda'
      },
      {
        ref: unidadRef,
        message: 'Debe seleccionar una unidad de medida'
      },
      {
        ref: precioUnitarioRef,
        message: 'Debe ingresar el precio de compra'
      },
      { ref: precioVentaRef, message: 'Debe ingresar el precio de venta' },
      { ref: igvTasaRef, message: 'Debe ingresar la tasa de IGV' }
    ]

    const resetFields = [
      {
        refs: [
          nombreProductoRef,
          descripcionRef,
          monedaRef,
          unidadRef,
          precioUnitarioRef,
          precioVentaRef,
          gravadoIgvRef,
          igvTasaRef
        ],
        resetValues: []
      }
    ]

    const resetAllFields = ResetForm({ resetFields })

    const handlerResetfield = () => {
      resetAllFields()
      setResetUnidades(true)
      setResetMonedas(true)
      if (estadoRef.current) estadoRef.current.checked = true
    }

    if (CheckForm(fields)) {
      if (precioUnitarioRef.current && precioVentaRef.current) {
        if (precioUnitarioRef.current.value > precioVentaRef.current?.value) {
          ToastNotification(
            'warning',
            'El precio de venta no puede ser menor al precio de compra'
          )
          return
        }
      }

      const body: ProductosBodyInterface = {
        nombre: nombreProductoRef.current?.value || '',
        descripcion: descripcion,
        unidad: unidadRef.current ? unidadRef.current.value : '',
        precio_unitario: precioUnitarioRef.current
          ? parseFloat(precioUnitarioRef.current.value)
          : 0,
        precio_venta: precioVentaRef.current
          ? parseFloat(precioVentaRef.current.value)
          : 0,
        incluye_igv: includeIgvRef.current?.checked || false,
        gravado_igv: gravadoIgvRef.current?.checked || false,
        igv_tasa: igvTasaRef.current ? parseInt(igvTasaRef.current.value) : 0,
        moneda: monedaRef.current ? monedaRef.current.value : '',
        estado: estadoRef.current?.checked || false
      }

      setSubmitLoaded(true)
      const endPoint = uuid
        ? endPoints.productos.patch(uuid)
        : endPoints.productos.create

      if (uuid) {
        const response = await ApiPatchAuth(endPoint, token || '', body)
        ResponseFromEdited({
          response,
          returnSuccess: `/generales/productos?t=s&m=edit`
        })
      } else {
        const response = await ApiPostAuth(endPoint, token || '', body)
        ResponseFromCreated({
          response,
          successMessage: 'Producto registrado SATISFACTORIAMENTE.',
          handlerResetfield
        })
      }

      setSubmitLoaded(false)
    }
  }

  return (
    <PageContainer>
      <PageTitle
        description={`${uuid ? 'Editar producto' : ' Registrar Producto'}`}
      />
      <GoBack enlace={`${prefix}/generales/productos/`} />
      <PageContent>
        <Formulary onSubmit={onSubmit}>
          <FormContainer>
            <FormContent className='w-full'>
              <Input data={formData.nombre} />
            </FormContent>
            <FormContent className='w-full'>
              <TextArea data={formData.descripcion} />
            </FormContent>
            <FormContent className='w-full xl:w-2/12'>
              <Select data={formData.moneda} />
            </FormContent>
            <FormContent className='w-full xl:w-2/12'>
              <Select data={formData.unidad} />
            </FormContent>
            <FormContent className='w-full xl:w-2/12'>
              <Input data={formData.precioUnitario} />
            </FormContent>
            <FormContent className='w-full xl:w-2/12'>
              <Input data={formData.precioVenta} />
            </FormContent>
            <FormContent className='w-full xl:w-auto xl:pt-5'>
              <Input data={formData.incluyeIgv} />
            </FormContent>
            <FormContent className='w-full xl:w-1/12'>
              <Input data={formData.igvTasa} />
            </FormContent>
            <FormContent className='w-full xl:w-auto xl:pt-5'>
              <Input data={formData.gravadoIgv} />
            </FormContent>
            <FormContent className='w-full xl:w-auto xl:pt-5'>
              <Input data={formData.estado} />
            </FormContent>
            <FormContent
              className='w-full '
              classNameInter='flex flex-row justify-center items-center'
            >
              <div className='w-full xl:w-1/3 pt-5'>
                <Button data={formData.submit} />
              </div>
            </FormContent>
          </FormContainer>
        </Formulary>
      </PageContent>
    </PageContainer>
  )
}
export default ProductosMod

async function getData(uuid: string | undefined, token: string | null) {
  if (token) {
    const producto =
      uuid && uuid.length > 0
        ? await ApiFecthAuth(
            endPoints.productos.retrieve(uuid, 'original'),
            token
          )
        : null

    return {
      props: { producto: producto ? producto.data : null },
      revalidate: 3600
    }
  } else {
    return {
      props: { producto: null },
      revalidate: 3600
    }
  }
}
