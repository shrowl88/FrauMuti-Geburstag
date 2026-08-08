/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        serif: ["Playfair Display", "serif"],
        script: ["Dancing Script", "cursive"],
        sans: ["Montserrat", "sans-serif"],
        fredoka: ["Fredoka", "sans-serif"],
      },
      colors: {
        "rose-soft": "#FFE4E6",
        "rose-deep": "#9F1239",
        gold: "#D4AF37",
      },
      animation: {
        flicker: "flicker 0.5s infinite alternate",
        float: "float 6s ease-in-out infinite",
      },
      keyframes: {
        flicker: {
          "0%, 100%": { opacity: 1, transform: "scale(1)" },
          "50%": { opacity: 0.8, transform: "scale(1.1)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-20px)" },
        },
      },
    },
  },
  plugins: [],
};
