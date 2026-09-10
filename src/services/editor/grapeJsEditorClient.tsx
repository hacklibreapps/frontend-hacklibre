'use client'

import { useEffect, useRef, useState } from 'react'
import grapesjs, { type Editor } from 'grapesjs'

export interface GrapesHtmlEditorValue {
  html: string
  css: string
  fullHtml: string
}

const REQUIRED_EDITOR_CSS = `
@font-face {
    font-family: 'Gilroy';
    src: url('/fonts/gilroy/Gilroy-Regular.otf') format('opentype');
    font-weight: 400;
    font-style: normal;
  }

  @font-face {
    font-family: 'Gilroy';
    src: url('/fonts/gilroy/Gilroy-Medium.otf') format('opentype');
    font-weight: 500;
    font-style: normal;
  }

  @font-face {
    font-family: 'Gilroy';
    src: url('/fonts/gilroy/Gilroy-Semibold.otf') format('opentype');
    font-weight: 600;
    font-style: normal;
  }

  @font-face {
    font-family: 'Gilroy';
    src: url('/fonts/gilroy/Gilroy-Bold.otf') format('opentype');
    font-weight: 700;
    font-style: normal;
  }
  body, p, td, th, div, h1, h2, h3 {
    font-family: 'Gilroy', Arial, sans-serif;
    color: #333;
    box-sizing: border-box;
  }

  h1, h2, h3 {
    font-weight: 700;
  }

  table {
    border-collapse: collapse;
  }

  .a4-page {
    width: 794px;
    min-height: 1123px;
    margin: 0 auto;
    background: #ffffff;
    box-sizing: border-box;
  }

  [data-template-body="true"] {
    min-height: 600px;
  }

  .avoid-break {
    page-break-inside: avoid;
    break-inside: avoid;
  }
`

export interface GrapesHtmlEditorBlock {
  id: string
  label: string
  category: string
  content: string
}

export interface GrapesHtmlEditorClientProps {
  html: string
  css?: string
  headerHtml?: string
  footerHtml?: string
  height?: string
  title?: string
  blocks?: GrapesHtmlEditorBlock[]
  onSave: (value: GrapesHtmlEditorValue) => void | Promise<void>
  onChange?: (value: GrapesHtmlEditorValue) => void
}

const defaultBlocks: GrapesHtmlEditorBlock[] = [
  {
    id: 'cliente',
    label: 'Cliente',
    category: 'Variables',
    content: '{{ cotizacion.client.complete_company_name }}'
  },
  {
    id: 'numero-cotizacion',
    label: 'N° Cotización',
    category: 'Variables',
    content: '{{ cotizacion.quotation_nr|stringformat:"05d" }}'
  },
  {
    id: 'fecha-emision',
    label: 'Fecha',
    category: 'Variables',
    content: '{{ cotizacion.fecha_emision }}'
  },
  {
    id: 'total',
    label: 'Total',
    category: 'Variables',
    content: '{{ cotizacion.moneda.sign }} {{ cotizacion.total|formato_miles }}'
  },
  {
    id: 'parrafo',
    label: 'Párrafo',
    category: 'Contenido',
    content: '<p>Escriba aquí su contenido...</p>'
  }
]

const buildEditorHtml = ({
  html,
  headerHtml,
  footerHtml
}: {
  html: string
  headerHtml: string
  footerHtml: string
}) => {
  return `
    <div class="a4-page">
      <div
        data-gjs-selectable="false"
        data-gjs-draggable="false"
        data-gjs-droppable="false"
        data-gjs-copyable="false"
        data-gjs-removable="false"
        data-gjs-editable="false"
      >
        ${headerHtml}
      </div>

      <main data-template-body="true">
        ${html}
      </main>

      <div
        data-gjs-selectable="false"
        data-gjs-draggable="false"
        data-gjs-droppable="false"
        data-gjs-copyable="false"
        data-gjs-removable="false"
        data-gjs-editable="false"
      >
        ${footerHtml}
      </div>
    </div>
  `
}

const extractBodyHtml = (editorHtml: string): string => {
  const parser = new DOMParser()
  const documentHtml = parser.parseFromString(editorHtml, 'text/html')
  const bodyElement = documentHtml.querySelector('[data-template-body="true"]')

  return bodyElement?.innerHTML.trim() ?? editorHtml
}

