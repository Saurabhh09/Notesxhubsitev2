import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{ts,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        // Brand navy, sampled from the NotesXhub wordmark.
        ink: {
          50: '#EEF4FA',
          100: '#D6E4F1',
          200: '#A9C4DF',
          300: '#7BA3CC',
          400: '#4C7FB4',
          500: '#2A619B',
          600: '#1B4A7A',
          700: '#17457A',
          800: '#123253',
          900: '#0D2439',
          950: '#081724',
        },
        // Paper tones, sampled from the logo's textured stock.
        paper: {
          50: '#FCFBF8',
          100: '#F6F3ED',
          200: '#EDE8DE',
          300: '#DED7C8',
          400: '#C4BBA7',
        },
        graphite: {
          400: '#8A8B8E',
          500: '#6B6C6F',
          600: '#58595B',
          700: '#414244',
          800: '#2C2D2F',
        },
        // Sparing brass accent for prices, badges and marks of quality.
        brass: {
          300: '#E2C583',
          400: '#CFA84F',
          500: '#B08A2E',
          600: '#8E6D21',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'ui-serif', 'Georgia', 'serif'],
      },
      letterSpacing: {
        tightest: '-0.045em',
      },
      boxShadow: {
        card: '0 1px 2px rgba(13, 36, 57, 0.05), 0 8px 24px -12px rgba(13, 36, 57, 0.14)',
        lift: '0 2px 4px rgba(13, 36, 57, 0.06), 0 18px 40px -16px rgba(13, 36, 57, 0.22)',
        inset: 'inset 0 1px 0 rgba(255,255,255,0.6)',
      },
      backgroundImage: {
        'paper-grain':
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E\")",
      },
      keyframes: {
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(14px)' },
          to: { opacity: '1', transform: 'none' },
        },
        'fade-in': { from: { opacity: '0' }, to: { opacity: '1' } },
        shimmer: { '100%': { transform: 'translateX(100%)' } },
      },
      animation: {
        'fade-up': 'fade-up 0.6s cubic-bezier(0.22, 1, 0.36, 1) both',
        'fade-in': 'fade-in 0.4s ease-out both',
      },
      maxWidth: { content: '1240px' },
    },
  },
  plugins: [],
}

export default config
