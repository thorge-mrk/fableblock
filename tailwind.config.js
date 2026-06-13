/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        mono: ['"Courier New"', 'monospace'],
        game: ['"Segoe UI"', 'Verdana', 'sans-serif'],
      },
      colors: {
        'mc-dark': '#1d1d21',
        'mc-slot': '#8b8b8b',
        'mc-slot-dark': '#373737',
        'mc-slot-light': '#ffffff',
        'mc-panel': '#c6c6c6',
      },
      keyframes: {
        'pulse-fast': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.4' },
        },
      },
      animation: {
        'pulse-fast': 'pulse-fast 0.5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
