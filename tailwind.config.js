/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontSize: {
        'elderly-sm': ['20px', '28px'],
        'elderly-base': ['26px', '34px'],
        'elderly-lg': ['30px', '38px'],
        'elderly-xl': ['36px', '44px'],
        'elderly-2xl': ['42px', '50px'],
        'elderly-3xl': ['52px', '60px'],
      },
      colors: {
        'primary-green': '#059669',
        'elderly-text': '#1f2937',
        'elderly-bg': '#f9fafb',
      },
      spacing: {
        'touch': '56px',
        'comfortable': '28px',
      },
    },
  },
  plugins: [],
} 