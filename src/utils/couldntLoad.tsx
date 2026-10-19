const CouldNotLoad = ({ value }: { value?: string }) => {
  const msg = value ? value : null
  const message = `No se pudo cargar los datos${msg ? ` del ${msg}` : ''}`
  return (
    <div
      style={{ backgroundColor: 'rgba(49, 54, 56, 0.1)' }}
      className='h-11 flex items-center text-Charcoal justify-center text-center font-bold'
    >
      {message}
    </div>
  )
}

export { CouldNotLoad }
