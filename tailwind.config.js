const plugin = require('tailwindcss/plugin');

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './index.html',
    './pages/**/*.html',
    './src/**/*.{html,js,ts}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
          950: '#1e1b4b',
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
            DEFAULT: '#0ea5e9',
            dark: '#075985',
          },
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        glow: '0 0 25px -5px rgba(99, 102, 241, 0.4)',
        'glow-pink': '0 0 25px -5px rgba(236, 72, 153, 0.4)',
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
    // Custom plugin for utilities as required in Task 4.4
    plugin(function({ addUtilities, matchUtilities, theme }) {
      addUtilities({
        '.glass-card': {
          'background': 'rgba(255, 255, 255, 0.75)',
          'backdrop-filter': 'blur(16px)',
          '-webkit-backdrop-filter': 'blur(16px)',
          'border': '1px solid rgba(255, 255, 255, 0.3)',
        },
        '.glass-card-dark': {
          'background': 'rgba(15, 23, 42, 0.75)',
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
          '.dark &::-webkit-scrollbar-thumb': {
            background: '#334155',
          },
          '.dark &::-webkit-scrollbar-thumb:hover': {
            background: '#475569',
          },
        },
        '.text-balance': {
          'text-wrap': 'balance',
        },
      });
    }),
  ],
};
