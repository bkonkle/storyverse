/* eslint-disable @typescript-eslint/no-var-requires */
const {appRootPath} = require('@nrwl/workspace/src/utils/app-root')
const colors = require('tailwindcss/colors')

const {
  PURGE_MATCH_FILES,
} = require(`${appRootPath}/tools/config/tailwind/definitions`)
const configTailwind = require(`${appRootPath}/tools/config/tailwind`)

module.exports = configTailwind({
  purge: [`${__dirname}/src/${PURGE_MATCH_FILES}`],
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      black: colors.black,
      white: colors.white,
      gray: colors.trueGray,
      teal: colors.teal,
    },
  },
})
