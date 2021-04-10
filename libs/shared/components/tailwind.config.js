/* eslint-disable @typescript-eslint/no-var-requires */
const rootConfig = require('../../../tailwind.config.js')

const localConfig = Object.assign(rootConfig, {
  purge: {
    enabled: process.env.NODE_ENV === 'production',
    content: [`${__dirname}/src/{components,pages}/**/*.{js,ts,jsx,tsx}`],
  },
})

module.exports = localConfig
