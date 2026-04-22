/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Noto Serif SC"', '"Source Han Serif"', 'serif'],
        sans: ['"PingFang SC"', '"Noto Sans SC"', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
