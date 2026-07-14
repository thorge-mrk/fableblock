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
        // FableBlock "dark glass" design tokens — deliberately NOT the
        // Mojang inventory grey; teal accent + warm amber highlights.
        'mc-dark': '#10161e',
        'mc-slot-dark': '#0c1218',
        'vc-bg': '#101720',
        'vc-panel': '#151e29',
        'vc-slot': '#1a2432',
        'vc-slot-edge': '#2c3b4e',
        'vc-accent': '#2dd4bf',
        'vc-accent-soft': '#1b4f4a',
        'vc-amber': '#f5b942',
        'vc-text-dim': '#8fa3b8',
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
