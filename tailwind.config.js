module.exports = {
  purge: {
    enabled: process.env.NODE_ENV === 'production',
    content: [`${__dirname}/libs/shared/components/src/**/*.{js,ts,jsx,tsx}`],
  },
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
