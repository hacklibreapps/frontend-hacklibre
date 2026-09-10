'use client'

import NewPath from '@/components/atom/auth/basic/newPath'
import PageTitle from '@/components/atom/auth/structures/pageTitlte'
import { StatusIconStates } from '@/components/atom/auth/structures/status/statusIcon'
import GoBack from '@/components/atom/goback'
import PageContainer from '@/components/atom/structures/containers/pageContainer'
import PageContent from '@/components/atom/structures/containers/pageContent'
import { ToastNotification } from '@/components/atom/structures/toast'
import { useAuth } from '@/context/authContext'
import {
  CotizacionInterface,
  TemplatesQuotationInterface
} from '@/interfaces/querys/queryInterface'
import { ApiFecthAuth } from '@/services/auth/axios/apiFetchAuth'
import { ApiPostAuth } from '@/services/auth/axios/apiPostAuth'
import endPoints from '@/services/auth/endPoints/endPoint'
import { prefix } from '@/services/envs/envs'
import { ValidateServerResponse } from '@/utils/validateServerResponse'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { BsCalendar2CheckFill } from 'react-icons/bs'
import { FaCheckCircle, FaDownload, FaTimesCircle } from 'react-icons/fa'
import { RxValueNone } from 'react-icons/rx'
import { VscIssueReopened } from 'react-icons/vsc'

