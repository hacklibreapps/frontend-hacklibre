'use client'

import React, { useEffect, useRef } from 'react'
import { useAuth } from '@/context/authContext'
import { KeyValueInterface } from '@/interfaces/structures/keyValueInterface'
import Select from '../structures/select'

const CompanyPicker = () => {
  // para el manejo de las empresas -----------------------------
  const { enterprises, enterprise, selectEnterprise } = useAuth()
  const entepriseRef = useRef<HTMLInputElement>(null)

  const options: KeyValueInterface[] = enterprises.map((e) => ({
    key: e.uuid,
    value: e.name
  }))

  const initial = enterprises.find((e) => e.uuid === enterprise)

  const editData = initial
    ? { key: initial.uuid, value: initial.name }
    : undefined

  const formData = {
    empresas: {
      name: 'enterprise',
      id: 'enterprise',
      label: 'Empresa',
      ref: entepriseRef, // <- el Select escribirá aquí
      showLabel: false,
      editData,
      data: options,
      noDeleteOption: true,
      onChange: (id: string) => {
        selectEnterprise(id)
      }
    }
  } as const

  useEffect(() => {
    // sincroniza el hidden si cambias empresa desde otro lado
    if (entepriseRef.current) {
      entepriseRef.current.value = enterprise ?? ''
    }
  }, [enterprise])
  // fin del manejo de las empresas ----------------------------

  return (
    <label className={`inline-flex items-center gap-2 `}>
      <span className='sr-only'>Empresa</span>
      <Select data={formData.empresas} />
    </label>
  )
}

export default CompanyPicker
