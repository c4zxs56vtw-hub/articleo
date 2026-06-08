/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          light: '#f8fafc', // slate-50
          dark: '#0f172a',  // slate-900
          accent: '#312e81', // indigo-900
          textDark: '#1e293b', // slate-800
          textLight: '#64748b' // slate-500
        }
      }
    },
  },
  plugins: [],
}
