const colors = require('tailwindcss/colors')
module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  // theme: {
  //   extend: {},
    
  // },
  theme: {
    textColor: theme => theme('colors'),
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      black: colors.black,
      white: colors.white,
      gray: colors.trueGray,
      indigo: colors.indigo,
      red: colors.rose,
      yellow: colors.amber,
      pink: colors.pink,
      purple: colors.violet
    },
    extend: {
      boxShadow: {
        blue: '0 4px 14px 0 rgba(19, 51, 81, 0.39)',
        indigo: '0 10px 15px -3px rgba(199, 210, 254, 0.1), 0 4px 6px -2px rgba(199, 210, 254, 0.3)'
      }
    }
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
