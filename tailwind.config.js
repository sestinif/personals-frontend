/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      colors: {
        /* ===== Mercury dark palette (same token names, new values) ===== */
        bg: '#14141B',          // page background
        surface: '#1B1B24',      // card / surface
        surface2: '#23232E',     // elevated: inputs / hover / modal
        line: 'rgba(255,255,255,0.08)',      // default border (1px)
        'line-strong': 'rgba(255,255,255,0.16)', // emphasis border
        ink: '#EDEDF3',          // text primary
        'ink-dim': '#9A9AA8',    // text secondary
        'ink-faint': '#9A9AA8',  // text tertiary (single secondary grey)
        accent: '#8D9BFF',       // indigo accent / primary
        'accent-strong': '#8D9BFF', // flat: same indigo
        pos: '#4FD1A1',          // positive / gain
        neg: '#F58A9B',          // negative / destructive

        /* distribution tones — indigo + grey, assigned by position */
        'tone-1': '#8D9BFF',
        'tone-2': '#5F69B8',
        'tone-3': '#3D4272',
        'tone-mute': '#6B6B7B',

        /* brand scale remapped to indigo so every brand-* utility adopts it */
        brand: {
          50: '#23232E',
          100: '#23232E',
          200: '#5F69B8',
          300: '#8D9BFF',
          400: '#8D9BFF',
          500: '#8D9BFF',
          600: '#8D9BFF',
          700: '#A3AEFF',
          800: '#5F69B8',
          900: '#3D4272',
          950: '#23232E',
        },
      },
      boxShadow: {
        'card': 'none',
        'sheet': '0 16px 48px rgba(0,0,0,0.5)',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'fade-up': 'fadeUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'scale-in': 'scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-in-right': 'slideInRight 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'shimmer': 'shimmer 2s linear infinite',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
        'count': 'count 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'bar-grow': 'barGrow 1s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(-8px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        barGrow: {
          '0%': { transform: 'scaleX(0)' },
          '100%': { transform: 'scaleX(1)' },
        },
      },
    },
  },
  plugins: [],
}
