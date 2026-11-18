const plugin = require('tailwindcss/plugin');

module.exports = {
  darkMode: 'class',
  content: [
    './index.html',
    './pages/**/*.html',
    './src/**/*.{html,js,ts,vue}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0fdf9',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
          950: '#042f2e',
        },
        sunset: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
          950: '#431407',
        },
        forest: {
          50: '#f2f7f4',
          100: '#e1ede5',
          200: '#c5dccd',
          300: '#9bc2aa',
          400: '#6ea283',
          500: '#4d8565',
          600: '#3a6a4f',
          700: '#2f5541',
          800: '#274435',
          900: '#20382c',
          950: '#101f18',
        },
        earth: {
          50: '#faf8f5',
          100: '#f3efe8',
          200: '#e5ddd0',
          300: '#d4c5b0',
          400: '#bfa78a',
          500: '#ad8f6e',
          600: '#9f7c5c',
          700: '#84654d',
          800: '#6d5342',
          900: '#594537',
          950: '#30241c',
        },
        semantic: {
          success: {
            light: '#d1fae5',
            DEFAULT: '#10b981',
            dark: '#065f46',
          },
          warning: {
            light: '#fef3c7',
            DEFAULT: '#f59e0b',
            dark: '#92400e',
          },
          error: {
            light: '#fee2e2',
            DEFAULT: '#ef4444',
            dark: '#991b1b',
          },
          info: {
            light: '#e0f2fe',
            DEFAULT: '#0284c7',
            dark: '#075985',
          },
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        glow: '0 0 25px -5px rgba(20, 184, 166, 0.4)',
        'glow-sunset': '0 0 25px -5px rgba(249, 115, 22, 0.4)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'slide-up': 'slideUp 0.4s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/container-queries'),
    plugin(function({ addUtilities }) {
      addUtilities({
        '.glass-card': {
          'background': 'rgba(255, 255, 255, 0.8)',
          'backdrop-filter': 'blur(16px)',
          '-webkit-backdrop-filter': 'blur(16px)',
          'border': '1px solid rgba(255, 255, 255, 0.4)',
        },
        '.glass-card-dark': {
          'background': 'rgba(15, 23, 42, 0.8)',
          'backdrop-filter': 'blur(16px)',
          '-webkit-backdrop-filter': 'blur(16px)',
          'border': '1px solid rgba(255, 255, 255, 0.08)',
        },
        '.scrollbar-custom': {
          '&::-webkit-scrollbar': {
            width: '6px',
            height: '6px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#cbd5e1',
            borderRadius: '9999px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: '#94a3b8',
          },
        },
      });
    }),
  ],
};
