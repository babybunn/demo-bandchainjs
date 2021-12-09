const colors = require("tailwindcss/colors");
module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: false, // or 'media' or 'class'
  // theme: {
  //   extend: {},

  // },
  theme: {
    fontFamily: {
      sans: ["Poppins", "ui-sans-serif", "system-ui"],
      serif: ["Poppins", "ui-serif", "Georgia"],
      mono: ["ui-monospace", "SFMono-Regular"],
      display: ["Poppins", "sans-serif"],
      body: ["Poppins", "sans-serif"],
      poppins: ["Poppins", "sans-serif"],
    },
    fontWeight: {
      light: 300,
      normal: 600,
      medium: 600,
      semibold: 600,
      bold: 900,
      extrabold: 900,
      "extra-bold": 900,
      black: 900,
    },
    textColor: (theme) => theme("colors"),
    colors: {
      transparent: "transparent",
      current: "currentColor",
      black: colors.black,
      white: colors.white,
      gray: colors.trueGray,
      indigo: colors.indigo,
      red: colors.rose,
      yellow: colors.amber,
      pink: colors.pink,
      purple: colors.violet,
      blue: {
        light: "#464cf2",
        DEFAULT: "#1820ef",
        dark: "#151cd7",
      },
      orange: {
        light: "#ff837a",
        DEFAULT: "#ff4e42",
        dark: "#e5463b",
      },
      warmGray: colors.warmGray,
    },
    extend: {
      boxShadow: {
        blue: "0 4px 14px 0 rgba(19, 51, 81, 0.39)",
        indigo:
          "0 10px 15px -3px rgba(199, 210, 254, 0.1), 0 4px 6px -2px rgba(199, 210, 254, 0.3)",
      },
    },
  },
  variants: {
    extend: {
      opacity: ["disabled"],
      transform: ["hover", "focus"],
      borderWidth: ["hover", "focus"],
      visibility: ["hover", "focus", "group-hover"],
    },
  },
  plugins: [],
};
