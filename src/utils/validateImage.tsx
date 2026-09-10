const validateImage = (file: File): boolean => {
  // Extensiones permitidas
  const validExtensions = ['jpg', 'jpeg', 'png']
  const fileExtension = file.name.toLowerCase().split('.').pop()

  // Tipos MIME permitidos
  const validMimeTypes = ['image/jpeg', 'image/png']

  return (
    validExtensions.includes(fileExtension || '') &&
    validMimeTypes.includes(file.type)
  )
}

export { validateImage }
