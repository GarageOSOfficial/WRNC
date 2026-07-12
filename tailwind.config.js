module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#f0f7ff",
          100: "#e0efff",
          500: "#0066cc",
          600: "#0052a3",
          700: "#003d7a"
        },
        neutral: {
          50: "#f9fafb",
          100: "#f3f4f6",
          900: "#111827"
        }
      },
      fontSize: {
        xs: "11px",
        sm: "13px",
        base: "16px",
        lg: "18px",
        xl: "20px",
        "2xl": "24px"
      }
    }
  },
  plugins: []
};
