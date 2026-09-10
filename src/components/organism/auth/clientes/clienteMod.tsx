'use client'
import PageTitle from '@/components/atom/auth/structures/pageTitlte'
import GoBack from '@/components/atom/goback'
import PageContainer from '@/components/atom/structures/containers/pageContainer'
import FormContainer from '@/components/molecule/auth/structures/formContainer'
import FormContent from '@/components/molecule/auth/structures/formContent'
import Formulary from '@/components/molecule/auth/structures/formulary'
import Input from '@/components/atom/structures/input'
import { Button } from '@/components/atom/structures/button'
import { useAuth } from '@/context/authContext'
import {
  ContactInterface,
  ClienteRetrieveInterface
} from '@/interfaces/querys/queryInterface'
import { UUIDInterface } from '@/interfaces/structures/uuidInterface'
import { prefix } from '@/services/envs/envs'
import { useEffect, useRef, useState } from 'react'
import PageContent from '@/components/atom/structures/containers/pageContent'
import endPoints from '@/services/auth/endPoints/endPoint'
import { ApiFecthAuth } from '@/services/auth/axios/apiFetchAuth'
import { ToastNotification } from '@/components/atom/structures/toast'
import { Table } from '@/components/atom/structures/table'
import TableHeader from '@/components/atom/auth/structures/tableHeader'
import TableRowHeader from '@/components/molecule/auth/structures/tableRowHeader'
import TableColHeader from '@/components/atom/auth/structures/tableCol'
import TableRow from '@/components/atom/auth/structures/tableRow'
import TableColBody from '@/components/atom/auth/structures/tableColBody'
import { LuUserPlus } from 'react-icons/lu'
import {
  RiEditLine,
  RiDeleteBin7Line
  //   RiEye2Line,
  //   ,
  //   RiToggleLine
} from 'react-icons/ri'
import React from 'react'

