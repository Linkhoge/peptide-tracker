/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#0a0a0a',
          card: '#111111',
          hover: '#1a1a1a',
          border: '#262626',
        },
        accent: {
          primary: '#a855f7',
          secondary: '#ec4899',
        },
      },
    },
  },
  plugins: [],
}