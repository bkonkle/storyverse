const path = require('path')

const babelConfig = path.resolve(__dirname, 'babel.config.js')

module.exports = {
  collectCoverageFrom: ['src/**/*.{js,jsx,ts,tsx,mjs}'],
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json'],
  testPathIgnorePatterns: ['/node_modules/', '/lib/', '/dist/'],
  testRegex: '(/(test|__tests__)/.*(\\.|/)(test|spec))\\.[j|t]sx?$',
  testURL: 'http://localhost',
  transform: {
    '^.+\\.(js|ts)x?$': ['babel-jest', {configFile: babelConfig}],
  },
}