const CotizacionesView: React.FC<{ uuid: string }> = ({ uuid }) => {
  const { token, enterprise, hasPermission, ready } = useAuth()
  const router = useRouter()

  const [cotizacion, setCotizacion] = useState<CotizacionInterface | null>(null)
  const [templates, setTemplates] =
    useState<TemplatesQuotationInterface | null>(null)

  // Flags
  const [changeConfirmed, setChangeConfirmed] = useState(false)
  const [changeAccepted, setChangeAccepted] = useState(false)
  const [changeVoid, setChangeVoid] = useState(false)
  const [changeReject, setChangeReject] = useState(false)
  const [loadingDownloadPdf, setLoadingDownloadPdf] = useState(false)
  // ------------------------------ ACTIONS ------------------------------
  const handleQtn = async (action: string) => {
    if (!token) {
      ToastNotification('danger', 'No hay sesión activa.')
      return
    }

    // REOPEN
    if (action === 'reopen' && cotizacion) {
      router.push(
        `/auth/cotizaciones/nuevo/?option=reopen&uuid=${cotizacion.uuid ?? ''}`
      )
      return
    }

    // OTRAS ACCIONES
    const response = await ApiPostAuth(
      endPoints.quotations.confirm(uuid, action),
      token,
      {}
    )

    if (response.success === true && response.status === 200) {
      if (action === 'confirm') setChangeConfirmed(true)
      if (action === 'accept') setChangeAccepted(true)
      if (action === 'reject') setChangeReject(true)
      if (action === 'void') setChangeVoid(true)
    }
  }

  // -------------------------- EXPORTAR PDF --------------------------
  const handleExportPDF = async () => {
    if (!token) {
      ToastNotification('danger', 'No hay sesión activa.')
      return
    }
    setLoadingDownloadPdf(true)
    try {
      const report = await ApiFecthAuth(
        endPoints.quotations.exportPdf(uuid),
        token,
        undefined,
        'application/pdf',
        'blob'
      )

      if (report && cotizacion) {
        const url = window.URL.createObjectURL(report.data)
        const link = document.createElement('a')
        link.href = url
        link.download = `${cotizacion.cotizacion}.pdf`
        document.body.appendChild(link)
        link.click()
        link.remove()
        window.URL.revokeObjectURL(url)
      } else {
        ToastNotification('warning', 'No hay reporte disponible para descargar')
      }
    } catch (error) {
      console.error('Error al exportar PDF:', error)
      ToastNotification('danger', `Hubo un error al generar el PDF. ${error}`)
    }
    setLoadingDownloadPdf(false)
  }

  // -------------------------- FETCH DATA --------------------------
  useEffect(() => {
    if (!ready || !token || !enterprise) return

    const fetchData = async () => {
      try {
        const data = await getData(uuid, token)

        if (data?.props?.cotizacion) setCotizacion(data.props.cotizacion)
        if (data?.props?.templates) setTemplates(data.props.templates)
      } catch (error) {
        ToastNotification('danger', `Ha ocurrido un error - ${error}`)
      }
    }

    fetchData()

    // Reset flags
    if (changeConfirmed) setChangeConfirmed(false)
    if (changeAccepted) setChangeAccepted(false)
    if (changeVoid) setChangeVoid(false)
    if (changeReject) setChangeReject(false)
  }, [
    uuid,
    token,
    enterprise,
    ready,
    changeConfirmed,
    changeAccepted,
    changeVoid,
    changeReject
  ])

  // --------------------------- BOTONES PERMISOS ---------------------------
  const newData = hasPermission('quotations.view_quotations') && (
    <div className='pb-6 lg:pb-2 w-full flex justify-center lg:justify-end'>
      <NewPath
        tooltip='Descargar PDF'
        icon={<FaDownload className='text-Red7' size={26} />}
        link='#'
        onClick={handleExportPDF}
        loading={loadingDownloadPdf}
      />
    </div>
  )

  const confirmQuotation = hasPermission('quotations.change_quotations') &&
    cotizacion?.status.key === 'DRAFT' && (
      <NewPath
        tooltip='Confirmar Cotización'
        icon={<BsCalendar2CheckFill className='text-Green7' size={26} />}
        link='#'
        onClick={() => handleQtn('confirm')}
      />
    )

  const acceptQuotation = hasPermission('quotations.change_quotations') &&
    cotizacion?.status.key === 'CONFIRM' && (
      <NewPath
        tooltip='Aceptar Cotización'
        icon={<FaCheckCircle className='text-Green10' size={26} />}
        link='#'
        onClick={() => handleQtn('accept')}
      />
    )

  const rejectedQuotation = hasPermission('quotations.change_quotations') &&
    cotizacion?.status.key === 'ACCEPTED' && (
      <NewPath
        tooltip='Rechazar Cotización'
        icon={<FaTimesCircle className='text-red-500' size={26} />}
        link='#'
        onClick={() => handleQtn('reject')}
      />
    )

  const reopenQuotation = hasPermission('quotations.change_quotations') &&
    cotizacion?.status.key === 'EXPIRED' && (
      <NewPath
        tooltip='Reabrir Cotización'
        icon={<VscIssueReopened className='text-orange-600' size={26} />}
        link='#'
        onClick={() => handleQtn('reopen')}
      />
    )

  const voidQuotation = hasPermission('quotations.change_quotations') &&
    cotizacion &&
    !['COMPLETED', 'CLOSED', 'EXPIRED', 'REJECTED', 'VOID'].includes(
      String(cotizacion.status.key)
    ) && (
      <NewPath
        tooltip='Anular Cotización'
        icon={<RxValueNone className='text-black' size={26} />}
        link='#'
        onClick={() => handleQtn('void')}
      />
    )
  useEffect(() => {
    if (templates) {
      console.log('templates', templates.html)
    }
  }, [templates])

  // --------------------------- RENDER ---------------------------
  return (
    <PageContainer>
      <PageTitle
        description='Detalle de la cotización'
        aditionalIcon={
          cotizacion && (
            <div className='border flex flex-row gap-2'>
              {newData}
              {confirmQuotation}
              {acceptQuotation}
              {rejectedQuotation}
              {reopenQuotation}
              {voidQuotation}
            </div>
          )
        }
      />

      <GoBack enlace={`${prefix}/cotizaciones/`} />

      <PageContent>
        <ValidateServerResponse<CotizacionInterface | null>
          model={cotizacion}
          exceptionNr={401}
          loadingMessage='Cargando cotización...'
          searchField='cotizacion'
        >
          {cotizacion && templates?.html && (
            <>
              <div
                className='w-full mx-auto mb-2'
                style={{
                  maxWidth: '210mm',
                  boxSizing: 'border-box'
                }}
              >
                <StatusIconStates
                  status={cotizacion.status.key.toString()}
                  labelActivo={cotizacion.status.value}
                  full={true}
                />
              </div>

              <div
                dangerouslySetInnerHTML={{ __html: templates.html }}
                className='prose mx-auto bg-white shadow-md rounded-md overflow-hidden'
                style={{ maxWidth: '210mm', boxSizing: 'border-box' }}
              />
            </>
          )}
        </ValidateServerResponse>
      </PageContent>
    </PageContainer>
  )
}

export default CotizacionesView

// ---------------------------- DATA FETCHER ----------------------------
async function getData(
  uuid: string,
  token: string | null
): Promise<{
  props: {
    cotizacion: CotizacionInterface | null
    templates: TemplatesQuotationInterface | null
  }
}> {
  if (!token) {
    return { props: { cotizacion: null, templates: null } }
  }

  const cotizacion = await ApiFecthAuth(
    endPoints.quotations.retrieve(uuid),
    token
  )
  const templates = await ApiFecthAuth(
    endPoints.quotations.templates.quotationHtml(uuid),
    token
  )

  return {
    props: {
      cotizacion: cotizacion.data,
      templates: templates.data
    }
  }
}
