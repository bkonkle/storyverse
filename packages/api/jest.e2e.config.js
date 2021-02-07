const baseConfig = require('../../jest.config')

module.exports = {
  ...baseConfig,
  testRegex: '/__tests__/.+\\.e2e\\.(js|ts)$',
}
