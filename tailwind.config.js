/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#9A46CF',
          dark: '#7B37A6',
          light: '#B366E0',
        },
        text: {
          primary: '#0F172A',
          secondary: '#64748B',
        },
        bg: {
          DEFAULT: '#F1F5F9',
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
        'card-hover': '0 4px 12px rgba(154, 70, 207, 0.15)',
      },
    },
  },
  plugins: [],
}
