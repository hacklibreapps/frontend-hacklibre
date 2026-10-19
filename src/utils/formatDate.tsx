/* eslint-disable @typescript-eslint/no-explicit-any */
import moment from 'moment'
import 'moment/locale/es'

const formatDateTime = (
  dateString: any,
  justDate?: boolean,
  includingSeconds?: boolean,
  tiny?: boolean
) => {
  if (!dateString) return '-'

  // DateField de Django: YYYY-MM-DD
  // No aplicar timezone.
  if (justDate) {
    const date = moment(dateString, 'YYYY-MM-DD', true)

    if (!date.isValid()) return '-'

    return date
      .locale('es')
      .format(tiny ? 'DD-MM-YYYY' : 'DD MMM YYYY')
      .replace('.', '')
  }

  // DateTimeField: aquí sí aplicamos timezone Perú
  return moment(dateString)
    .utcOffset('-05:00')
    .locale('es')
    .format(
      includingSeconds
        ? `DD MMMM YYYY ${tiny ? '-' : ''} h:mm:ss a`
        : `DD MMMM YYYY ${tiny ? '-' : ''} h:mm a`
    )
}

export { formatDateTime }

// /* eslint-disable @typescript-eslint/no-explicit-any */
// import moment from 'moment'
// import 'moment/locale/es'

// const formatDateTime = (
//   dateString: any,
//   justDate?: boolean,
//   includingSeconds?: boolean,
//   tiny?: boolean
// ) => {
//   return moment(dateString)
//     .utcOffset('-05:00')
//     .format(
//       justDate
//         ? tiny
//           ? 'DD-MM-YYYY'
//           : 'DD MM YYYY'
//         : includingSeconds
//           ? `DD MMMM YYYY ${tiny ? '-' : ''} h:mm:ss a`
//           : `DD MMMM YYYY ${tiny ? '-' : ''} h:mm a`
//     )
// }
// export { formatDateTime }
