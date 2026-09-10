'use client'

import { Table } from '@/components/atom/structures/table'
import { TableBody } from '@/components/atom/auth/structures/tableBody'
import TableColHeader from '@/components/atom/auth/structures/tableCol'
import TableColBody from '@/components/atom/auth/structures/tableColBody'
import TableHeader from '@/components/atom/auth/structures/tableHeader'
import TableRow from '@/components/atom/auth/structures/tableRow'
import {
  StatusIcon,
  StatusIconStates
} from '@/components/atom/auth/structures/status/statusIcon'
import EditActionIcon from '@/components/atom/structures/actions/editActionIcon'
import ToggleActionIcon from '@/components/atom/structures/actions/toggleActionIcon'
import AddActionIcon from '@/components/atom/structures/actions/addActionIcon'
import Input from '@/components/atom/structures/input'
import {
  ContactInterface,
  ContactTempInterface
} from '@/interfaces/querys/queryInterface'
import {
  ContactRow,
  isPersistedContact
} from '@/app/helpers/clientes/clientesGuards'
import React from 'react'
import TableRowHeader from '@/components/molecule/auth/structures/tableRowHeader'

type Props = {
  isEditing: boolean
  showCreatorRow: boolean
  setShowCreatorRow: React.Dispatch<React.SetStateAction<boolean>>

  rows: ContactRow[]

  creatorDraft: ContactTempInterface
  setCreatorDraft: React.Dispatch<React.SetStateAction<ContactTempInterface>>

  editDraft: ContactTempInterface
  setEditDraft: React.Dispatch<React.SetStateAction<ContactTempInterface>>

  editingIndex: number | null

  onStartEdit: (c: ContactRow, idx: number) => void
  onCancelEdit: () => void
  onSaveEdit: (c: ContactRow, idx: number) => void

  onAddTempContact: () => void
  onAddPersistedContact: () => void

  onToggleContactStatus: (c: ContactInterface, idx: number) => void
}

