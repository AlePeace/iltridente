/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./utils/**/*.js",
  ],
  theme: {
    extend: {
      fontFamily: {
        montecatini: ["var(--font-montecatini)", "serif"],
        nunito: ["var(--font-nunito)", "sans-serif"],
      },
      colors: {
        terracotta: "#FF9F51",
        red: "#C53452",
        green: "#57A691",
        ocra: "#EFAC53",
        blue: "#1F5189",
        lightgreen: "#A0B898",
        lightocra: "#FFAB67",
        lightblue: "#00ABD5",
        orangelogo: "#ee954c",
        gradientbrown: "#F3EADF",
        gray: "#434343",
        peach: "#FCD2B0",
        card: "#FF9E4E",
      },
    },
  },
  plugins: [],
};
