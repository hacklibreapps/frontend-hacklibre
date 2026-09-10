/* eslint-disable @typescript-eslint/no-explicit-any */
import moment from 'moment'
import 'moment/locale/es'

const formatDateTime = (
  dateString: any,
  justDate?: boolean,
  includingSeconds?: boolean,
  tiny?: boolean
) => {
  return moment(dateString)
    .utcOffset('-05:00')
    .format(
      justDate
        ? tiny
          ? 'DD-MM-YYYY'
          : 'DD MM YYYY'
        : includingSeconds
          ? `DD MMMM YYYY ${tiny ? '-' : ''} h:mm:ss a`
          : `DD MMMM YYYY ${tiny ? '-' : ''} h:mm a`
    )
}
export { formatDateTime }
