const baseConfig = require('../../jest.config')

module.exports = {
  ...baseConfig,
  testRegex: '/__tests__/.+\\.integration\\.(js|ts)$',
}
