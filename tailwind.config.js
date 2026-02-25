/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: '#0a1628',
        'navy-light': '#0f2040',
        'navy-row': '#0d1b32',
        'navy-row-alt': '#0f2040',
        gold: '#c9a84c',
        'gold-light': '#d4b85c',
        'gold-muted': 'rgba(201, 168, 76, 0.18)',
        'gold-border': 'rgba(201, 168, 76, 0.18)',
      },
      fontFamily: {
        serif: ['"DM Serif Display"', 'Georgia', 'serif'],
        mono: ['"DM Mono"', 'ui-monospace', 'monospace'],
        sans: ['"Instrument Sans"', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-out',
        'fade-up': 'fadeUp 0.5s ease-out both',
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
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #c9a84c 0%, #d4b85c 50%, #c9a84c 100%)',
      },
    },
  },
  plugins: [],
};