const buildFullHtml = ({
  headerHtml,
  bodyHtml,
  footerHtml
}: {
  headerHtml: string
  bodyHtml: string
  footerHtml: string
}) => {
  return `
    ${headerHtml}
    ${bodyHtml}
    ${footerHtml}
  `
}
const injectRequiredCss = (editor: Editor) => {
  const canvasDocument = editor.Canvas.getDocument()

  if (!canvasDocument) return

  const previousStyle = canvasDocument.getElementById('required-editor-css')

  if (previousStyle) {
    previousStyle.remove()
  }

  const styleElement = canvasDocument.createElement('style')
  styleElement.id = 'required-editor-css'
  styleElement.innerHTML = `
${REQUIRED_EDITOR_CSS}

/* ============================= */
/* Estilos adicionales GrapesJS  */
/* ============================= */

.a4-page {
  border: 1px solid #d4d4d4;
  box-shadow: 0 0 15px rgba(0,0,0,.08);
}

.gjs-selected {
  outline: 2px solid #3b82f6 !important;
}

.gjs-hovered {
  outline: 1px dashed #3b82f6 !important;
}
`

  canvasDocument.head.appendChild(styleElement)
}

const GrapesHtmlEditorClient = ({
  html,
  css = '',
  headerHtml = '',
  footerHtml = '',
  height = 'calc(100vh - 56px)',
  title = 'Editor visual',
  blocks = defaultBlocks,
  onSave,
  onChange
}: GrapesHtmlEditorClientProps) => {
  const editorRef = useRef<Editor | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)

  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!containerRef.current || editorRef.current) return

    const editor = grapesjs.init({
      container: containerRef.current,
      height,
      width: '100%',
      fromElement: false,
      storageManager: false,

      noticeOnUnload: false,

      selectorManager: {
        componentFirst: true
      },

      canvas: {
        styles: [],
        scripts: []
      },

      deviceManager: {
        devices: [
          {
            id: 'a4-v',
            name: 'A4 Vertical',
            width: '794px',
            height: '1123px',
            widthMedia: '794px'
          },
          {
            id: 'a4-h',
            name: 'A4 Horizontal',
            width: '1123px',
            height: '794px',
            widthMedia: '1123px'
          }
        ]
      },

      blockManager: {
        appendTo: '.gjs-blocks-c'
      },

      styleManager: {
        sectors: [
          {
            id: 'general',
            name: 'General',
            open: true,
            buildProps: [
              'display',
              'position',
              'width',
              'height',
              'margin',
              'padding',
              'background-color'
            ]
          },
          {
            id: 'typography',
            name: 'Tipografía',
            open: true,
            buildProps: [
              'font-family',
              'font-size',
              'font-weight',
              'letter-spacing',
              'color',
              'text-align',
              'line-height'
            ]
          },
          {
            id: 'decorations',
            name: 'Decoración',
            open: false,
            buildProps: ['border', 'border-radius', 'box-shadow', 'opacity']
          }
        ]
      },

      components: buildEditorHtml({
        html,
        headerHtml,
        footerHtml
      }),

      style: css
    })

    editor.setDevice('A4 Vertical')

    editor.on('load', () => {
      injectRequiredCss(editor)

      // console.log('Canvas listo')

      // console.log(editor.Canvas.getDocument())

      // console.log(editor.getHtml())

      // console.log(editor.getCss())
    })
    blocks.forEach((block) => {
      editor.BlockManager.add(block.id, {
        label: block.label,
        category: block.category,
        content: block.content
      })
    })

    editor.on('update', () => {
      if (!onChange) return

      const currentHtml = editor.getHtml()
      const currentBodyHtml = extractBodyHtml(currentHtml)
      const currentCss = editor.getCss() ?? ''

      onChange({
        html: currentBodyHtml,
        css: currentCss,
        fullHtml: buildFullHtml({
          headerHtml,
          bodyHtml: currentBodyHtml,
          footerHtml
        })
      })
    })

    editorRef.current = editor

    return () => {
      editor.destroy()
      editorRef.current = null
    }
  }, [html, css, headerHtml, footerHtml, height, blocks, onChange])

  const handleSave = async () => {
    const editor = editorRef.current
    if (!editor) return

    setSaving(true)

    try {
      const editorHtml = editor.getHtml()
      const bodyHtml = extractBodyHtml(editorHtml)
      const editorCss = editor.getCss() ?? ''

      await onSave({
        html: bodyHtml,
        css: editorCss,
        fullHtml: buildFullHtml({
          headerHtml,
          bodyHtml,
          footerHtml
        })
      })
    } finally {
      setSaving(false)
    }
  }
  return (
    <div className='h-screen w-full bg-white'>
      <div className='flex h-14 items-center justify-between border-b px-4'>
        <h1 className='text-sm font-semibold'>{title}</h1>

        <button
          type='button'
          onClick={handleSave}
          disabled={saving}
          className='rounded bg-black px-4 py-2 text-sm text-white disabled:cursor-not-allowed disabled:opacity-50'
        >
          {saving ? 'Guardando...' : 'Guardar'}
        </button>
      </div>

      <div ref={containerRef} />
    </div>
  )
}

export default GrapesHtmlEditorClient
