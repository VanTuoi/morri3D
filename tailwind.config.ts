import { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,css}', './index.css'],
  theme: {
    extend: {
      colors: {},
      borderRadius: {
        DEFAULT: 'var(--radius)'
      }
    }
  },
  plugins: []
}

export default config
