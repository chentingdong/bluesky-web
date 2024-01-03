/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],  
  theme: {
    extend: {
      height: {
        '256': '256px',
        '512': '512px',
        '768': '768px',
      }
    },
  },
  plugins: [],
}

