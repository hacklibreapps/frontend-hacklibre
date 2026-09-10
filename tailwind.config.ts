// tailwind.config.ts
import type { Config } from 'tailwindcss'
import forms from '@tailwindcss/forms'

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        Cian2: '#c5e0e6',
        Cian4: '#67acbd',
        Cian7: '#0c6980',
        Cian8: '#0a586b',
        Green7: '#15a43e',
        Green8: '#118132',
        Green9: '#0d5f26',
        Green10: '#094d1c',
        Red7: '#990c2d',
        Red8: '#800a26',
        Red9: '#67081e',
        Red10: '#510618',
        Charcoal: '#313638', // BG principal
        Greys: '#e6e6e6'
      },
      
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        }
      },
      animation: {
        fadeIn: 'fadeIn 120ms ease-out'
      }
    }
  },
  plugins: [
    forms({ strategy: 'class' }) // usa .form-input, .form-select, etc.
  ]
}

export default config
