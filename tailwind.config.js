/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
    colors: {
      primaryBg: '#2E7D32', 
       
    },
    fontSize : {
      'header': '32px'
    }
  },
  plugins: [],
}

