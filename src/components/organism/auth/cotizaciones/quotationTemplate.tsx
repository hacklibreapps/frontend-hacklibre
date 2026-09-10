'use client'

import PageTitle from '@/components/atom/auth/structures/pageTitlte'
import GoBack from '@/components/atom/goback'
import PageContainer from '@/components/atom/structures/containers/pageContainer'
import PageContent from '@/components/atom/structures/containers/pageContent'
import { ToastNotification } from '@/components/atom/structures/toast'
import { useAuth } from '@/context/authContext'
import { QuotationTemplateInterface } from '@/interfaces/querys/queryInterface'
import { ApiFecthAuth } from '@/services/auth/axios/apiFetchAuth'
import endPoints from '@/services/auth/endPoints/endPoint'
import GrapesHtmlEditor from '@/services/editor/qtnEditor'
import { prefix } from '@/services/envs/envs'
import { useEffect, useState } from 'react'

const EditQuotationTemplate = () => {
  const { token, enterprise, ready } = useAuth()

  const [templates, setTemplates] = useState<QuotationTemplateInterface | null>(
    null
  )

  useEffect(() => {
    if (!ready || !token || !enterprise) return

    const fetchData = async () => {
      try {
        const data = await getData(token)

        if (data?.props?.templates) setTemplates(data.props.templates)
      } catch (error) {
        ToastNotification('danger', `Ha ocurrido un error - ${error}`)
      }
    }

    fetchData()

    // if (changeConfirmed) setChangeConfirmed(false)
    // if (changeAccepted) setChangeAccepted(false)
    // if (changeVoid) setChangeVoid(false)
    // if (changeReject) setChangeReject(false)
  }, [token, enterprise, ready])
  useEffect(() => {
    if (templates) {
      console.log('data.props.templates', templates.contenido)
    }
  }, [templates])

  const headerPredeterminado = `
    <div style="padding: 20px; background: #f5f5f5;">
      <img src="{{ empresa.logo.url }}" width="150" />
      <h2>Cotización N/ {{ cotizacion.quotation_nr|stringformat:"05d" }}</h2>
    </div>
  `

  const footerPredeterminado = `
    <div style="padding: 20px; font-size: 12px; text-align: center;">
      © {{ empresa.nombre }} - Todos los derechos reservados.
    </div>
  `

  const handleSave = async (value: {
    html: string
    css: string
    fullHtml: string
  }) => {
    console.log('HTML editable:', value.html)
    console.log('CSS:', value.css)
    console.log('HTML completo:', value.fullHtml)

    // Aquí haces tu PATCH/PUT a DRF
    // Normalmente guardarías solo:
    // contenido: value.html
    // css: value.css
  }

  return (
    <PageContainer>
      <PageTitle description='Plantilla de cotización' />

      <GoBack enlace={`${prefix}/cotizaciones/`} />
      <PageContent>
        <GrapesHtmlEditor
          html={templates ? templates.contenido : ''}
          headerHtml={headerPredeterminado}
          footerHtml={footerPredeterminado}
          onSave={handleSave}
        />
      </PageContent>
    </PageContainer>
  )
}
export { EditQuotationTemplate }

async function getData(token: string | null): Promise<{
  props: {
    templates: QuotationTemplateInterface | null
  }
}> {
  if (!token) {
    return { props: { templates: null } }
  }

  const templates = await ApiFecthAuth(
    endPoints.quotations.templates.quotations.templateDefault,
    token
  )

  return {
    props: {
      templates: templates.data
    }
  }
}
