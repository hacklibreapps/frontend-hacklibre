// src/services/envs/endpoints.ts

import { apiUrl } from '@/services/envs/connectionUrl'

// helper para querystring opcional
const qs = (s?: string) => (s ? (s.startsWith('?') ? s : `?${s}`) : '')

const endPoints = {
  /* -------------------- AUTH (base) -------------------- */
  auth: {
    token: `${apiUrl}auth/token/`,
    me: `${apiUrl}auth/me/`,
    changePassword: `${apiUrl}auth/change-password/`,
    // Ejemplo de listado de usuarios con paginación y filtro:
    users: (page: string, filter?: string) =>
      `${apiUrl}auth/users/?page=${page}${filter ? `&${filter}` : ''}`,
    notifications: {
      listNotifications: `${apiUrl}main-data/notifications/`,
      markAsReadingNotification: (uuid: string) =>
        `${apiUrl}main-data/notifications/${uuid}/`,
      markAsRead: `${apiUrl}main-data/notifications/mark-as-read-complete/`
    }
  },

  //setting
  customer: {
    // Endpoint para obtener el perfil del usuario actual
    perfilretrieve: `${apiUrl}customer/data/me/`,

    // Endpoint para obtener los datos de un cliente específico por su ID
    retrieve: (id: string) => `${apiUrl}customer/data/${id}/`,

    // Endpoint para actualizar los datos de un cliente específico por su ID (PUT)
    put: (id: string) => `${apiUrl}customer/data/${id}/`,

    // Endpoint para modificar parcialmente los datos de un cliente específico por su ID (PATCH)
    patch: (id: string) => `${apiUrl}customer/data/${id}/`,

    // Endpoint para obtener los permisos del cliente
    permissions: `${apiUrl}customer/data/me/permissions/`,

    // Endpoint para obtener los detalles completos de un cliente por su UUID
    fullDetails: (uuid: string) =>
      `${apiUrl}customer/data/${uuid}/full-details/`
  },

  usuarios: {
    // listUser: (page: string, filter?: string) =>
    //   `${apiUrl}puntos-solgas/usuarios/?page=${page}${
    //     filter ? `&${filter}` : ''
    //   }`,
    // createUser: () => `${apiUrl}puntos-solgas/usuarios/`,
    // retrieveUser: (uuid: string) => `${apiUrl}puntos-solgas/usuarios/${uuid}/`,
    // updateUser: (uuid: string) => `${apiUrl}puntos-solgas/usuarios/${uuid}/`,
    // patchUser: (uuid: string) => `${apiUrl}puntos-solgas/usuarios/${uuid}/`,
    changepasswordUser: (uuid: string) =>
      `${apiUrl}puntos-solgas/usuarios/${uuid}/change-password/`
  },

  /* -------------------- CLIENTES -------------------- */
  clients: {
    list: (page: string, filter?: string) =>
      `${apiUrl}clients/data/?page=${page}${filter ? `&${filter}` : ''}`,
    create: `${apiUrl}clients/data/`,
    retrieve: (uuid: string | number, flags?: string) =>
      `${apiUrl}clients/data/${uuid}/${flags ? qs(flags) : ''}`,
    put: (uuid: string | number) => `${apiUrl}clients/data/${uuid}/`,
    patch: (uuid: string | number) => `${apiUrl}clients/data/${uuid}/`,
    delete: (uuid: string | number) => `${apiUrl}clients/data/${uuid}/`,
    postClientes: `${apiUrl}clientes/data/`,
    noPaged: `${apiUrl}clients/data/no-paged/`,
    search: (term: string) => `${apiUrl}clients/data/search/${qs(`q=${term}`)}`,
    exportExcel: (filter?: string) =>
      `${apiUrl}clients/data/export-excel/${qs(filter)}`,
    activateClient: (uuid: string | number) =>
      `${apiUrl}clients/data/${uuid}/activate/`,
    deactivateClient: (uuid: string | number) =>
      `${apiUrl}clients/data/${uuid}/deactivate/`,

    NoPagedList: `${apiUrl}clients/data/no-paged-list/`,
    byRuc: (ruc: string) => `${apiUrl}clients/data/by-ruc/?ruc=${ruc}`,

    //No esta en swagger
    creditStatus: (uuid: string | number) =>
      `${apiUrl}clients/data/${uuid}/credit-status/`,

    contacts: {
      list: (clientUuid: string | number) =>
        `${apiUrl}clients/data/${clientUuid}/contacts/`,

      create: (clientUuid: string | number) =>
        `${apiUrl}clients/data/${clientUuid}/contacts/`,

      update: (clientUuid: string | number, contactUuid: string | number) =>
        `${apiUrl}clients/data/${clientUuid}/contacts/${contactUuid}/`,

      activate: (clientUuid: string | number, contactUuid: string | number) =>
        `${apiUrl}clients/data/${clientUuid}/contacts/${contactUuid}/activate/`,

      deactivate: (clientUuid: string | number, contactUuid: string | number) =>
        `${apiUrl}clients/data/${clientUuid}/contacts/${contactUuid}/deactivate/`,

      noPagedByClient: (uuid: string) =>
        `${apiUrl}clients/data/${uuid}/contacts/no-paged-list/`

      // list: (clientUuid: string | number) =>
      //   `${apiUrl}clients/data/${clientUuid}/contacts/`,
      // create: (clientUuid: string | number) =>
      //   `${apiUrl}clients/data/${clientUuid}/contacts/`,
      // update: (clientUuid: string | number, contactUuid: string | number) =>
      //   `${apiUrl}clients/data/${clientUuid}/contacts/${contactUuid}/`,
      // activate: (uuid: string | number) =>
      //   `${apiUrl}clients/data/${uuid}/activate/`,
      // deactivate: (uuid: string | number) =>
      //   `${apiUrl}clients/data/${uuid}/deactivate/`,
      //   noPagedByClient: (uuid: string) =>
      //     `${apiUrl}clients/data/${uuid}/contacts/no-paged-list/`
      // },
    }
  },
  /* -------------------- FACTURAS -------------------- */
  invoices: {
    list: (page: string, filter?: string) =>
      `${apiUrl}billing/invoices/?page=${page}${filter ? `&${filter}` : ''}`,
    create: `${apiUrl}billing/invoices/`,
    retrieve: (uuid: string | number, flags?: string) =>
      `${apiUrl}billing/invoices/${uuid}/${flags ? qs(flags) : ''}`,
    put: (uuid: string | number) => `${apiUrl}billing/invoices/${uuid}/`,
    postFactura: `${apiUrl}facturas/`,
    patch: (uuid: string | number) => `${apiUrl}billing/invoices/${uuid}/`,
    delete: (uuid: string | number) => `${apiUrl}billing/invoices/${uuid}/`,
    noPaged: `${apiUrl}billing/invoices/no-paged/`,
    // acciones habituales
    pdf: (uuid: string | number) => `${apiUrl}billing/invoices/${uuid}/pdf/`,
    sendEmail: (uuid: string | number) =>
      `${apiUrl}billing/invoices/${uuid}/send-email/`,
    pay: (uuid: string | number) => `${apiUrl}billing/invoices/${uuid}/pay/`,
    changeStatus: (uuid: string | number) =>
      `${apiUrl}billing/invoices/${uuid}/change-status/`,
    exportExcel: (filter?: string) =>
      `${apiUrl}billing/invoices/export-excel/${qs(filter)}`,
    // yearRange: 'billing/invoices/year-range/', // 🔗 nuevo endpoint para rango de años

    //NUEVO ENDPOINT PARA IMPORTAR XML
    importXml: (uuid: string | number) =>
      `${apiUrl}billing/invoices/${uuid}/import-xml/`
  },

  /* -------------------- MOVIMIENTOS BANCARIOS -------------------- */ //FALTA ACTUALIZAR EN EL BACK
  bankMovements: {
    list: (page: string, filter?: string) =>
      `${apiUrl}finance/bank-movements/?page=${page}${
        filter ? `&${filter}` : ''
      }`,
    create: `${apiUrl}finance/bank-movements/`,
    retrieve: (uuid: string | number, flags?: string) =>
      `${apiUrl}finance/bank-movements/${uuid}/${flags ? qs(flags) : ''}`,
    put: (uuid: string | number) => `${apiUrl}finance/bank-movements/${uuid}/`,
    patch: (uuid: string | number) =>
      `${apiUrl}finance/bank-movements/${uuid}/`,
    delete: (uuid: string | number) =>
      `${apiUrl}finance/bank-movements/${uuid}/`,
    noPaged: `${apiUrl}finance/bank-movements/no-paged/`,
    reconcile: (uuid: string | number) =>
      `${apiUrl}finance/bank-movements/${uuid}/reconcile/`,
    importCsv: `${apiUrl}finance/bank-movements/import-csv/`,
    exportExcel: (filter?: string) =>
      `${apiUrl}finance/bank-movements/export-excel/${qs(filter)}`
  },

  /* -------------------- COTIZACIONES -------------------- */

  quotations: {
    list: (page: string, filter?: string) =>
      `${apiUrl}quotations/data/?page=${page}${filter ? `&${filter}` : ''}`,
    create: `${apiUrl}quotations/data/`,
    retrieve: (uuid: string, option?: string) =>
      `${apiUrl}quotations/data/${uuid}/${option ? `?option=${option}` : ''}`,
    put: (uuid: string) => `${apiUrl}quotations/data/${uuid}/`,
    patch: (uuid: string) => `${apiUrl}quotations/data/${uuid}/`,
    confirm: (uuid: string, action: string) =>
      `${apiUrl}quotations/data/${uuid}/${action}/`,
    delete: (uuid: string) => `${apiUrl}quotations/data/${uuid}/`,
    noPaged: `${apiUrl}quotations/data/no-paged/`,
    nextSerial: `${apiUrl}quotations/data/next-quotation-nr/`,
    nextSerialUuid: (uuid?: string) =>
      `${apiUrl}quotations/data/next-quotation-nr/${
        uuid ? `?uuid=${uuid}` : ''
      }`,
    paymentMethod: `${apiUrl}quotations/data/payment-methods/`,
    exportPdf: (uuid: string) => `${apiUrl}quotations/data/${uuid}/export-pdf/`,
    leadTimes: `${apiUrl}quotations/data/lead-times/`,
    years: `${apiUrl}quotations/data/years/`,
    status: `${apiUrl}quotations/data/status/`,
    templates: {
      quotations:{
        templateDefault:`${apiUrl}templates-quotations/data/template-default/`
      },
      quotationTemplate: `${apiUrl}quotations/data/templates/quotation-template/`,
      quotationHtml: (uuid: string) =>
        `${apiUrl}quotations/data/${uuid}/quotation-html/`
    },
    changeStatus: (uuid: string) =>
      `${apiUrl}quotations/data/${uuid}/change-status/`
  },

  /* -------------------- COTIZACIONES ANTERIOR -------------------- */
  // quotations: {
  //   list: (page: string, filter?: string) =>
  //     `${apiUrl}sales/quotations/?page=${page}${filter ? `&${filter}` : ''}`,
  //   create: `${apiUrl}sales/quotations/`,
  //   retrieve: (id: string | number, flags?: string) =>
  //     `${apiUrl}sales/quotations/${id}/${flags ? qs(flags) : ''}`,
  //   put: (id: string | number) => `${apiUrl}sales/quotations/${id}/`,
  //   patch: (id: string | number) => `${apiUrl}sales/quotations/${id}/`,
  //   delete: (id: string | number) => `${apiUrl}sales/quotations/${id}/`,
  //   noPaged: `${apiUrl}sales/quotations/no-paged/`,
  //   // acciones habituales
  //   approve: (id: string | number) =>
  //     `${apiUrl}sales/quotations/${id}/approve/`,
  //   reject: (id: string | number) => `${apiUrl}sales/quotations/${id}/reject/`,
  //   toInvoice: (id: string | number) =>
  //     `${apiUrl}sales/quotations/${id}/to-invoice/`,
  //   sendEmail: (id: string | number) =>
  //     `${apiUrl}sales/quotations/${id}/send-email/`,
  //   pdf: (id: string | number) => `${apiUrl}sales/quotations/${id}/pdf/`,
  //   exportExcel: (filter?: string) =>
  //     `${apiUrl}sales/quotations/export-excel/${qs(filter)}`,

  //   // -------- NUEVOS ------
  //   nextSerial: `${apiUrl}quotations/data/next-quotation-nr/`
  // },

  // ------ CONDICIONES -----
  condiciones: {
    list: (page: string, filter?: string) =>
      `${apiUrl}condiciones/data/?page=${page}${filter ? `&${filter}` : ''}`,
    listNoPaged: (filter?: string) =>
      `${apiUrl}condiciones/data/list-no-paged/?${filter ? `&${filter}` : ''}`,

    create: `${apiUrl}condiciones/data/`,

    retrieve: (id: string | number) => `${apiUrl}condiciones/data/${id}/`,

    put: (id: string | number) => `${apiUrl}condiciones/data/${id}/`,

    patch: (id: string | number) => `${apiUrl}condiciones/data/${id}/`,

    noPaged: `${apiUrl}condiciones/data/no-paged/`,
    default: `${apiUrl}condiciones/data/default/`
  },

  /* -------------------- MAIN DATA -------------------- */
  mainData: {
    money: {
      list: () => `${apiUrl}main-data/money/`, // GET listado
      create: `${apiUrl}main-data/money/`, // POST crear
      retrieve: (uuid: string) => `${apiUrl}main-data/money/${uuid}/`, // GET detalle
      patch: (uuid: string) => `${apiUrl}main-data/money/${uuid}/`, // PATCH editar
      update: (uuid: string) => `${apiUrl}main-data/money/${uuid}/`, // PUT editar
      delete: (uuid: string) => `${apiUrl}main-data/money/${uuid}/`, // DELETE
      noPaged: `${apiUrl}main-data/money/no-paged/`, // GET lista sin paginación
      noPagedComplete: `${apiUrl}main-data/money/no-paged/?option=complete`
    },
    exchange: {
      latest: `${apiUrl}main-data/exchange/latest/`,
      byMoney: (uuid: string) => `${apiUrl}main-data/exchange/${uuid}/by-money/`
    },

    /* -------------------- BANCOS -------------------- */
    bancos: {
      list: () => `${apiUrl}main-data/bank/`, // GET listado
      create: `${apiUrl}main-data/bank/`, // POST crear
      retrieve: (uuid: string) => `${apiUrl}main-data/bank/${uuid}/`,
      patch: (uuid: string) => `${apiUrl}main-data/bank/${uuid}/`,
      update: (uuid: string) => `${apiUrl}main-data/bank/${uuid}/`,
      delete: (uuid: string) => `${apiUrl}main-data/bank/${uuid}/` //DESACTIVAR
    },

    /* -------------------- UNIDAD DE MEDIDA -------------------- */
    unidadMedida: {
      list: (page: string, filter?: string) =>
        `${apiUrl}main-data/unidad-medida/?page=${page}${
          filter ? `&${filter}` : ''
        }`,
      create: `${apiUrl}main-data/unidad-medida/`,
      retrieve: (uuid: string) => `${apiUrl}main-data/unidad-medida/${uuid}/`,
      patch: (uuid: string) => `${apiUrl}main-data/unidad-medida/${uuid}/`,
      put: (uuid: string) => `${apiUrl}main-data/unidad-medida/${uuid}/`,
      delete: (uuid: string) => `${apiUrl}main-data/unidad-medida/${uuid}/`,
      noPaged: `${apiUrl}main-data/unidad-medida/no-paged/`,
      tc: `${apiUrl}main-data/unidad-medida/tc/`
    },
    detraction: {
      percent: `${apiUrl}main-data/invoices/detraction-percent/`
    }
  },

  /* -------------------- BANCOS -------------------- */
  bancos: {
    list: () => `${apiUrl}main-data/bank/`, // GET listado
    create: `${apiUrl}main-data/bank/`, // POST crear
    retrieve: (uuid: string) => `${apiUrl}main-data/bank/${uuid}/`,
    patch: (uuid: string) => `${apiUrl}main-data/bank/${uuid}/`,
    update: (uuid: string) => `${apiUrl}main-data/bank/${uuid}/`,
    delete: (uuid: string) => `${apiUrl}main-data/bank/${uuid}/` //DESACTIVAR
  },

  /* -------------------- UNIDAD DE MEDIDA -------------------- */
  unidadMedida: {
    list: (page: string, filter?: string) =>
      `${apiUrl}main-data/unidad-medida/?page=${page}${
        filter ? `&${filter}` : ''
      }`,
    create: `${apiUrl}main-data/unidad-medida/`,
    retrieve: (uuid: string) => `${apiUrl}main-data/unidad-medida/${uuid}/`,
    patch: (uuid: string) => `${apiUrl}main-data/unidad-medida/${uuid}/`,
    put: (uuid: string) => `${apiUrl}main-data/unidad-medida/${uuid}/`,
    delete: (uuid: string) => `${apiUrl}main-data/unidad-medida/${uuid}/`,
    noPaged: `${apiUrl}main-data/unidad-medida/no-paged/`,
    tc: `${apiUrl}main-data/unidad-medida/tc/`
  },
  productos: {
    list: (page: string, filter?: string) =>
      `${apiUrl}productos/data/?page=${page}${filter ? `&${filter}` : ''}`,
    create: `${apiUrl}productos/data/`,
    retrieve: (id: string | number, flag?: string) =>
      `${apiUrl}productos/data/${id}/${flag ? `?flag=${flag}` : ''}`,
    patch: (id: string | number) => `${apiUrl}productos/data/${id}/`,
    put: (id: string | number) => `${apiUrl}productos/data/${id}/`,
    cambiarEstado: (id: string | number) =>
      `${apiUrl}productos/data/${id}/cambiar-estado/`,
    noPaged: `${apiUrl}productos/data/no-paged/`
  },
  empresa: {
    publica: {
      list: `${apiUrl}enterprise/enterprise/public/`,
      empresaNoPaged: `${apiUrl}enterprise/enterprise/no-paged/`
    }
  }
}

export default endPoints
