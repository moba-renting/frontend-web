/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // Habilitar el modo oscuro basado en clases
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Esto cubre todos los archivos de React en la carpeta src
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2ECC71',      // Claro
          dark: '#145A32',         // Oscuro
        },
        secondary: {
          DEFAULT: '#1B263B',      // Claro
          dark: '#95A5A6',         // Oscuro
        },
        background: {
          DEFAULT: '#FFFFFF',      // Claro
          dark: '#1B263B',         // Oscuro
        },
        text: {
          DEFAULT: '#1B263B',      // Claro
          dark: '#FFFFFF',         // Oscuro
        },
        brand: {
          greenMint: '#2ECC71',
          greenForest: '#145A32',
          blueNavy: '#1B263B',
          graySteel: '#95A5A6',
          white: '#FFFFFF',
        },
      },
      fontFamily: {
        primary: ["Poppins", "sans-serif"],   // Fuente principal
        secondary: ["Inter", "sans-serif"],  // Fuente secundaria
        manrope: ["Manrope", "sans-serif"],
        inter: ["Inter", "sans-serif"],
        poppins: ["Poppins", "sans-serif"],
        montserrat: ["Montserrat", "sans-serif"],
        roboto: ["Roboto", "sans-serif"],
        source: ["Source Sans Pro", "sans-serif"],
        exo: ["Exo 2", "sans-serif"],
      },
    },
  },
  plugins: [],
}