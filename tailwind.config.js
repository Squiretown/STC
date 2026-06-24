/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          900: '#0a0f1f',
          800: '#0d1426',
          700: '#131c31',
          600: '#1a2540',
        },
        ink: {
          900: '#0a0f1f',
          600: '#475569',
          500: '#64748b',
        },
        paper: '#f7f9fc',
        line: '#e6ebf2',
        'blue-soft': 'rgba(37,99,235,0.10)',
        'blue-glow': 'rgba(37,99,235,0.45)',
        'line-dark': 'rgba(255,255,255,0.08)',
        'line-dark-strong': 'rgba(255,255,255,0.14)',
      },
      fontFamily: {
        display: ['"Inter Tight"', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        card: '14px',
        input: '10px',
      },
      fontSize: {
        eyebrow: ['12px', { letterSpacing: '0.14em', fontWeight: '600' }],
      },
    },
  },
  plugins: [],
};