const ContactsTable: React.FC<Props> = ({
  isEditing,
  showCreatorRow,
  setShowCreatorRow,
  rows,
  creatorDraft,
  setCreatorDraft,
  editDraft,
  setEditDraft,
  editingIndex,
  onStartEdit,
  onCancelEdit,
  onSaveEdit,
  onAddTempContact,
  onAddPersistedContact,
  onToggleContactStatus
}) => {
  return (
    <div className='w-full'>
      <div className='mb-2 font-semibold text-Charcoal'>
        {isEditing ? 'Contactos del cliente' : 'Contactos (temporal)'}
      </div>

      <Table>
        <TableHeader>
          <TableRowHeader>
            <TableColHeader>Nombres</TableColHeader>
            <TableColHeader>Apellidos</TableColHeader>
            <TableColHeader>Email</TableColHeader>
            <TableColHeader>Principal</TableColHeader>
            <TableColHeader>Estado</TableColHeader>

            <TableColHeader className=''>
              Acciones
              {isEditing && (
                <span className='inline-flex align-middle ml-2'>
                  <AddActionIcon
                    asBorder
                    asWhite
                    onClick={() => setShowCreatorRow((s) => !s)}
                    size='sm'
                  />
                </span>
              )}
            </TableColHeader>
          </TableRowHeader>
        </TableHeader>

        <TableBody>
          {/* Fila creadora en NUEVO (temporal) */}
          {!isEditing && (
            <TableRow>
              <TableColBody className='px-4 py-2'>
                <Input
                  data={{
                    placeHolder: 'Nombres',
                    value: creatorDraft.firstName,
                    onChange2: (e) =>
                      setCreatorDraft((s) => ({
                        ...s,
                        firstName: e.target.value
                      })),
                    name: 'firstName',
                    id: 'firstName',
                    label: 'Nombres',
                    showLabel: false,
                    ref: React.createRef<HTMLInputElement>()
                  }}
                />
              </TableColBody>

              <TableColBody className='px-4 py-2'>
                <Input
                  data={{
                    placeHolder: 'Apellidos',
                    value: creatorDraft.lastName,
                    onChange2: (e) =>
                      setCreatorDraft((s) => ({
                        ...s,
                        lastName: e.target.value
                      })),
                    name: 'lastName',
                    id: 'lastName',
                    label: 'Apellidos',
                    showLabel: false,
                    ref: React.createRef<HTMLInputElement>()
                  }}
                />
              </TableColBody>

              <TableColBody className='px-4 py-2'>
                <Input
                  data={{
                    placeHolder: 'Correo Electrónico ',
                    value: creatorDraft.email,
                    onChange2: (e) =>
                      setCreatorDraft((s) => ({
                        ...s,
                        email: e.target.value
                      })),
                    name: 'email',
                    id: 'email',
                    label: 'Correo Electrónico',
                    showLabel: false,
                    ref: React.createRef<HTMLInputElement>()
                  }}
                />
              </TableColBody>

              <TableColBody className='px-4 py-2 text-center'>
                <Input
                  data={{
                    placeHolder: 'Principal ',
                    checked: !!creatorDraft.principal,
                    onChange2: (e) =>
                      setCreatorDraft((s) => ({
                        ...s,
                        principal: e.target.checked
                      })),
                    name: 'principal',
                    id: 'principal',
                    label: 'Principal',
                    showLabel: false,
                    type: 'checkbox',
                    ref: React.createRef<HTMLInputElement>()
                  }}
                />
              </TableColBody>

              <TableColBody className='w-auto text-center'>
                <StatusIcon status={true} />
              </TableColBody>

              <TableColBody className='px-4 py-2 text-center'>
                <AddActionIcon onClick={onAddTempContact} size='sm' />
              </TableColBody>
            </TableRow>
          )}

          {/* Fila creadora en EDICIÓN (POST al backend) */}
          {isEditing && showCreatorRow && (
            <TableRow>
              <TableColBody className='px-4 py-2 border-r border-slate-100'>
                <input
                  className='w-full border border-slate-300 rounded px-2 py-1'
                  placeholder='Nombres'
                  value={creatorDraft.firstName}
                  onChange={(e) =>
                    setCreatorDraft((s) => ({
                      ...s,
                      firstName: e.target.value
                    }))
                  }
                />
              </TableColBody>

              <TableColBody className='px-4 py-2 border-r border-slate-100'>
                <input
                  className='w-full border border-slate-300 rounded px-2 py-1'
                  placeholder='Apellidos'
                  value={creatorDraft.lastName}
                  onChange={(e) =>
                    setCreatorDraft((s) => ({
                      ...s,
                      lastName: e.target.value
                    }))
                  }
                />
              </TableColBody>

              <TableColBody className='px-4 py-2 border-r border-slate-100'>
                <input
                  type='email'
                  className='w-full border border-slate-300 rounded px-2 py-1'
                  placeholder='Email'
                  value={creatorDraft.email}
                  onChange={(e) =>
                    setCreatorDraft((s) => ({
                      ...s,
                      email: e.target.value
                    }))
                  }
                />
              </TableColBody>

              <TableColBody className='px-4 py-2 text-center border-r border-slate-100'>
                <input
                  type='checkbox'
                  checked={creatorDraft.principal}
                  onChange={(e) =>
                    setCreatorDraft((s) => ({
                      ...s,
                      principal: e.target.checked
                    }))
                  }
                />
              </TableColBody>

              <TableColBody className='w-auto text-center'>
                <StatusIcon status={true} />
              </TableColBody>

              <TableColBody className='px-4 py-2 text-center'>
                <AddActionIcon onClick={onAddPersistedContact} />
              </TableColBody>
            </TableRow>
          )}

          {rows.length ? (
            rows.map((c, idx) => {
              const editing = editingIndex === idx
              const persisted = isPersistedContact(c)
              const statusToShow = persisted ? c.status : true
              const keyVal = persisted ? c.uuid : `tmp-${idx}`

              return (
                <TableRow
                  key={keyVal}
                  className='border-b border-slate-200 hover:bg-slate-50'
                >
                  <TableColBody className='px-4 py-2 text-center'>
                    {editing ? (
                      <Input
                        data={{
                          placeHolder: 'Nombres',
                          value: editDraft.firstName,
                          onChange2: (e) =>
                            setEditDraft((s) => ({
                              ...s,
                              firstName: e.target.value
                            })),
                          name: 'firstName',
                          id: 'firstName',
                          label: 'Nombres',
                          showLabel: false,
                          ref: React.createRef<HTMLInputElement>()
                        }}
                      />
                    ) : (
                      <p>{c.firstName}</p>
                    )}
                  </TableColBody>

                  <TableColBody className='px-4 py-2 text-center'>
                    {editing ? (
                      <Input
                        data={{
                          placeHolder: 'Apellidos',
                          value: editDraft.lastName,
                          onChange2: (e) =>
                            setEditDraft((s) => ({
                              ...s,
                              lastName: e.target.value
                            })),
                          name: 'lastName',
                          id: 'lastName',
                          label: 'Apellidos',
                          showLabel: false,
                          ref: React.createRef<HTMLInputElement>()
                        }}
                      />
                    ) : (
                      <p>{c.lastName}</p>
                    )}
                  </TableColBody>

                  <TableColBody className='px-4 py-2 text-center'>
                    {editing ? (
                      <Input
                        data={{
                          placeHolder: 'Correo Electrónico ',
                          value: editDraft.email,
                          onChange2: (e) =>
                            setEditDraft((s) => ({
                              ...s,
                              email: e.target.value
                            })),
                          name: 'email',
                          id: 'email',
                          label: 'Correo Electrónico',
                          showLabel: false,
                          ref: React.createRef<HTMLInputElement>()
                        }}
                      />
                    ) : (
                      <p>{c.email}</p>
                    )}
                  </TableColBody>

                  <TableColBody className='px-4 py-2 text-center'>
                    {editing ? (
                      <div className='flex flex-row justify-center items-center'>
                        <Input
                          data={{
                            placeHolder: 'Principal ',
                            checked: !!editDraft.principal,
                            onChange2: (e) =>
                              setEditDraft((s) => ({
                                ...s,
                                principal: e.target.checked
                              })),
                            name: 'principal',
                            id: 'principal',
                            label: 'Principal',
                            showLabel: false,
                            type: 'checkbox',
                            ref: React.createRef<HTMLInputElement>()
                          }}
                        />
                      </div>
                    ) : c.principal ? (
                      <StatusIconStates status='CONFIRM' labelActivo='SI' />
                    ) : (
                      <StatusIconStates status='REJECTED' labelActivo='NO' />
                    )}
                  </TableColBody>

                  <TableColBody className='px-4 py-2 text-center'>
                    <StatusIcon status={!!statusToShow} />
                  </TableColBody>

                  <TableColBody className='px-4 py-2 text-center'>
                    {editing ? (
                      <div className='flex items-center justify-center gap-2'>
                        <button
                          type='button'
                          className='px-3 py-1 rounded bg-cyan-900 text-white font-medium'
                          onClick={() => onSaveEdit(c, idx)}
                        >
                          Guardar
                        </button>
                        <button
                          type='button'
                          className='px-3 py-1 rounded bg-slate-300 text-slate-800 font-medium'
                          onClick={onCancelEdit}
                        >
                          Cancelar
                        </button>
                      </div>
                    ) : (
                      <div className='flex items-center justify-center gap-2'>
                        <EditActionIcon onClick={() => onStartEdit(c, idx)} />
                        {persisted && isEditing ? (
                          <ToggleActionIcon
                            active={c.status}
                            onClick={() => onToggleContactStatus(c, idx)}
                          />
                        ) : null}
                      </div>
                    )}
                  </TableColBody>
                </TableRow>
              )
            })
          ) : (
            <TableRow className='border-b border-slate-200'>
              <td
                colSpan={6}
                className='px-4 py-8 text-center text-Charcoal/60'
              >
                {isEditing
                  ? 'No hay contactos registrados.'
                  : 'Aún no has agregado contactos.'}
              </td>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}

export default ContactsTable
