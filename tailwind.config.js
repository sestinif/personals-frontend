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
        /* ===== "Dark raffinato" palette ===== */
        bg: '#0B0B0D',          // page background (near-black)
        surface: '#15151A',      // card / surface
        surface2: '#1C1C22',     // elevated: inputs / hover / modal
        line: 'rgba(255,255,255,0.08)',      // default border
        'line-strong': 'rgba(255,255,255,0.14)', // emphasis border
        ink: '#F4F3F1',          // text primary (ivory)
        'ink-dim': '#A8A6A2',    // text secondary (muted)
        'ink-faint': '#7A7880',  // text tertiary (hint)
        accent: '#8B7BFF',       // violet accent / primary
        'accent-strong': '#7C5CFC', // violet strong (button)
        pos: '#34D399',          // positive / gain (emerald)
        neg: '#FB7185',          // negative / destructive (rose)

        /* brand scale remapped to the violet accent so every existing
           brand-* utility adopts the new accent automatically */
        brand: {
          50: '#f1efff',
          100: '#e6e2ff',
          200: '#d0c8ff',
          300: '#b3a6ff',
          400: '#8B7BFF',
          500: '#8B7BFF',
          600: '#7C5CFC',
          700: '#6B49E8',
          800: '#5739c2',
          900: '#3d2a85',
          950: '#1f1547',
        },
      },
      boxShadow: {
        'glass': '0 0 0 1px rgba(255,255,255,0.06), 0 8px 40px rgba(0,0,0,0.35)',
        'card': '0 1px 2px rgba(0,0,0,0.3)',
        'card-hover': '0 12px 40px rgba(0,0,0,0.45), 0 2px 8px rgba(0,0,0,0.3)',
        'premium': '0 24px 60px -16px rgba(0, 0, 0, 0.6)',
        'glow': '0 0 0 1px rgba(139, 123, 255, 0.18)',
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
