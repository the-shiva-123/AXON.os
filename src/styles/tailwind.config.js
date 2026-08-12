/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        google: {
          blue: {
            DEFAULT: '#1A73E8',
            hover: '#1765CC',
            light: '#E8F0FE',
            dark: '#8AB4F8',
          },
          red: {
            DEFAULT: '#EA4335',
            light: '#FCE8E6',
            dark: '#F28B82',
          },
          yellow: {
            DEFAULT: '#FBBC04',
            light: '#FEF7E0',
            dark: '#FDD663',
          },
          green: {
            DEFAULT: '#34A853',
            light: '#E6F4EA',
            dark: '#81C995',
          },
          gray: {
            50: '#F8F9FA',
            100: '#F1F3F4',
            200: '#E8EAED',
            300: '#DADCE0',
            400: '#BDC1C6',
            500: '#9AA0A6',
            600: '#80868B',
            700: '#5F6368',
            800: '#3C4043',
            900: '#202124',
            950: '#171717',
          },
        },
      },
      fontFamily: {
        sans: [
          'Google Sans',
          'Roboto',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Arial',
          'sans-serif',
        ],
      },
      borderRadius: {
        'google-sm': '8px',
        'google-md': '12px',
        'google-lg': '16px',
        'google-xl': '24px',
        'google-pill': '9999px',
      },
      boxShadow: {
        'google-elevation-1': '0 1px 2px 0 rgba(60,64,67,0.3), 0 1px 3px 1px rgba(60,64,67,0.15)',
        'google-elevation-2': '0 1px 3px 0 rgba(60,64,67,0.3), 0 4px 8px 3px rgba(60,64,67,0.15)',
        'google-elevation-3': '0 2px 6px 2px rgba(60,64,67,0.15), 0 8px 12px 6px rgba(60,64,67,0.15)',
        'google-glow': '0 0 24px -4px rgba(26, 115, 232, 0.35)',
      },
      animation: {
        'float-slow': 'float 6s ease-in-out infinite',
        'pulse-subtle': 'pulseSubtle 4s ease-in-out infinite',
        'spin-slow': 'spin 20s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '0.9' },
          '50%': { opacity: '0.6' },
        },
      },
    },
  },
  plugins: [],
};
