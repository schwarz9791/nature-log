module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    // 'plugin:import/errors',
    // 'plugin:import/warnings',
    // 'plugin:import/typescript',
    // 'google',
    'plugin:prettier/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: ['tsconfig.json'],
    sourceType: 'module',
  },
  // ignorePatterns: [
  //   '/lib/**/*', // Ignore built files.
  // ],
  // plugins: ['import'],
  globals: {
    alert: false,
    fetch: false,
  },
  rules: {
    'prettier/prettier': [
      'error',
      {
        semi: false,
        singleQuote: true,
        trailingComma: 'es5',
        'no-extra-semi': 'error',
        'no-unexpected-multiline': 'error',
      },
    ],
  },
}
