module.exports = {
  preset: 'ts-jest',
  collectCoverageFrom: ['src/**/*.{js,jsx,ts,tsx,mjs}'],
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json'],
  testPathIgnorePatterns: ['/node_modules/', '/lib/', '/dist/'],
  testRegex: '(/__tests__/.*(\\.|/)(test|spec))\\.(js|ts)$',
  testURL: 'http://localhost',
  globals: {
    'ts-jest': {
      diagnostics: false,
    },
  },
}
