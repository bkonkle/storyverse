const {PURGE_MATCH_FILES} = require('./tools/config/tailwind/definitions')

module.exports = {
  purge: [`${__dirname}/libs/shared/components/src/${PURGE_MATCH_FILES}`],
  darkMode: false, // or 'media' or 'class'
  variants: {
    extend: {},
  },
  plugins: [require('@tailwindcss/forms')],
}
