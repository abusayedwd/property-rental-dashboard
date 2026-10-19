/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primaryBg: "#00BF63",
        primaryBgDark: "#059347",
        primarySoft: "#E6F9EF",
        whiteText: "#FFFFFF",
        navy: "#222F55",
        navyDark: "#171F3D",
        surface: "#F5F7FB",
      },
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(16, 24, 40, 0.04), 0 1px 3px rgba(16, 24, 40, 0.06)",
      },
    },
  },
  plugins: [],
};
