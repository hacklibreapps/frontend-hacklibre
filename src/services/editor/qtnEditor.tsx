'use client'

import dynamic from 'next/dynamic'
import { GrapesHtmlEditorClientProps } from './grapeJsEditorClient'


const GrapesHtmlEditorClient = dynamic<GrapesHtmlEditorClientProps>(
  () => import('@/services/editor/grapeJsEditorClient'),
  {
    ssr: false,
    loading: () => (
      <div className='p-6 text-sm text-gray-500'>Cargando editor visual...</div>
    )
  }
)

const GrapesHtmlEditor = (props: GrapesHtmlEditorClientProps) => {
  return <GrapesHtmlEditorClient {...props} />
}

export default GrapesHtmlEditor
