const airBnbBase = require('eslint-config-airbnb-base/rules/style')
const noRestrictedSyntaxSelectors = airBnbBase.rules['no-restricted-syntax']
  .filter(({selector}) => selector && selector !== 'ForInStatement' && selector !== 'ForOfStatement');

module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir : __dirname,
    sourceType: 'module',
  },
  plugins: ['import'],
  extends: [
    'airbnb-base',
    'airbnb-typescript/base',
  ],
  rules: {
    'no-underscore-dangle': 'warn',
    'import/prefer-default-export': 'warn',
    'import/no-cycle': 'warn',
    'class-methods-use-this': 'off',
    'max-len': ['error', 120],
    'no-restricted-syntax': ['error', ...noRestrictedSyntaxSelectors],
  },
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  overrides: [
    {
      files: ['**/*.spec.ts'],
      rules: {
        'max-classes-per-file': 0,
      },
    },
  ],
};
