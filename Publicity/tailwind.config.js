/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          maroon: "#800000",
          brown: "#f7a306",
          green: "#089000",
        },
      },
      fontFamily: {
        futura: ["Futura", "sans-serif"],
      },
    },
  },
  plugins: [],
}

