/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { Editor } from '@tinymce/tinymce-react'
import type { Editor as TinyMCEEditor } from 'tinymce'
import { useCallback } from 'react'
import { apiUrl } from './envs/connectionUrl'

interface TinyMCEEditorProps {
  value?: string // 👈 cambiamos initialValue por value
  onChange?: (content: string) => void
  height?: number
  tinyMceRef?: React.MutableRefObject<TinyMCEEditor | null>
}

const TinyEditor: React.FC<TinyMCEEditorProps> = ({
  value = '',
  onChange,
  height,
  tinyMceRef
}) => {
  const he = height ?? 500

  const handleEditorChange = useCallback(
    (content: string) => {
      if (onChange && typeof onChange === 'function') {
        onChange(content)
      }
    },
    [onChange]
  )

  return (
    <div className='w-full'>
      <Editor
        tinymceScriptSrc={`/tinymce/tinymce.min.js`}
        apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY ?? 'no-api-key'}
        licenseKey='gpl'
        /** ⚙️ Aquí el cambio principal */
        value={value}
        onEditorChange={handleEditorChange}
        onInit={(_, editor) => {
          if (tinyMceRef) {
            tinyMceRef.current = editor as any
          }
        }}
        init={{
          height: he,
          menubar: true,
          language: 'es',
          language_url: `/tinymce/langs/es.js`,
          plugins: [
            'advlist',
            'autolink',
            'lists',
            'link',
            'image',
            'charmap',
            'preview',
            'searchreplace',
            'visualblocks',
            'code',
            'fullscreen',
            'insertdatetime',
            'media',
            'table',
            'wordcount'
          ],
          toolbar:
            'undo redo fullscreen |' +
            'formatselect | fontsize | lineheight | ' +
            'bold italic underline strikethrough removeformat ' +
            'forecolor backcolor |' +
            'alignleft aligncenter alignright alignjustify ' +
            'bullist numlist checklist outdent indent | ' +
            'link unlink ' +
            'image editimage ' +
            'media | ' +
            'table tableinsertdialog tableprops | ' +
            'charmap ' +
            'searchreplace visualblocks visualchars ' +
            'code sourcecode preview',
          automatic_uploads: true,
          images_upload_url: `${apiUrl}website/auth/upload-image/upload/`,
          file_picker_types: 'file',
          file_picker_callback: (callback, _value, meta) => {
            const input = document.createElement('input')
            input.type = 'file'

            if (meta.filetype === 'image') input.accept = 'image/*'
            else if (meta.filetype === 'media') input.accept = 'video/*,audio/*'
            else input.accept = '.pdf,.docx,.xlsx,.pptx'

            input.onchange = function () {
              const file = (this as HTMLInputElement).files?.[0]
              if (!file) return
              const formData = new FormData()
              formData.append('file', file)

              fetch(`${apiUrl}website/auth/upload-image/upload-file/`, {
                method: 'POST',
                body: formData
              })
                .then((res) => res.json())
                .then((data) => callback(data.location, { text: file.name }))
                .catch(() => alert('Error al subir el archivo'))
            }
            input.click()
          }
        }}
      />
    </div>
  )
}

export default TinyEditor
