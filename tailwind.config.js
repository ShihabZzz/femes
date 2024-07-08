/** @type {import('tailwindcss').Config} */
import daisyui from "daisyui"
export default {
  content: [
    "./*.html",
    "./**/*.{html,js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      height: {
        '98': '25rem',
        '9/10': '90%',
      },
      width: {
        '90': '22rem',
      },
      gridTemplateColumns: {
        '2-20/80': '20% 80%',
      },
      screens: {
        'xs': '360px',
        '3xl': '1720px',
      },
    },
  },
  plugins: [
    daisyui,
  ],
  daisyui: {
    themes: [
      "light",
      "dark",
      "cupcake",
      "bumblebee",
      "emerald",
      "corporate",
      "synthwave",
      "retro",
      "cyberpunk",
      "valentine",
      "halloween",
      "garden",
      "forest",
      "aqua",
      "lofi",
      "pastel",
      "fantasy",
      "wireframe",
      "black",
      "luxury",
      "dracula",
      "cmyk",
      "autumn",
      "business",
      "acid",
      "lemonade",
      "night",
      "coffee",
      "winter",
      "dim",
      "nord",
      "sunset",
    ],
  },
  // darkMode: ['class', '[data-theme="night"]']
}

