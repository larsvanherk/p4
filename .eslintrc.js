module.exports = {
  root: true,
  extends: ['@nuxt/eslint-config'],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    quotes: [process.env.NODE_ENV === 'production' ? 'error' : 'warn', 'single'],
    semi: [process.env.NODE_ENV === 'production' ? 'error' : 'warn', 'always'],
    'space-before-function-paren': ['error', {
      anonymous: 'always',
      named: 'never',
      asyncArrow: 'always'
    }],
    'vue/html-closing-bracket-newline': [process.env.NODE_ENV === 'production' ? 'error' : 'warn', {
      singleline: 'never',
      multiline: 'never'
    }]
  }
};
