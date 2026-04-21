/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // NCBA Official Color Palette - Complete with variants
        'ncb': {
          // Primary Blue
          'blue': '#3AB3E5',
          'blue-light': '#6BC5ED',
          'blue-dark': '#2A8CB5',
          'blue-50': '#EBF7FD',
          'blue-100': '#D6EFF9',
          'blue-200': '#ADDEF4',
          'blue-300': '#85CEEE',
          'blue-400': '#5CBDE9',
          'blue-500': '#3AB3E5',
          'blue-600': '#2E8FB7',
          'blue-700': '#236B8A',
          'blue-800': '#17485C',
          'blue-900': '#0C242E',
          
          // Headings and Overall Texts
          'heading': '#392030',
          'heading-light': '#5A3A4E',
          'heading-dark': '#1C1018',
          
          // Body Subtle Text
          'text': '#7F7F7F',
          'text-light': '#A0A0A0',
          'text-dark': '#5C5C5C',
          
          // Status/Brown
          'status': '#40322E',
          'status-light': '#6B5851',
          'status-dark': '#2B221F',
          'status-50': '#F5F3F2',
          'status-100': '#EBE6E4',
          'status-200': '#D6CDC9',
          'status-300': '#C2B4AE',
          'status-400': '#AD9B93',
          'status-500': '#40322E',
          'status-600': '#332825',
          'status-700': '#261E1C',
          'status-800': '#1A1412',
          'status-900': '#0D0A09',
          
          // Neutrals
          'white': '#FFFFFF',
          'lightbg': '#F8F9FA',
          'divider': '#E8E8E8',
        },
        
        // Functional colors
        'success': '#10B981',
        'success-light': '#34D399',
        'success-dark': '#059669',
        'warning': '#F59E0B',
        'warning-light': '#FBBF24',
        'warning-dark': '#D97706',
        'error': '#EF4444',
        'error-light': '#F87171',
        'error-dark': '#DC2626',
        'info': '#3AB3E5',
        
        // Neutral grays
        'gray': {
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#111827',
        },
      },
      fontSize: {
        'xxs': ['0.625rem', { lineHeight: '0.875rem' }],
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
      },
      fontFamily: {
        'sans': ['Century Gothic', 'CenturyGothic', 'AppleGothic', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'spin-slow': 'spin 2s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)',
        'card-hover': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05)',
        'dropdown': '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -4px rgba(0, 0, 0, 0.05)',
        'modal': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      },
      borderWidth: {
        '3': '3px',
      },
      backdropBlur: {
        'xs': '2px',
      },
    },
  },
  plugins: [],
}