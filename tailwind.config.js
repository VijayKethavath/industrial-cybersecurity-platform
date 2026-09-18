/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand
        brand: {
          DEFAULT: '#F97316',
          50:  '#FFF7ED',
          100: '#FFEDD5',
          200: '#FED7AA',
          300: '#FDBA74',
          400: '#FB923C',
          500: '#F97316',
          600: '#EA580C',
          700: '#C2410C',
          800: '#9A3412',
          900: '#7C2D12',
        },
        // Severity
        severity: {
          critical: '#DC2626',
          high:     '#F97316',
          medium:   '#EAB308',
          low:      '#3B82F6',
          info:     '#6B7280',
          unknown:  '#9CA3AF',
        },
        // Status
        status: {
          online:   '#16A34A',
          offline:  '#DC2626',
          degraded: '#EAB308',
          unknown:  '#9CA3AF',
        },
        // Surface
        surface: {
          bg:       '#F8FAFC',
          card:     '#FFFFFF',
          border:   '#E2E8F0',
          divider:  '#F1F5F9',
        },
        // Sidebar
        sidebar: {
          bg:       '#0F1117',
          hover:    '#1E2230',
          active:   '#1E2230',
          text:     '#94A3B8',
          'text-active': '#F8FAFC',
          border:   '#1E2230',
        },
        // Dark header
        header: {
          bg:    '#0F1117',
          text:  '#E2E8F0',
          border:'#1E2230',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      fontSize: {
        '2xs': ['0.65rem', { lineHeight: '1rem' }],
      },
      boxShadow: {
        card:  '0 1px 3px 0 rgba(0,0,0,0.07), 0 1px 2px -1px rgba(0,0,0,0.07)',
        panel: '0 4px 24px 0 rgba(0,0,0,0.12)',
        sm:    '0 1px 2px 0 rgba(0,0,0,0.05)',
      },
      borderRadius: {
        DEFAULT: '6px',
        sm: '4px',
        md: '6px',
        lg: '10px',
        xl: '14px',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.2s ease-in-out',
        'slide-in': 'slideIn 0.25s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateX(16px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
