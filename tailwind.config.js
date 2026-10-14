/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#0B0A08',
        foreground: '#F5F5F4',
        surface: {
          DEFAULT: '#14120E',
          subtle: '#181510',
          elevated: '#1F1B14',
          hover: '#2A241C',
        },
        border: {
          DEFAULT: '#29231D',
          hover: '#3D332A',
          focus: '#F59E0B',
        },
        primary: {
          DEFAULT: '#F59E0B',
          hover: '#D97706',
          active: '#B45309',
          foreground: '#0B0A08',
          subtle: '#2B1E07',
        },
        accent: {
          DEFAULT: '#FF8A00',
          hover: '#E06D00',
          foreground: '#FFFFFF',
        },
        muted: {
          DEFAULT: '#1E1A14',
          foreground: '#A8A29E',
        },
        card: {
          DEFAULT: '#14120E',
          foreground: '#F5F5F4',
        },
        popover: {
          DEFAULT: '#181510',
          foreground: '#F5F5F4',
        },
        destructive: {
          DEFAULT: '#EF4444',
          foreground: '#FFFFFF',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      animation: {
        shimmer: 'shimmer 2s infinite linear',
        pulseSlow: 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}


