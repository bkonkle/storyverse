module.exports = {
  preset: 'ts-jest',
  collectCoverageFrom: ['src/**/*.{js,jsx,ts,tsx,mjs}'],
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json'],
  testPathIgnorePatterns: ['/node_modules/', '/lib/', '/build/'],
  testRegex: '(/(test|__tests__)/.*(\\.|/)(test|spec))\\.[j|t]sx?$',
  testURL: 'http://localhost',
  globals: {
    'ts-jest': {
      diagnostics: false,
    },
  },
}
