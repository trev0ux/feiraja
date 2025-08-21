import type { Config } from 'tailwindcss'

export default <Config>{
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './app.vue',
    './error.vue',
  ],
  theme: {
    extend: {
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          sm: '1rem',
          lg: '1rem',
          xl: '1rem',
          '2xl': '6rem',
        },
        screens: {
          sm: '640px',
          md: '768px',
          lg: '1024px',
          xl: '1440px',
          '2xl': '1600px',
        },
      },
      colors: {
        aux: {
          orange: '#FF6F00',
          black: '#2d2d2d',
          'light-yellow': '#FFF9EA',
          green: '#12A661',
          grey: '#E0E0E0',
        },
      },
      fontFamily: {
        grotesque: ['Bricolage Grotesque'],
      },
    },
  },
  plugins: [],
}
