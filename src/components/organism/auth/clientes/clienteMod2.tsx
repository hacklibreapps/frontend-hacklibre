'use client'

import PageTitle from '@/components/atom/auth/structures/pageTitlte'
import GoBack from '@/components/atom/goback'
import { Button } from '@/components/atom/structures/button'
import PageContainer from '@/components/atom/structures/containers/pageContainer'
import PageContent from '@/components/atom/structures/containers/pageContent'
import Input from '@/components/atom/structures/input'
import { ToastNotification } from '@/components/atom/structures/toast'
import FormContainer from '@/components/molecule/auth/structures/formContainer'
import FormContent from '@/components/molecule/auth/structures/formContent'
import Formulary from '@/components/molecule/auth/structures/formulary'
import { useAuth } from '@/context/authContext'
import {
  ClienteRetrieveInterface,
  ContactInterface,
  ContactTempInterface
} from '@/interfaces/querys/queryInterface'
import { ClientesBodyInterface } from '@/interfaces/structures/bodyFormInterface'
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
import { validateImage } from '@/utils/validateImage'
import { useEffect, useRef, useState } from 'react'
import ContactsTable from '@/components/atom/auth/clientes/contactsTable'

import {
  emptyTempContact,
  isPersistedContact,
  isValidUuid,
  type ContactRow
} from '@/app/helpers/clientes/clientesGuards'

import {
  logReq,
  logRes,
  logErr,
  type HttpMethod,
  isTraceEnabled
} from '@/app/helpers/clientes/clientesTrace'

// Payload que acepta el subrecurso de contactos (camelCase)
type ContactCreatePayload = {
  firstName: string
  lastName: string
  email: string
  principal: boolean
}

// Respuesta mínima del create cliente (para obtener uuid)
type CreateClientApiData = {
  uuid?: string
  id?: string
}

