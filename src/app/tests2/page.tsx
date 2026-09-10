// src/app/tests2/page.tsx
'use client'

import { useEffect, useRef, useState } from 'react'
import Input from '@/components/atom/structures/input'
import { Img } from '@/utils/img'
import { HiMagnifyingGlass } from 'react-icons/hi2'
import {
  FiUser,
  FiSettings,
  FiInbox,
  FiHelpCircle,
  FiLogOut,
  FiCheck
} from 'react-icons/fi'
import { GiPenguin } from 'react-icons/gi'
import duo from '@/assets/images/tortugaypengui.png'
import ImagePreviewDialog from '@/components/molecule/auth/ImagePreviewDialog'
import imagenpinguiytortu from '@/assets/images/tortugaypengui.png'

import Dialogs from '@/components/atom/structures/dialogo'
import Checkbox from '@/components/atom/structures/checkbox'
import Section from '@/components/atom/layout/section'
import Card from '@/components/atom/layout/card'
import MenuItem from '@/components/atom/navigation/menuitem'
import PaymentTabsCard from '@/components/molecule/payments/paymentTabsCard'
import { Button } from '@/components/atom/structures/button'
import InputBackground from '@/components/molecule/backgrounds/inputBackground'
import { ModalSize } from '@/interfaces/querys/queryInterface'

const SIZES: ModalSize[] = ['xs', 'sm', 'md', 'lg', 'xl', 'xxl']

