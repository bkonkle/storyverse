/* eslint-disable @typescript-eslint/no-var-requires */
const colors = require('tailwindcss/colors')
const plugin = require('tailwindcss/plugin')
const {appRootPath} = require('@nrwl/workspace/src/utils/app-root')

const {
  PURGE_MATCH_FILES,
} = require(`${appRootPath}/tools/config/tailwind/definitions`)
const configTailwind = require(`${appRootPath}/tools/config/tailwind`)

module.exports = configTailwind({
  purge: [`${__dirname}/src/${PURGE_MATCH_FILES}`],
  theme: {
    colors,
  },
  plugins: [
    plugin(function ({addComponents, theme}) {
      const screens = theme('screens', {})
      addComponents([
        {
          '.container': {width: '100%'},
        },
        {
          [`@media (min-width: ${screens.sm})`]: {
            '.container': {
              'max-width': '640px',
            },
          },
        },
        {
          [`@media (min-width: ${screens.md})`]: {
            '.container': {
              'max-width': '768px',
            },
          },
        },
        {
          [`@media (min-width: ${screens.lg})`]: {
            '.container': {
              'max-width': '1024px',
            },
          },
        },
        {
          [`@media (min-width: ${screens.xl})`]: {
            '.container': {
              'max-width': '1280px',
            },
          },
        },
        {
          [`@media (min-width: ${screens['2xl']})`]: {
            '.container': {
              'max-width': '1280px',
            },
          },
        },
      ])
    }),
  ],
})