const ClientesMod: React.FC<UUIDInterface> = ({ uuid }) => {
  const { token, enterprise, ready } = useAuth()
  const [submitLoaded, setSubmitLoaded] = useState(false)
  const [cliente, setCliente] = useState<ClienteRetrieveInterface | null>(null)

  // refs del formulario cliente
  const companyNameRef = useRef<HTMLInputElement>(null)
  const razonSocialRef = useRef<HTMLInputElement>(null)
  const rucRef = useRef<HTMLInputElement>(null)
  const clientLogoRef = useRef<HTMLInputElement>(null)
  const highlighterRef = useRef<HTMLInputElement>(null)
  const legalImageRef = useRef<HTMLInputElement>(null)
  const legalFullNameRef = useRef<HTMLInputElement>(null)
  const legalTitleRef = useRef<HTMLInputElement>(null)
  const orderRef = useRef<HTMLInputElement>(null)
  const estadoRef = useRef<HTMLInputElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)
  const addressRef = useRef<HTMLInputElement>(null)

  const isEditing = isValidUuid(uuid)

  // == CONTACTOS ==
  // En NUEVO se guardan temporalmente aquí:
  const [tempContacts, setTempContacts] = useState<ContactTempInterface[]>([])
  // En EDITAR se cargan desde el backend aquí:
  const [contacts, setContacts] = useState<ContactInterface[]>([])

  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [editDraft, setEditDraft] =
    useState<ContactTempInterface>(emptyTempContact)
  const [creatorDraft, setCreatorDraft] =
    useState<ContactTempInterface>(emptyTempContact)

  // mostrar/ocultar la fila creadora también en EDICIÓN
  const [showCreatorRow, setShowCreatorRow] = useState(false)

  // CARGA INICIAL DESDE BACK
  useEffect(() => {
    const fetchData = async () => {
      if (!ready || !token || !enterprise) return // ⬅️ evita disparar sin header
      try {
        const data = await getData(uuid, token)
        console.log(data)
        if (isEditing) setCliente(data.props.cliente) // ← aquí se RECIBE el cliente del backend (detalle)
      } catch (error) {
        ToastNotification('danger', `Ha ocurrido un error - ${error}`)
      }
    }
    fetchData()
  }, [uuid, token, isEditing, ready, enterprise])

  // setear form + contactos al llegar cliente (EDICIÓN)
  useEffect(() => {
    if (!cliente) return
    if (companyNameRef.current)
      companyNameRef.current.value = cliente.companyName || ''
    if (razonSocialRef.current)
      razonSocialRef.current.value = cliente.completeCompanyName || ''
    if (rucRef.current) rucRef.current.value = cliente.ruc || ''
    if (legalFullNameRef.current)
      legalFullNameRef.current.value = cliente.legalFullName || ''
    if (legalTitleRef.current)
      legalTitleRef.current.value = cliente.legalTitle || ''
    if (orderRef.current)
      orderRef.current.value = cliente.order?.toString?.() || '0'
    if (emailRef.current) emailRef.current.value = cliente.email || ''
    if (addressRef.current) addressRef.current.value = cliente.address || ''
    if (estadoRef.current) estadoRef.current.checked = !!cliente.status

    // ====== AQUÍ SE RECIBEN DEL BACK los contactos y se guardan localmente para EDICIÓN
    if (isTraceEnabled()) {
      console.log('[CONTACTS/LOAD] cantidad:', (cliente.contacts || []).length)
      console.log(
        '[CONTACTS/LOAD] sample:',
        (cliente.contacts || [])[0] ?? null
      )
    }
    setContacts(cliente.contacts || [])
  }, [cliente])

  // config inputs
  const formData = {
    companyName: {
      name: 'companyName',
      id: 'companyName',
      showLabel: true,
      label: 'Nombre Empresa',
      ref: companyNameRef,
      required: false,
      tiny: true
    },
    razon_social: {
      name: 'razon_social',
      id: 'razon_social',
      showLabel: true,
      label: 'Razón Social',
      ref: razonSocialRef,
      required: true,
      tiny: true
    },
    ruc: {
      name: 'ruc',
      id: 'ruc',
      showLabel: true,
      label: 'RUC',
      ref: rucRef,
      required: true,
      tiny: true
    },
    clientLogo: {
      name: 'client_logo',
      id: 'client_logo',
      showLabel: true,
      label: 'Logo',
      ref: clientLogoRef,
      type: 'file',
      required: false,
      value: isEditing ? cliente?.clientLogo : undefined,
      tiny: true
    },
    highlighter: {
      name: 'highlighter',
      id: 'highlighter',
      showLabel: true,
      label: 'Destacado',
      ref: highlighterRef,
      type: 'switch',
      value: false,
      tiny: true
    },
    legalFullName: {
      name: 'legal_full_name',
      id: 'legal_full_name',
      showLabel: true,
      label: 'Nombre Representante Legal',
      ref: legalFullNameRef,
      required: false,
      tiny: true
    },
    legalTitle: {
      name: 'legal_title',
      id: 'legal_title',
      showLabel: true,
      label: 'Cargo Legal',
      ref: legalTitleRef,
      required: false,
      tiny: true
    },
    legalImage: {
      name: 'legal_image',
      id: 'legal_image',
      showLabel: true,
      label: 'Imagen Legal',
      ref: legalImageRef,
      type: 'file',
      required: false,
      value: isEditing ? cliente?.legalImage : undefined,
      tiny: true
    },
    email: {
      name: 'email',
      id: 'email',
      showLabel: true,
      label: 'Correo',
      ref: emailRef,
      required: false,
      tiny: true
    },
    address: {
      name: 'direccion',
      id: 'direccion',
      showLabel: true,
      label: 'Dirección',
      ref: addressRef,
      required: false,
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
      value: isEditing ? !!cliente?.status : true,
      tiny: true
    },
    submit: {
      name: 'submit',
      id: 'submit',
      label: 'submit',
      showLabel: false,
      type: 'submit',
      buttonName: `${isEditing ? 'Guardar' : 'Registrar'}`,
      disabled: submitLoaded ? true : false,
      tiny: true
    }
  }

  // SUBMIT DEL CLIENTE (crear / editar)
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const fields = [
      { ref: razonSocialRef, message: 'Debe ingresar la razón social' },
      { ref: rucRef, message: 'Debe ingresar el RUC' },
      { ref: emailRef, message: 'Debe ingresar el correo principal' }
    ]

    const resetFields = [
      {
        refs: [
          companyNameRef,
          razonSocialRef,
          rucRef,
          clientLogoRef,
          highlighterRef, // false (switch)
          legalFullNameRef,
          legalTitleRef,
          orderRef, // '0'
          estadoRef, // true (switch)
          emailRef,
          addressRef
        ],
        resetValues: ['', '', '', '', false, '', '', '0', true, '', '']
      }
    ]

    const resetAllFields = ResetForm({ resetFields })
    const handlerResetfield = () => {
      resetAllFields()

      setTempContacts([])
      setCreatorDraft(emptyTempContact)
      setEditDraft(emptyTempContact)
      setShowCreatorRow(false)

      // ====== AQUÍ LIMPIAMOS CONTACTOS TEMPORALES (NUEVO)
      setTempContacts([])
      if (isTraceEnabled())
        console.log('[CONTACTS/TEMP] limpiados tras crear cliente')
    }

    if (!CheckForm(fields)) return

    // base del body (modelo interno)
    // NUEVO: contactos viven temporalmente en `tempContacts` y NO se envían aquí.
    // EDITAR: tampoco se envían aquí (se gestionan por subrecurso).
    const body: ClientesBodyInterface = {
      company_name: companyNameRef.current ? companyNameRef.current.value : '',
      complete_company_name: razonSocialRef.current
        ? razonSocialRef.current.value
        : '',
      ruc: rucRef.current ? rucRef.current.value : '',
      highlighter: highlighterRef.current
        ? !!highlighterRef.current.checked
        : false,
      legal_full_name: legalFullNameRef.current
        ? legalFullNameRef.current.value
        : '',
      legal_title: legalTitleRef.current ? legalTitleRef.current.value : '',
      order: orderRef.current?.value ? Number(orderRef.current.value) : 0,
      contacts: [], // ← se deja vacío para no mezclar con el create; se envían luego por subrecurso
      email: emailRef.current ? emailRef.current.value : '',
      address: addressRef.current ? addressRef.current.value : '',

      status: estadoRef.current ? !!estadoRef.current.checked : false
    }
    console.log(body)

    // archivos opcionales
    if (clientLogoRef.current?.files?.length) {
      const file = clientLogoRef.current.files[0]
      if (!validateImage(file)) {
        ToastNotification('warning', 'La imagen debe tener formato válido')
        return
      }
      body.client_logo = file
    }
    if (
      legalImageRef.current &&
      (legalImageRef.current as HTMLInputElement).files?.length
    ) {
      const file = (legalImageRef.current as HTMLInputElement).files![0]
      if (!validateImage(file)) {
        ToastNotification('warning', 'La imagen debe tener formato válido')
        return
      }
      body.legal_image = file
    }

    // payload con nomenclatura esperada por el backend (cliente)
    const wirePayload: Record<string, unknown> = {
      company_name: body.company_name,
      complete_company_name: body.complete_company_name,
      ruc: body.ruc,
      highlighter: body.highlighter,
      legal_full_name: body.legal_full_name,
      legal_title: body.legal_title,
      order: body.order,
      email: body.email,
      status: body.status,
      address: body.address
      // IMPORTANTE: NO enviar "contacts" aquí; los creamos en el subrecurso tras obtener el uuid
    }
    if (body.client_logo) wirePayload.client_logo = body.client_logo
    if (body.legal_image) wirePayload.legal_image = body.legal_image

    // decidir JSON vs multipart/form-data si hay archivos
    const isMultipart = !!(body.client_logo || body.legal_image)

    let payloadToSend: FormData | Record<string, unknown> = wirePayload
    let contentType: 'application/json' | 'multipart/form-data' =
      'application/json'

    if (isMultipart) {
      const fd = new FormData()
      Object.entries(wirePayload).forEach(([k, v]) => {
        if (v == null) return
        if (v instanceof File) fd.append(k, v)
        else fd.append(k, String(v))
      })
      payloadToSend = fd
      contentType = 'multipart/form-data'
    }

    setSubmitLoaded(true)

    const endPoint = isEditing
      ? `${endPoints.clients.patch(uuid!)}`
      : endPoints.clients.create

    const method: HttpMethod = isEditing ? 'PATCH' : 'POST'
    logReq(method, endPoint, payloadToSend, { isMultipart })

    if (isEditing) {
      // ====== EDITAR CLIENTE (sin contactos aquí)
      const response = await ApiPatchAuth(
        endPoint,
        token ?? '',
        payloadToSend,
        undefined,
        contentType
      )
      logRes('PATCH', endPoint, response.status, response.data)
      ResponseFromEdited({ response, returnSuccess: '/clientes/?t=s&m=edit' })
    } else {
      // ====== CREAR CLIENTE
      const response = await ApiPostAuth(
        endPoint,
        token ?? '',
        payloadToSend,
        undefined,
        contentType
      )
      logRes(
        'POST',
        endPoint,
        (response as { status: number }).status,
        (response as { data?: unknown }).data
      )

      // ====== TRAS CREAR: crear contactos del cliente en el SUBRECURSO (camelCase)
      try {
        // const apiStatus = (response as { status: number }).status
        // const apiData = (response as { data?: unknown }).data as
        //   | CreateClientApiData
        //   | undefined

        const apiStatus = response.status
        const apiData = response.data as CreateClientApiData

        if (apiStatus >= 200 && apiStatus < 300) {
          const newClientUuid = apiData?.uuid || apiData?.id

          // console.log('[CLIENT/CREATED] uuid:', newClientUuid)
          // console.log('[CONTACTS/TEMP] a enviar:', tempContacts.length)

          console.log('UUID RECIBIDO:', newClientUuid)
          console.log('CONTACTOS TEMP:', tempContacts)

          if (newClientUuid && tempContacts.length > 0) {
            const tasks = tempContacts.map((c, i) => {
              const payload: ContactCreatePayload = {
                firstName: c.firstName.trim(),
                lastName: c.lastName.trim(),
                email: c.email.trim(),
                principal: !!c.principal
              }

              const url = endPoints.clients.contacts.create(newClientUuid)

              logReq('POST', url, payload, { idx: i })

              return ApiPostAuth(
                url,
                token ?? '',
                payload,
                undefined,
                'application/json'
              )
            })
            await Promise.all(tasks)
          }
        }
      } catch (e) {
        logErr(
          'POST',
          endPoint,
          (response as { status: number }).status,
          e as unknown
        )
        ToastNotification(
          'warning',
          'Cliente creado. Algunos contactos no pudieron registrarse.'
        )
      }

      // feedback + reset
      ResponseFromCreated({
        response,
        successMessage: 'Cliente registrado SATISFACTORIAMENTE.',
        handlerResetfield
      })
    }

    setSubmitLoaded(false)
  }

  // =====================
  // EDICIÓN INLINE (UI) / Entrar a modo edición (carga el draft):
  // =====================
  const startEdit = (c: ContactRow, idx: number) => {
    setEditingIndex(idx)
    setEditDraft({
      firstName: c.firstName,
      lastName: c.lastName,
      email: c.email,
      principal: !!c.principal
    })
  }

  const cancelEdit = () => {
    setEditingIndex(null)
    setEditDraft(emptyTempContact)
  }

  // Guardar cambios de una fila de contacto:
  // - Editar (persistido): se MANDA al BACK via PATCH del subrecurso
  // - Nuevo (temporal): solo se guarda en memoria `tempContacts`
  const saveEdit = async (c: ContactRow, idx: number) => {
    try {
      if (isEditing && isPersistedContact(c)) {
        const url = endPoints.clients.contacts.update(uuid!, c.uuid)

        const payload = {
          firstName: editDraft.firstName,
          lastName: editDraft.lastName,
          email: editDraft.email,
          principal: !!editDraft.principal
        }
        logReq('PATCH', url, payload)
        const r = await ApiPatchAuth(
          url,
          token ?? '',
          payload,
          undefined,
          'application/json'
        )
        logRes('PATCH', url, r.status, r.data)

        // actualizar en memoria local de edición
        setContacts((prev) =>
          prev.map((x, i) =>
            i === idx
              ? {
                  ...x,
                  firstName: payload.firstName,
                  lastName: payload.lastName,
                  email: payload.email,
                  principal: payload.principal
                }
              : x
          )
        )
      } else {
        // actualizar contacto temporal (Nuevo)
        setTempContacts((prev) =>
          prev.map((x, i) =>
            i === idx
              ? {
                  firstName: editDraft.firstName,
                  lastName: editDraft.lastName,
                  email: editDraft.email,
                  principal: !!editDraft.principal
                }
              : x
          )
        )
        if (isTraceEnabled()) console.log('[CONTACTS/TEMP] editado idx:', idx)
      }
      ToastNotification('success', 'Contacto actualizado')
      cancelEdit()
    } catch (e) {
      console.error('[CLIENTS-MOD] saveEdit error:', e)
      ToastNotification('danger', 'No se pudo actualizar el contacto')
    }
  }

  // Toggle estado de un contacto persistido (EDITAR) // “habilita/deshabilita” (activar/desactivar) un contacto
  const handleToggleContactStatus = async (
    c: ContactInterface,
    idx: number
  ) => {
    try {
      if (isEditing) {
        const url = c.status
          ? endPoints.clients.contacts.deactivate(uuid!, c.uuid)
          : endPoints.clients.contacts.activate(uuid!, c.uuid)

        const r = await ApiPostAuth(
          url,
          token ?? '',
          {},
          undefined,
          'application/json'
        )

        // const url = endPoints.clients.contacts.update(uuid!, c.uuid)
        // logReq('PATCH', url, { status: !c.status })

        // const r = await ApiPatchAuth(
        //   url,
        //   token ?? '',
        //   { status: !c.status },
        //   undefined,
        //   'application/json'
        // )

        // logRes('PATCH', url, r.status, r.data)
        logRes('POST', url, r.status, r.data)

        setContacts((prev) =>
          prev.map((x, i) => (i === idx ? { ...x, status: !x.status } : x))
        )
        ToastNotification(
          'success',
          c.status ? 'Contacto desactivado' : 'Contacto activado'
        )
      }
    } catch (e) {
      console.error('[CLIENTS-MOD] toggle status error:', e)
      ToastNotification('danger', 'No se pudo cambiar el estado')
    }
  }

  // Agregar contacto en EDICIÓN (persistido): POST al subrecurso (camelCase)
  const handleAddPersistedContact = async () => {
    if (
      !creatorDraft.firstName.trim() ||
      !creatorDraft.lastName.trim() ||
      !creatorDraft.email.trim()
    ) {
      ToastNotification('warning', 'Completa Nombres, Apellidos y Email')
      return
    }

    if (contacts.some((c) => c.email === creatorDraft.email.trim())) {
      ToastNotification('warning', 'Ya existe un contacto con ese email')
      return
    }

    const payload: ContactCreatePayload = {
      firstName: creatorDraft.firstName.trim(),
      lastName: creatorDraft.lastName.trim(),
      email: creatorDraft.email.trim(),
      principal: !!creatorDraft.principal
    }

    try {
      const url = endPoints.clients.contacts.create(uuid!)
      logReq('POST', url, payload)
      const resp = await ApiPostAuth(
        url,
        token ?? '',
        payload,
        undefined,
        'application/json'
      )
      logRes(
        'POST',
        url,
        (resp as { status: number }).status,
        (resp as { data?: unknown }).data
      )

      if (
        (resp as { status: number }).status >= 200 &&
        (resp as { status: number }).status < 300
      ) {
        // El back devuelve el contacto creado o no; si no, tomamos el draft
        const createdData = (resp as { data?: unknown }).data as
          | Partial<ContactInterface>
          | undefined
        const newContact: ContactInterface = {
          uuid:
            createdData?.uuid ??
            (typeof crypto !== 'undefined' &&
            typeof crypto.randomUUID === 'function'
              ? crypto.randomUUID()
              : `tmp-${Date.now()}`),
          firstName: createdData?.firstName ?? creatorDraft.firstName,
          lastName: createdData?.lastName ?? creatorDraft.lastName,
          fullName:
            createdData?.fullName ??
            `${createdData?.firstName ?? creatorDraft.firstName} ${
              createdData?.lastName ?? creatorDraft.lastName
            }`.trim(),
          email: createdData?.email ?? creatorDraft.email,
          principal: createdData?.principal ?? creatorDraft.principal,
          status:
            typeof createdData?.status === 'boolean' ? createdData.status : true
        }

        setContacts((prev) => [newContact, ...prev])
        setCreatorDraft(emptyTempContact)
        setShowCreatorRow(false)
        ToastNotification('success', 'Contacto agregado')
      } else {
        ToastNotification('danger', 'No se pudo agregar el contacto')
      }
    } catch (e) {
      console.error('[CLIENTS-MOD] add contact error:', e)
      ToastNotification('danger', 'No se pudo agregar el contacto')
    }
  }

  // Agregar contacto en NUEVO (temporal): aún NO se manda al back
  const handleAddTempContact = () => {
    if (
      !creatorDraft.firstName.trim() ||
      !creatorDraft.lastName.trim() ||
      !creatorDraft.email.trim()
    ) {
      ToastNotification('warning', 'Completa Nombres, Apellidos y Email')
      return
    }

    const newRow: ContactTempInterface = {
      firstName: creatorDraft.firstName.trim(),
      lastName: creatorDraft.lastName.trim(),
      email: creatorDraft.email.trim(),
      principal: !!creatorDraft.principal
    }

    // ====== AQUÍ SE GUARDA TEMPORALMENTE (NUEVO)
    setTempContacts((prev) => [newRow, ...prev])
    setCreatorDraft(emptyTempContact)
    if (isTraceEnabled()) {
      console.log('[CONTACTS/TEMP] agregado:', newRow)
      console.log('[CONTACTS/TEMP] total:', tempContacts.length + 1)
    }
    ToastNotification('success', 'Contacto agregado (temporal)')
  }

  // filas a renderizar
  const rows: ContactRow[] = (
    isEditing ? contacts : tempContacts
  ) as ContactRow[]

  return (
    <PageContainer>
      <PageTitle description={isEditing ? 'Editar cliente' : 'Nuevo cliente'} />
      <GoBack enlace={`${prefix}/clientes/`} />
      <PageContent>
        <Formulary onSubmit={onSubmit}>
          <FormContainer>
            <FormContent className='w-full xl:w-3/12'>
              <Input data={formData.razon_social} />
            </FormContent>
            <FormContent className='w-full xl:w-3/12'>
              <Input data={formData.companyName} />
            </FormContent>
            <FormContent className='w-full xl:w-3/12'>
              <Input data={formData.clientLogo} />
            </FormContent>
            <FormContent className='w-full xl:w-1/12'>
              <Input data={formData.ruc} />
            </FormContent>
            <FormContent className='w-full xl:w-1/12 pt-5'>
              <Input data={formData.highlighter} />
            </FormContent>
            <FormContent className='w-full xl:w-3/12'>
              <Input data={formData.email} />
            </FormContent>
          </FormContainer>
          <FormContainer>
            <FormContent className='w-full xl:w-4/12'>
              <Input data={formData.legalFullName} />
            </FormContent>
            <FormContent className='w-full xl:w-4/12'>
              <Input data={formData.legalTitle} />
            </FormContent>{' '}
            <FormContent className='w-full xl:w-4/12'>
              <Input data={formData.legalImage} />
            </FormContent>
            <FormContent className='w-full '>
              <Input data={formData.address} />
            </FormContent>
            <FormContent className='w-full xl:w-3/12 xl:pt-6'>
              <Input data={formData.estado} />
            </FormContent>
            <FormContent className='w-full'>
              <ContactsTable
                isEditing={isEditing}
                showCreatorRow={showCreatorRow}
                setShowCreatorRow={setShowCreatorRow}
                rows={rows}
                creatorDraft={creatorDraft}
                setCreatorDraft={setCreatorDraft}
                editDraft={editDraft}
                setEditDraft={setEditDraft}
                editingIndex={editingIndex}
                onStartEdit={startEdit}
                onCancelEdit={cancelEdit}
                onSaveEdit={saveEdit}
                onAddTempContact={handleAddTempContact}
                onAddPersistedContact={handleAddPersistedContact}
                onToggleContactStatus={handleToggleContactStatus}
              />
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

export default ClientesMod

// ---- getData (igual, con trazas)
async function getData(uuid: string | undefined, token: string | null) {
  if (token) {
    const url = uuid && uuid.length > 0 ? endPoints.clients.retrieve(uuid) : ''
    if (uuid) logReq('GET', url)

    const cliente =
      uuid && uuid.length > 0 ? await ApiFecthAuth(url, token) : null

    //cliente.status por 201
    if (uuid && cliente) logRes('GET', url, 200, cliente.data)

    return {
      props: {
        // AQUÍ SE RECIBE DEL BACK el detalle del cliente (incluye contacts)
        cliente: cliente ? (cliente.data as ClienteRetrieveInterface) : null
      },
      revalidate: 3600
    }
  }
  return { props: { cliente: null }, revalidate: 3600 }
}