export default function TestInputsPage() {
  const nameRef = useRef<HTMLInputElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)
  const passRef = useRef<HTMLInputElement>(null)
  const ageRef = useRef<HTMLInputElement>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const [menuOpen, setMenuOpen] = useState(false)
  const avatarBtnRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLUListElement>(null)

  // click fuera + Escape
  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!menuOpen) return
      const t = e.target as Node
      if (
        menuRef.current &&
        !menuRef.current.contains(t) &&
        avatarBtnRef.current &&
        !avatarBtnRef.current.contains(t)
      ) {
        setMenuOpen(false)
      }
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    document.addEventListener('mousedown', onDocClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDocClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [menuOpen])

  // diálogos
  const [openDialog, setOpenDialog] = useState<ModalSize | null>(null)
  const dialogText = (
    <>
      The key to more success is to have a lot of pillows. Put it this way, it
      took me twenty five years to get these plants, twenty five years of blood
      sweat and tears, and I&apos;m never giving up, I&apos;m just getting
      started. I&apos;m up to something. Fan luv.
    </>
  )

  return (
    <div className='relative min-h-screen overflow-hidden bg-Charcoal px-6 py-10'>
      <InputBackground
        variant='brand'
        scheme='teal' // prueba "cyber" o "midnight" para más/menos contraste
        opacity={1}
        penguinSrc={duo.src} // si luego tienes archivos separados, pásalos aquí
        turtleSrc={duo.src}
      />
      <div className='mx-auto w-full max-w-5xl space-y-10'>
        <header className='space-y-2'>
          <h1 className='text-3xl font-bold tracking-tight text-white'>
            Catálogo de Inputs
          </h1>
          <p className='text-Cian2'>
            Colección de campos y patrones UI listos para reutilizar en futuros
            proyectos.
          </p>
        </header>

        {/* ---------- Inputs del componente ---------- */}
        <Section
          title='Inputs del componente'
          subtitle='Ejemplos usando tu <Input />'
        >
          <div className='grid gap-6 md:grid-cols-2'>
            {/* Texto */}
            <Card title='Texto'>
              <label
                htmlFor='name'
                className='mb-1 block text-sm font-semibold text-Charcoal after:ml-0.5 after:align-top after:content-["*"] after:text-Red7'
              >
                Nombre
              </label>
              <div className='[&_input]:transition [&_input]:duration-300 [&_input:hover]:!border-Cian8 [&_input:hover]:shadow-md'>
                <Input
                  data={{
                    name: 'name',
                    id: 'name',
                    label: 'Nombre',
                    showLabel: false,
                    type: 'text',
                    ref: nameRef,
                    required: true,
                    placeHolder: 'Escribe tu nombre…',
                    onChange: (v) => console.log('Nombre:', v)
                  }}
                />
              </div>
            </Card>

            {/* Email */}
            <Card title='Email'>
              <label
                htmlFor='email'
                className='mb-1 block text-sm font-semibold text-Charcoal'
              >
                Correo electrónico
              </label>
              <div className='[&_input]:transition [&_input]:duration-300 [&_input:hover]:!border-Cian8 [&_input:hover]:shadow-md'>
                <Input
                  data={{
                    name: 'email',
                    id: 'email',
                    label: 'Correo electrónico',
                    showLabel: false,
                    type: 'email',
                    ref: emailRef,
                    placeHolder: 'tucorreo@dominio.com',
                    onChange: (v) => console.log('Email:', v)
                  }}
                />
              </div>
            </Card>

            {/* Password */}
            <Card title='Password (con toggle)'>
              <label
                htmlFor='password'
                className='mb-1 block text-sm font-semibold text-Charcoal'
              >
                Contraseña
              </label>
              <div className='[&_input]:transition [&_input]:duration-300 [&_input:hover]:!border-Cian8 [&_input:hover]:shadow-md'>
                <Input
                  data={{
                    name: 'password',
                    id: 'password',
                    label: 'Contraseña',
                    showLabel: false,
                    type: 'password',
                    ref: passRef,
                    placeHolder: '••••••••',
                    onChange: (v) => console.log('Password:', v)
                  }}
                />
              </div>
            </Card>

            {/* Numérico */}
            <Card title='Numérico'>
              <label
                htmlFor='age'
                className='mb-1 block text-sm font-semibold text-Charcoal'
              >
                Edad
              </label>
              <div className='[&_input]:transition [&_input]:duration-300 [&_input:hover]:!border-Cian8 [&_input:hover]:shadow-md'>
                <Input
                  data={{
                    name: 'age',
                    id: 'age',
                    label: 'Edad',
                    showLabel: false,
                    type: 'number',
                    ref: ageRef,
                    placeHolder: 'Ingresa tu edad',
                    onChange: (v) => console.log('Edad:', v)
                  }}
                />
              </div>
            </Card>

            {/* Archivo (PDF) */}
            <Card title='Archivo (PDF)'>
              <label
                htmlFor='cv'
                className='mb-1 block text-sm font-semibold text-Charcoal'
              >
                Subir archivo (PDF)
              </label>

              {/* contenedor para centrar visualmente el control */}
              <div className='flex justify-center'>
                <div className='w-full max-w-md'>
                  <Input
                    data={{
                      name: 'cv',
                      id: 'cv',
                      label: 'Subir archivo (PDF)',
                      showLabel: false,
                      type: 'file',
                      ref: fileRef,
                      placeHolder: 'Selecciona un archivo PDF',
                      acceptedDocuments: 'application/pdf'
                    }}
                  />
                </div>
              </div>
            </Card>
          </div>
        </Section>

        {/* ---------- Inputs nativos (bordes/estados) ---------- */}
        <Section title='Inputs nativos' subtitle='Variaciones: hover y focus'>
          <Card>
            <div className='grid gap-4 sm:grid-cols-2'>
              <input
                className='w-full rounded-md border border-Cian2 px-3 py-2 text-sm text-Charcoal placeholder:text-Charcoal/50 transition duration-300 ease-in-out hover:border-Cian4 focus:outline-none focus:border-Cian4 shadow-sm hover:shadow-md focus:shadow-md bg-white'
                placeholder='Borde cian'
              />
              <input
                className='w-full rounded-md border border-Cian2 px-3 py-2 text-sm text-Charcoal placeholder:text-Charcoal/50 transition duration-300 ease-in-out hover:border-Red8 focus:outline-none focus:border-Cian4 shadow-sm hover:shadow-md focus:shadow-md bg-white'
                placeholder='Hover rojo / Focus cian'
              />
              <input
                className='w-full rounded-md border border-Cian2 px-3 py-2 text-sm text-Charcoal placeholder:text-Charcoal/50 transition duration-300 ease-in-out hover:border-Cian4 focus:outline-none focus:border-Cian4 shadow-sm hover:shadow-md focus:shadow-md bg-white'
                placeholder='Cian suave'
              />
              <input
                className='w-full rounded-md border border-Cian2 px-3 py-2 text-sm text-Charcoal placeholder:text-Charcoal/50 transition duration-300 ease-in-out hover:border-Green8 focus:outline-none focus:border-Cian4 shadow-sm hover:shadow-md focus:shadow-md bg-white'
                placeholder='Verde acento'
              />
            </div>
          </Card>
        </Section>

        {/* ---------- Input de búsqueda ---------- */}
        <Section
          title='Input de búsqueda'
          subtitle='Campo con botón a la derecha'
        >
          <Card>
            <div className='relative w-full max-w-sm'>
              <input
                className='w-full rounded-md border border-Cian2 pl-3 pr-28 py-2 text-sm text-Charcoal placeholder:text-Charcoal/50 transition focus:outline-none focus:border-Cian4 hover:border-Cian4 shadow-sm hover:shadow-md focus:shadow-md bg-white'
                placeholder='UI Kits, Dashboards...'
              />
              <button
                type='button'
                aria-label='Buscar'
                className='absolute right-1 top-1 inline-flex items-center gap-2 rounded border border-transparent bg-Cian8 px-2.5 py-1 text-sm text-white transition-all shadow-sm hover:shadow-md hover:bg-Cian7 focus:bg-Cian7 active:bg-Cian7'
              >
                <HiMagnifyingGlass className='h-4 w-4' />
                Search
              </button>
            </div>
          </Card>
        </Section>

        {/* ---------- Imagen con diálogo (preview) ---------- */}
        <Section
          title='Imagen con diálogo (preview)'
          subtitle='Modal con acciones'
        >
          <Card>
            <div className='flex items-center justify-center'>
              <ImagePreviewDialog
                thumbnailSrc={imagenpinguiytortu.src}
                fullSrc={imagenpinguiytortu.src}
                alt='Imagen Tortuga y Pingüi'
                title='Hacklibre'
                subtitle='@gnietol'
                downloadable
                onLike={() => console.log('like')}
                onShare={() => console.log('share')}
                stats={[
                  { label: 'Views', value: '844,082,044' },
                  { label: 'Downloads', value: '1,553,031' }
                ]}
                modalSize='lg'
                imgHeightClass='h-[30rem]'
              />
            </div>
          </Card>
        </Section>

        {/* ---------- Avatar + menú ---------- */}
        <Section
          title='Avatar con menú'
          subtitle='Headless dropdown con React Icons'
        >
          <Card>
            <div className='relative inline-block'>
              <button
                ref={avatarBtnRef}
                type='button'
                aria-haspopup='menu'
                aria-expanded={menuOpen}
                onClick={() => setMenuOpen((v) => !v)}
                className='focus:outline-none'
              >
                <Img
                  alt='avatar'
                  src='https://images.unsplash.com/photo-1633332755192-727a05c4013d?auto=format&fit=crop&w=1480&q=80'
                  className='h-10 w-10 cursor-pointer rounded-full object-cover ring-2 ring-Cian4 transition hover:ring-Cian7'
                />
              </button>

              {menuOpen && (
                <ul
                  ref={menuRef}
                  role='menu'
                  aria-orientation='vertical'
                  className='absolute right-0 z-50 mt-2 min-w-[200px] overflow-auto rounded-lg border border-Cian2 bg-white p-1.5 shadow-lg focus:outline-none'
                >
                  <MenuItem
                    icon={<FiUser className='h-5 w-5 text-Charcoal/50' />}
                    label='My Profile'
                    onClick={() => setMenuOpen(false)}
                  />
                  <MenuItem
                    icon={<FiSettings className='h-5 w-5 text-Charcoal/50' />}
                    label='Edit Profile'
                    onClick={() => setMenuOpen(false)}
                  />
                  <MenuItem
                    icon={<FiInbox className='h-5 w-5 text-Charcoal/50' />}
                    label='Inbox'
                    onClick={() => setMenuOpen(false)}
                  />
                  <MenuItem
                    icon={<FiHelpCircle className='h-5 w-5 text-Charcoal/50' />}
                    label='Help'
                    onClick={() => setMenuOpen(false)}
                  />
                  <hr className='my-2 border-Cian2' />
                  <MenuItem
                    icon={<FiLogOut className='h-5 w-5 text-Charcoal/50' />}
                    label='Sign Out'
                    onClick={() => setMenuOpen(false)}
                  />
                </ul>
              )}
            </div>
          </Card>
        </Section>

        {/* ---------- Checkbox custom ---------- */}
        <Section
          title='Checkbox personalizado'
          subtitle='Variantes con react-icons'
        >
          <div className='grid gap-6 md:grid-cols-2'>
            <Card title='Check (FiCheck)'>
              <Checkbox
                label='Recordar mi elección'
                icon={<FiCheck className='h-3.5 w-3.5' />}
                defaultChecked
                color='cian'
                onChange={(v) => console.log('check clásico:', v)}
              />
            </Card>

            <Card title='Icono personalizado (Pingüino)'>
              <Checkbox
                label='I ❤️ Penguins'
                icon={<GiPenguin className='h-3.5 w-3.5' />}
                defaultChecked
                color='cian'
                onChange={(v) => console.log('pingüino:', v)}
              />
            </Card>
          </div>
        </Section>

        {/* ---------- Botón con badge (unificado) ---------- */}
        <Section title='Botón con badge' subtitle='Variantes de color'>
          <Card>
            <div className='flex flex-wrap items-center gap-4'>
              <Button
                data={{
                  name: 'notifications',
                  id: 'notifications',
                  label: '',
                  showLabel: false,
                  type: 'button',
                  buttonName: 'Notifications',
                  uiType: 'badge',
                  badgeCount: 15,
                  badgeVariant: 'cian',
                  compact: true
                }}
              />

              <Button
                data={{
                  name: 'alerts',
                  id: 'alerts',
                  label: '',
                  showLabel: false,
                  type: 'button',
                  buttonName: 'Alerts',
                  uiType: 'badge',
                  badgeCount: 3,
                  badgeVariant: 'red',
                  compact: true
                }}
              />
              <Button
                data={{
                  name: 'success',
                  id: 'success',
                  label: '',
                  showLabel: false,
                  type: 'button',
                  buttonName: 'Success',
                  uiType: 'badge',
                  badgeCount: 1,
                  badgeVariant: 'green',
                  compact: true
                }}
              />
            </div>
          </Card>
        </Section>

        {/* ---------- Botones (componente) ---------- */}
        <Section title='Botones (componente)' subtitle='Estados y variantes'>
          <Card>
            <div className='grid gap-6 sm:grid-cols-2'>
              {/* Submit (Cian) centrado y ancho cómodo */}
              <div>
                <label className='mb-1 block text-sm font-semibold text-Charcoal'>
                  Submit (Cian)
                </label>
                <div className='flex justify-center'>
                  <Button
                    data={{
                      name: 'save',
                      id: 'save',
                      label: '',
                      showLabel: false,
                      type: 'submit', // submit => estilo cian en tu Button
                      buttonName: 'Guardar cambios',
                      compact: true,
                      className: 'min-w-[220px]'
                    }}
                  />
                </div>
              </div>

              {/* Button (Green) a todo el ancho de su columna */}
              <div>
                <label className='mb-1 block text-sm font-semibold text-Charcoal'>
                  Button (Green)
                </label>
                <Button
                  data={{
                    name: 'action',
                    id: 'action',
                    label: '',
                    showLabel: false,
                    type: 'button', // button => estilo green en tu Button
                    buttonName: 'Acción'
                  }}
                />
              </div>

              {/* Disabled (full width) */}
              <div>
                <label className='mb-1 block text-sm font-semibold text-Charcoal'>
                  Disabled
                </label>
                <Button
                  data={{
                    name: 'disabled',
                    id: 'disabled',
                    label: '',
                    showLabel: false,
                    type: 'button',
                    buttonName: 'No disponible',
                    disabled: true
                  }}
                />
              </div>

              {/* Loading (full width) */}
              <div>
                <label className='mb-1 block text-sm font-semibold text-Charcoal'>
                  Loading
                </label>
                <Button
                  data={{
                    name: 'loading',
                    id: 'loading',
                    label: '',
                    showLabel: false,
                    type: 'submit',
                    buttonName: 'Procesando…',
                    loaded: true
                  }}
                />
              </div>

              {/* Tiny: 50% de la columna, centrado */}
              <div className='flex items-end justify-center'>
                <Button
                  data={{
                    name: 'tiny',
                    id: 'tiny',
                    label: '',
                    showLabel: false,
                    type: 'button',
                    buttonName: 'Mitad',
                    tiny: true
                  }}
                />
              </div>
            </div>
          </Card>
        </Section>

        {/* ---------- Formulario de pago (tabs) ---------- */}
        <Section
          title='Formulario de pago'
          subtitle='Tabs: tarjeta de crédito / PayPal'
        >
          <Card>
            <PaymentTabsCard />
          </Card>
        </Section>

        {/* ---------- Diálogos (usando componente) ---------- */}
        <Section title='Diálogos (modales)' subtitle='XS, SM, MD, LG, XL, XXL'>
          <Card>
            <div className='flex flex-wrap gap-3'>
              {SIZES.map((s: ModalSize) => (
                <button
                  key={s}
                  onClick={() => setOpenDialog(s)}
                  className='rounded-md border border-transparent bg-Cian8 px-4 py-2 text-center text-sm text-white shadow-md transition-all hover:shadow-lg hover:bg-Cian7'
                  type='button'
                >
                  Open Dialog {s.toUpperCase()}
                </button>
              ))}
            </div>

            {SIZES.map((s: ModalSize) => (
              <Dialogs
                key={s}
                open={openDialog === s}
                onClose={() => setOpenDialog(null)}
                size={s}
                title='It’s a simple dialog.'
                confirmText='Confirmar'
                cancelText='Cancelar'
              >
                {dialogText}
              </Dialogs>
            ))}
          </Card>
        </Section>
      </div>
    </div>
  )
}