const ClientesMod: React.FC<UUIDInterface> = ({ uuid }) => {
  const isEditing = uuid && uuid?.length > 0 ? true : false

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

  const { token, enterprise, ready } = useAuth()
  const [submitLoaded, setSubmitLoaded] = useState(false)
  const [cliente, setCliente] = useState<ClienteRetrieveInterface | null>(null)
  const [currentContacts, setCurrentContacts] = useState<ContactInterface[]>([])
  const [showContactForm, setShowContactForm] = useState(false)
  const [editingContactUuid, setEditingContactUuid] = useState<string | null>(
    null
  )

  const [currentContact, setCurrentContact] = useState<ContactInterface>({
    uuid: '',
    firstName: '',
    lastName: '',
    fullName: '',
    email: '',
    principal: false,
    status: true
  })

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
      label: 'Correo Corporativo',
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
    order: {
      name: 'order',
      id: 'order',
      showLabel: true,
      label: 'Orden destacado',
      ref: orderRef,
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

  const resetContactForm = () => {
    setCurrentContact({
      uuid: '',
      firstName: '',
      lastName: '',
      fullName: '',
      email: '',
      principal: false,
      status: true
    })

    setEditingContactUuid(null)
    setShowContactForm(false)
  }

  const handleNewContact = () => {
    setCurrentContact({
      uuid: '',
      firstName: '',
      lastName: '',
      fullName: '',
      email: '',
      principal: false,
      status: true
    })

    setEditingContactUuid(null)
    setShowContactForm(true)
  }

  const handleEditContact = (contact: ContactInterface) => {
    setCurrentContact({ ...contact })
    setEditingContactUuid(contact.uuid)
    setShowContactForm(true)
  }

  const handleSaveContact = () => {
    const firstName = currentContact.firstName.trim()
    const lastName = currentContact.lastName.trim()
    const email = currentContact.email.trim()

    if (!firstName || !lastName || !email) {
      ToastNotification(
        'warning',
        'Los nombres, apellidos y correo son obligatorios'
      )
      return
    }

    const contactToSave: ContactInterface = {
      ...currentContact,
      firstName,
      lastName,
      email,
      fullName: `${firstName} ${lastName}`.trim()
    }

    setCurrentContacts((previousContacts) => {
      /*
       * Si el contacto se marca como principal,
       * se desmarcan los demás contactos.
       */
      const normalizedContacts = contactToSave.principal
        ? previousContacts.map((contact) => ({
            ...contact,
            principal: false
          }))
        : previousContacts

      // UPDATE
      if (editingContactUuid) {
        return normalizedContacts.map((contact) =>
          contact.uuid === editingContactUuid
            ? {
                ...contactToSave,
                uuid: contact.uuid
              }
            : contact
        )
      }

      // CREATE
      return [
        ...normalizedContacts,
        {
          ...contactToSave,
          uuid: `temp-${crypto.randomUUID()}`
        }
      ]
    })

    resetContactForm()
  }

  const handleDeleteContact = (contactUuid: string) => {
    const confirmed = window.confirm('¿Estás seguro de eliminar este contacto?')

    if (!confirmed) return

    setCurrentContacts((previousContacts) =>
      previousContacts.filter((contact) => contact.uuid !== contactUuid)
    )

    if (editingContactUuid === contactUuid) {
      resetContactForm()
    }
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitLoaded(true)
    setSubmitLoaded(false)
  }

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
    if (currentContacts.length === 0 && cliente.contacts) {
      setCurrentContacts(cliente.contacts)
    }
    // ====== AQUÍ SE RECIBEN DEL BACK los contactos y se guardan localmente para EDICIÓN
    //   if (isTraceEnabled()) {
    //     console.log('[CONTACTS/LOAD] cantidad:', (cliente.contacts || []).length)
    //     console.log(
    //       '[CONTACTS/LOAD] sample:',
    //       (cliente.contacts || [])[0] ?? null
    //     )
    //   }
    //   setContacts(cliente.contacts || [])
  }, [cliente, currentContacts.length])
  useEffect(() => {
    console.log('current', currentContacts)
  }, [currentContacts])

  return (
    <PageContainer>
      <PageTitle description={isEditing ? 'Editar cliente' : 'Nuevo cliente'} />
      <GoBack enlace={`${prefix}/clientes/`} />
      <PageContent>
        <Formulary onSubmit={onSubmit}>
          <FormContainer>
            <FormContent className='w-full xl:w-2/12'>
              <Input data={formData.razon_social} />
            </FormContent>
            <FormContent className='w-full xl:w-2/12'>
              <Input data={formData.companyName} />
            </FormContent>
            <FormContent className='w-full xl:w-3/12'>
              <Input data={formData.clientLogo} />
            </FormContent>
            <FormContent className='w-full xl:w-1/12'>
              <Input data={formData.ruc} />
            </FormContent>
            <FormContent className='w-full xl:w-2/12 pt-5'>
              <Input data={formData.highlighter} />
            </FormContent>
            <FormContent className='w-full xl:w-2/12'>
              <Input data={formData.order} />
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
            <Table>
              <TableHeader>
                <TableRowHeader>
                  <TableColHeader>Nombres</TableColHeader>
                  <TableColHeader>Apellidos</TableColHeader>
                  <TableColHeader>Email</TableColHeader>
                  <TableColHeader>Principal</TableColHeader>
                  <TableColHeader>Estado</TableColHeader>

                  <TableColHeader className=''>
                    <div className='flex flex-row justify-center items-center'>
                      Acciones
                      <span
                        className='ml-2 text-white text-xl cursor-pointer'
                        onClick={handleNewContact}
                        data-tooltip-id='tooltip'
                        data-tooltip-place='right'
                        data-tooltip-content='Nuevo contacto'
                      >
                        <LuUserPlus />
                      </span>
                    </div>
                  </TableColHeader>
                </TableRowHeader>
              </TableHeader>
              {showContactForm && (
                <TableRow className='border-b border-slate-200 bg-slate-50'>
                  <TableColBody className='px-2 py-2'>
                    <Input
                      data={{
                        placeHolder: 'Nombres completos ',
                        onChange2: (event) =>
                          setCurrentContact((previous) => ({
                            ...previous,
                            firstName: event.target.value
                          })),
                        name: 'nombres',
                        id: 'nombres',
                        label: 'Nombres',
                        showLabel: false,
                        ref: React.createRef<HTMLInputElement>(),
                        value: currentContact.firstName
                      }}
                    />
                    {/* <input
                      type='text'
                      value={currentContact.firstName}
                      onChange={(event) =>
                        setCurrentContact((previous) => ({
                          ...previous,
                          firstName: event.target.value
                        }))
                      }
                      placeholder='Nombres'
                      className='w-full rounded border border-slate-300 px-3 py-2'
                    /> */}
                  </TableColBody>

                  <TableColBody className='px-2 py-2'>
                    <Input
                      data={{
                        placeHolder: 'Apellidos completos ',
                        onChange2: (event) =>
                          setCurrentContact((previous) => ({
                            ...previous,
                            lastName: event.target.value
                          })),
                        name: 'apaterno',
                        id: 'apaterno',
                        label: 'apaterno',
                        showLabel: false,
                        ref: React.createRef<HTMLInputElement>(),
                        value: currentContact.lastName
                      }}
                    />
                    {/* <input
                      type='text'
                      value={currentContact.lastName}
                      onChange={(event) =>
                        setCurrentContact((previous) => ({
                          ...previous,
                          lastName: event.target.value
                        }))
                      }
                      placeholder='Apellidos'
                      className='w-full rounded border border-slate-300 px-3 py-2'
                    /> */}
                  </TableColBody>

                  <TableColBody className='px-2 py-2'>
                    <Input
                      data={{
                        placeHolder: 'Correo electrónico',
                        onChange2: (event) =>
                          setCurrentContact((previous) => ({
                            ...previous,
                            email: event.target.value
                          })),
                        name: 'email',
                        id: 'email',
                        label: 'Email',
                        type: 'email',
                        showLabel: false,
                        ref: React.createRef<HTMLInputElement>(),
                        value: currentContact.email
                      }}
                    />
                    {/* <input
                      type='email'
                      value={currentContact.email}
                      onChange={(event) =>
                        setCurrentContact((previous) => ({
                          ...previous,
                          email: event.target.value
                        }))
                      }
                      placeholder='correo@empresa.com'
                      className='w-full rounded border border-slate-300 px-3 py-2'
                    /> */}
                  </TableColBody>

                  <TableColBody className='px-4 py-2 text-center'>
                    <Input
                      data={{
                        placeHolder: 'Principal ',
                        checked: currentContact.principal,
                        onChange2: (event) =>
                          setCurrentContact((previous) => ({
                            ...previous,
                            principal: event.target.checked
                          })),
                        name: 'principal',
                        id: 'principal',
                        label: '',
                        showLabel: false,
                        type: 'checkbox',
                        ref: React.createRef<HTMLInputElement>()
                      }}
                    />
                    {/* <input
                      type='checkbox'
                      checked={currentContact.principal}
                      onChange={(event) =>
                        setCurrentContact((previous) => ({
                          ...previous,
                          principal: event.target.checked
                        }))
                      }
                      className='h-4 w-4'
                    /> */}
                  </TableColBody>

                  <TableColBody className='px-4 py-2 text-center'>
                    <Input
                      data={{
                        placeHolder: 'Status ',
                        checked: currentContact.status,
                        onChange2: (event) =>
                          setCurrentContact((previous) => ({
                            ...previous,
                            status: event.target.checked
                          })),
                        name: 'status',
                        id: 'status',
                        label: '',
                        showLabel: false,
                        type: 'checkbox',
                        ref: React.createRef<HTMLInputElement>()
                      }}
                    />
                    {/* <input
                      type='checkbox'
                      checked={currentContact.status}
                      onChange={(event) =>
                        setCurrentContact((previous) => ({
                          ...previous,
                          status: event.target.checked
                        }))
                      }
                      className='h-4 w-4'
                    /> */}
                  </TableColBody>

                  <TableColBody className='px-4 py-2 text-center'>
                    <div className='flex justify-center gap-2'>
                      <button
                        type='button'
                        onClick={handleSaveContact}
                        className='rounded bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700'
                      >
                        {editingContactUuid ? 'Actualizar' : 'Guardar'}
                      </button>

                      <button
                        type='button'
                        onClick={resetContactForm}
                        className='rounded bg-slate-500 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-600'
                      >
                        Cancelar
                      </button>
                    </div>
                  </TableColBody>
                </TableRow>
              )}

              {/* READ: listado de contactos */}
              {currentContacts.map((contact) => (
                <TableRow
                  key={contact.uuid}
                  className='border-b border-slate-200 hover:bg-slate-50'
                >
                  <TableColBody className='px-4 py-2'>
                    {contact.firstName}
                  </TableColBody>

                  <TableColBody className='px-4 py-2'>
                    {contact.lastName}
                  </TableColBody>

                  <TableColBody className='px-4 py-2'>
                    {contact.email}
                  </TableColBody>

                  <TableColBody className='px-4 py-2 text-center'>
                    {contact.principal ? (
                      <span className='rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700'>
                        Principal
                      </span>
                    ) : (
                      <span className='text-slate-400'>No</span>
                    )}
                  </TableColBody>

                  <TableColBody className='px-4 py-2 text-center'>
                    {contact.status ? (
                      <span className='rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700'>
                        Activo
                      </span>
                    ) : (
                      <span className='rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700'>
                        Inactivo
                      </span>
                    )}
                  </TableColBody>

                  <TableColBody className='px-4 py-2 text-center'>
                    <div className='flex justify-center gap-2'>
                      <span
                        onClick={() => handleEditContact(contact)}
                        className='text-Green8 text-xl'
                      >
                        <RiEditLine />
                      </span>
                      <span
                        onClick={() => handleDeleteContact(contact.uuid)}
                        className='text-Red7 text-xl'
                      >
                        <RiDeleteBin7Line />
                      </span>
                    </div>
                  </TableColBody>
                </TableRow>
              ))}

              {!showContactForm && currentContacts.length === 0 && (
                <TableRow>
                  <TableColBody
                    colSpan={6}
                    className='px-4 py-6 text-center text-slate-500'
                  >
                    No hay contactos registrados.
                  </TableColBody>
                </TableRow>
              )}
            </Table>
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

async function getData(uuid: string | undefined, token: string | null) {
  if (token) {
    const url = uuid && uuid.length > 0 ? endPoints.clients.retrieve(uuid) : ''

    const cliente =
      uuid && uuid.length > 0 ? await ApiFecthAuth(url, token) : null

    //cliente.status por 201
    // if (uuid && cliente) logRes('GET', url, 200, cliente.data)

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
