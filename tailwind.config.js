/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      keyframes: {
        'pulse-glow': {
          '0%, 100%': {
            boxShadow: '0 0 5px #ec4899, 0 0 10px #ec4899, 0 0 15px #ec4899'
          },
          '50%': {
            boxShadow: '0 0 10px #ec4899, 0 0 20px #ec4899, 0 0 30px #ec4899'
          }
        }
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite'
      }
    },
  },
  plugins: [],
};
