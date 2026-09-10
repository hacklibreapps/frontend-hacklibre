const GetTimeElapsed = (createdDate: string) => {
  const now = new Date()
  const created = new Date(createdDate)
  const diffInSeconds = Math.floor((now.getTime() - created.getTime()) / 1000)

  const minutes = Math.floor(diffInSeconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  const months = Math.floor(days / 30)

  if (months > 0) {
    return months === 1 ? '1 mes' : `${months} meses`
  } else if (days > 0) {
    return days === 1 ? '1 día' : `${days} días`
  } else if (hours > 0) {
    return hours === 1 ? '1 hora' : `${hours} horas`
  } else if (minutes > 0) {
    return minutes === 1 ? '1 minuto' : `${minutes} minutos`
  } else {
    return 'unos segundos'
  }
}
export { GetTimeElapsed }
