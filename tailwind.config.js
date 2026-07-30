/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        retailBlue: '#1b365d',
        retailDark: '#0f172a',
        retailBg: '#f8fafc'
      }
    },
  },
  plugins: [],
}
