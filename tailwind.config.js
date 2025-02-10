/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./renderer/**/*.{html,js,jsx}",
    "./src/**/*.{html,js,jsx,css}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2563eb',
          dark: '#1d4ed8',
        },
        secondary: {
          DEFAULT: '#64748b',
          dark: '#475569',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
