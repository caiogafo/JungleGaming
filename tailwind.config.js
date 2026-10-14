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
        background: '#151312',
        foreground: '#F3EFEA',
        surface: {
          DEFAULT: '#1B1917',
          subtle: '#1F1D1B',
          elevated: '#242220',
          hover: '#2C2926',
          cream: '#ECE5DC',
        },
        border: {
          DEFAULT: '#282522',
          hover: '#3D3833',
          focus: '#D98A53',
          hero: '#2A303A',
        },
        primary: {
          DEFAULT: '#D98A53',
          hover: '#E59864',
          active: '#C27540',
          foreground: '#151312',
          subtle: '#2B1E14',
        },
        accent: {
          DEFAULT: '#D98A53',
          hover: '#E59864',
          foreground: '#151312',
        },
        muted: {
          DEFAULT: '#1F1D1B',
          foreground: '#9E968F',
        },
        card: {
          DEFAULT: '#1B1917',
          foreground: '#F3EFEA',
        },
        popover: {
          DEFAULT: '#1F1D1B',
          foreground: '#F3EFEA',
        },
        destructive: {
          DEFAULT: '#EF4444',
          foreground: '#FFFFFF',
        },
        kurio: {
          bg: '#151312',
          card: '#1B1917',
          cream: '#ECE5DC',
          orange: '#D98A53',
          orangeHover: '#E59864',
          border: '#282522',
          heroBorder: '#2A303A',
          text: '#F3EFEA',
          muted: '#9E968F',
          dim: '#756E67',
        },
      },
      fontFamily: {
        sans: ['Space Grotesk', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['Space Mono', 'JetBrains Mono', 'monospace'],
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


