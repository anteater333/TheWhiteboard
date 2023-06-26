/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "!./node_modules",
  ],
  theme: {
    extend: {
      fontFamily: {
        galmuri: "Galmuri11",
      },
      animation: {
        type: "type 2.5s steps(20, end), blink .75s linear infinite alternate",
      },
      keyframes: {
        type: {
          from: { width: 0 },
          to: { width: "100%" },
        },
        blink: {
          "0%": { "border-color": "transparent" },
          "40%": { "border-color": "transparent" },
          "60%": { "border-color": "black" },
          "100%": { "border-color": "black" },
        },
      },
      boxShadow: {
        circle: "0px 4px 4px rgba(0, 0, 0, 0.25)",
      },
    },
  },
  plugins: [require("tailwind-scrollbar-hide")],
};
