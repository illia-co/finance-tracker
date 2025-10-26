/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          400: '#60a5fa', // Lighter blue for dark theme
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
        success: {
          50: '#f0fdf4',
          400: '#4ade80', // Lighter green for dark theme
          500: '#22c55e',
          600: '#16a34a',
        },
        danger: {
          50: '#fef2f2',
          400: '#f87171', // Lighter red for dark theme
          500: '#ef4444',
          600: '#dc2626',
        },
      },
    },
  },
  plugins: [],
}
