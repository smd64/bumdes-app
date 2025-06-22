/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // ✅ WAJIB untuk dark mode manual via class
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './apps/dashboard/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
