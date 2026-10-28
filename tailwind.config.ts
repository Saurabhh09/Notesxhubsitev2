import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{ts,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        // Brand navy & sky palette
        sky: {
          50: '#F0F8FF',
          100: '#E0F0FE',
          200: '#BAE0FD',
          300: '#7CC4FA',
          400: '#38A4F7',
          500: '#2598F5', // Signature creative hero sky blue from reference
          600: '#157EE0',
          700: '#1064B8',
          800: '#115293',
          900: '#144577',
        },
        ink: {
          50: '#EEF4FA',
          100: '#D6E4F1',
          200: '#A9C4DF',
          300: '#7BA3CC',
          400: '#4C7FB4',
          500: '#2A619B',
          600: '#1B4A7A',
          700: '#17457A',
          800: '#101B3D', // Deep navy matching reference text
          900: '#0C152E',
          950: '#060B18',
        },
        // Warm cream tones for paper & section transitions
        cream: {
          50: '#FFFEFA',
          100: '#FFFDF6', // Primary warm cream section background
          200: '#FFF9ED',
          300: '#FFF3DD',
          400: '#FDEBC8',
          500: '#F7DBA7',
        },
        // Reference pastel category card colors
        pastel: {
          yellow: '#FFF4D3',
          'yellow-border': '#FFE7A5',
          'yellow-text': '#8A6805',
          blue: '#E3F0FF',
          'blue-border': '#CBE4FF',
          'blue-text': '#145EA8',
          peach: '#FFEBE8',
          'peach-border': '#FFD6CF',
          'peach-text': '#9E3224',
          mint: '#E4F7EC',
          'mint-border': '#C5F0D5',
          'mint-text': '#1B733E',
          lavender: '#F1ECFE',
          'lavender-border': '#DFD3FC',
          'lavender-text': '#5E35B1',
        },
        sunshine: {
          200: '#FFF385',
          300: '#FFE959', // Reference "breakthrough" highlight yellow
          400: '#FFDE38',
          500: '#F5BE0B',
        },
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
        brass: {
          300: '#E2C583',
          400: '#CFA84F',
          500: '#B08A2E',
          600: '#8E6D21',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'Plus Jakarta Sans', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'Plus Jakarta Sans', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        handwriting: ['var(--font-handwriting)', 'Caveat', 'Patrick Hand', 'Comic Sans MS', 'cursive'],
      },
      letterSpacing: {
        tightest: '-0.045em',
      },
      boxShadow: {
        card: '0 2px 8px -2px rgba(16, 27, 61, 0.06), 0 12px 32px -12px rgba(16, 27, 61, 0.1)',
        lift: '0 4px 12px -2px rgba(16, 27, 61, 0.08), 0 20px 48px -14px rgba(16, 27, 61, 0.18)',
        pill: '0 8px 30px -4px rgba(16, 27, 61, 0.12), 0 2px 6px -1px rgba(16, 27, 61, 0.06)',
        inset: 'inset 0 1px 0 rgba(255,255,255,0.6)',
        device: '0 25px 60px -15px rgba(16, 27, 61, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.2)',
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
        'float-slow': {
          '0%, 100%': { transform: 'translateY(0px) rotate(var(--tw-rotate, 0deg))' },
          '50%': { transform: 'translateY(-8px) rotate(var(--tw-rotate, 0deg))' },
        },
        'float-alt': {
          '0%, 100%': { transform: 'translateY(0px) rotate(var(--tw-rotate, 0deg))' },
          '50%': { transform: 'translateY(6px) rotate(var(--tw-rotate, 0deg))' },
        },
        shimmer: { '100%': { transform: 'translateX(100%)' } },
      },
      animation: {
        'fade-up': 'fade-up 0.6s cubic-bezier(0.22, 1, 0.36, 1) both',
        'fade-in': 'fade-in 0.4s ease-out both',
        'float-slow': 'float-slow 6s ease-in-out infinite',
        'float-alt': 'float-alt 7s ease-in-out infinite',
      },
      maxWidth: { content: '1240px' },
    },
  },
  plugins: [],
}

export default config
