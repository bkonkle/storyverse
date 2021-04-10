const {PURGE_MATCH_FILES} = require('./tools/config/tailwind/definitions')

module.exports = {
  purge: [`${__dirname}/libs/shared/components/src/${PURGE_MATCH_FILES}`],
  darkMode: false, // or 'media' or 'class'
  variants: [
    'responsive',
    'group-hover',
    'focus-within',
    'first',
    'last',
    'odd',
    'even',
    'hover',
    'focus',
    'active',
    'visited',
    'disabled',
  ],
  plugins: [require('@tailwindcss/forms')],
}
