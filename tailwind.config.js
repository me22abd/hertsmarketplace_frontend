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
        primary: {
          DEFAULT: '#7C3AED',
          dark: '#6D28D9',
          light: '#8B5CF6',
        },
        text: {
          primary: '#0F172A',
          secondary: '#64748B',
        },
        bg: {
          DEFAULT: '#F9FAFB',
          white: '#FFFFFF',
        },
        status: {
          available: '#10B981',
          reserved: '#F59E0B',
          sold: '#EF4444',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 2px 8px rgba(0, 0, 0, 0.08)',
        'card-hover': '0 4px 12px rgba(124, 58, 237, 0.15)',
      },
    },
  },
  plugins: [],
}
