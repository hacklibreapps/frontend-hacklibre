'use client'

import { useEffect, useRef } from 'react'
import grapesjs, { Editor } from 'grapesjs'

import grapesjsCustomCode from 'grapesjs-custom-code'
import grapesjsPresetWebpage from 'grapesjs-preset-webpage'
import grapesjsPluginForms from 'grapesjs-plugin-forms'
import grapesjsPluginExport from 'grapesjs-plugin-export'
import grapesjsStyleBg from 'grapesjs-style-bg'
import grapesjsStyleGradient from 'grapesjs-style-gradient'
import grapesjsStyleFilter from 'grapesjs-style-filter'
import grapesjsClick from 'grapesjs-click'
import grapesjsBlocksBasic from 'grapesjs-blocks-basic'
import grapesjsBlocksFlexBox from 'grapesjs-blocks-flexbox'
import { PiFilePdfFill } from 'react-icons/pi'
import { renderToStaticMarkup } from 'react-dom/server'
import 'grapesjs/dist/css/grapes.min.css'

interface GrapesEditorProps {
  value?: string
  onChange?: (html: string, css: string) => void
  height?: number
}

const GrapesEditor = ({ value, onChange, height = 800 }: GrapesEditorProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const editorRef = useRef<Editor | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (editorRef.current) return
    const container = containerRef.current
    if (!container) return

    const editor = grapesjs.init({
      container,
      height: `${height}px`,
      width: '100%',
      storageManager: false,
      fromElement: false,
      plugins: [
        grapesjsBlocksBasic,
        grapesjsPresetWebpage,
        grapesjsPluginForms,
        grapesjsCustomCode,
        grapesjsPluginExport,
        grapesjsStyleBg,
        grapesjsStyleGradient,
        grapesjsStyleFilter,
        grapesjsBlocksFlexBox,
        grapesjsClick
      ],
      deviceManager: {
        devices: [
          {
            id: 'a4',
            name: 'PDF A4',
            width: '210mm',
            height: '297mm'
          }
        ]
      },
      i18n: {
        locale: 'es',
        messages: {
          es: {
            assetManager: {
              addButton: 'Añadir imagen',
              inputPlh: 'URL de la imagen',
              modalTitle: 'Seleccionar imagen'
            },
            blockManager: {
              labels: {
                section: 'Sección',
                text: 'Texto',
                image: 'Imagen',
                video: 'Video',
                map: 'Mapa',
                link: 'Enlace',
                button: 'Botón',
                quote: 'Cita',
                header: 'Encabezado',
                footer: 'Pie de página',
                list: 'Lista',
                form: 'Formulario'
              },
              categories: {
                basic: 'Básicos',
                form: 'Formulario',
                layout: 'Estructura',
                extra: 'Avanzados'
              }
            },
            traitManager: { label: 'Propiedades' },
            styleManager: {
              empty: 'Selecciona un elemento para editar estilos'
            }
          }
        }
      }
    })

    // 🩵 Esperar a que el editor termine de cargar para acceder al iframe
    editor.on('load', () => {
      const doc = editor.Canvas.getDocument()
      if (!doc) return
      const iframeHead = doc.head

      // 🩵 Inyectar el CSS base dentro del iframe del canvas
      const styleTag = document.createElement('style')
      styleTag.innerHTML = `
        .gjs-dashed {
          outline: 1px dashed rgba(160, 160, 160, 0.8);
          outline-offset: -1px;
        }
        [data-gjs-type="default"] { display: block; }
        [data-gjs-type="text"] { display: inline-block; }
        [data-gjs-type="flex"] { display: flex; }
      `
      iframeHead.appendChild(styleTag)

      // 🩵 Activar modo edición visual (líneas guías)
      editor.Canvas.getBody().classList.add('gjs-dashed')
    })

    // Botón PDF A4 con icono
    editor.Panels.removeButton('devices-c', 'set-device-desktop')
    editor.Panels.removeButton('devices-c', 'set-device-tablet')
    editor.Panels.removeButton('devices-c', 'set-device-mobile')

    const iconHTML = renderToStaticMarkup(
      <PiFilePdfFill color='#800a26' size={22} />
    )

    editor.Panels.addButton('devices-c', {
      id: 'set-device-a4',
      label: iconHTML,
      command: 'set-device-a4',
      active: true,
      attributes: { title: 'Tamaño PDF A4 (vertical)' }
    })

    editor.Commands.add('set-device-a4', {
      run: (ed) => ed.setDevice('PDF A4')
    })

    // Bloques personalizados
    const bm = editor.BlockManager
    bm.add('quotation-title', {
      label: 'Titulo de Cotización',
      category: 'Estructura',
      content: '{{short_quotation}}'
    })

    editor.Panels.getButton('views', 'open-blocks')?.set('active', true)
    bm.render()

    if (value) {
      try {
        const parsed = JSON.parse(value)
        if (parsed.html) editor.setComponents(parsed.html)
        if (parsed.css) editor.setStyle(parsed.css)
      } catch {
        editor.setComponents(value)
      }
    }

    editor.on('update', () => {
      const html = editor.getHtml() ?? ''
      const css = editor.getCss() ?? ''
      onChange?.(html, css)
    })

    editorRef.current = editor

    return () => {
      editor.destroy()
      editorRef.current = null
    }
  }, [height, onChange, value])

  return (
    <div className='w-full border border-gray-300 rounded-md overflow-hidden bg-white'>
      <div ref={containerRef} className='min-h-[800px]' />
    </div>
  )
}

export default GrapesEditor
