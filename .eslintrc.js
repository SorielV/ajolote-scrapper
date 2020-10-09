module.exports = {
  env: {
    es2021: true,
    es6: true,
    node: true,
    jest: true
  },
  extends: [
    'standard'
  ],
  globals: {
    CheerioStatic: 'readonly'
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module'
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.ts'],
        moduleDirectory: ['node_modules', 'src/']
      }
    },
    rules: {
      'import/extensions': [
        'error',
        'ignorePackages',
        {
          js: 'never',
          jsx: 'never',
          ts: 'never',
          tsx: 'never'
        }
      ]
    }
  },
  plugins: [
    '@typescript-eslint'
  ]
}
