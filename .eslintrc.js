module.exports = {
  extends: ['eslint:recommended', 'prettier'],
  parser: 'babel-eslint',
  env: {
    node: true,
    jest: true,
  },
  rules: {
    'no-unused-vars': ['error', {argsIgnorePattern: '^_'}],
  },
}
