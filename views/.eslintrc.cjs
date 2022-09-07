module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'plugin:react/recommended',
    'xo',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: [
    'react',
    '@typescript-eslint',
    'react-hooks',
  ],
  rules: {
    indent: 'off', // https://github.com/eslint/eslint/issues/13956#issuecomment-751236261
    '@typescript-eslint/indent': ['error', 2],
    'object-curly-spacing': ['error', 'always'],
    'no-duplicate-imports': ['error'],
    '@next/next/no-img-element': 'off',
    camelcase: 'off',
    'react-hooks/rules-of-hooks': 'error', // 检查 Hook 的规则
    'react-hooks/exhaustive-deps': 'warn', // 检查 effect 的依赖
    'react/react-in-jsx-scope': 'off',
    'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx', '.tsx'] }],
    'brace-style': ['error', '1tbs', { allowSingleLine: true }],
    'max-statements-per-line': ['error', { max: 2 }],
  },
  globals: {
    AsyncReturnType: 'readonly',
  },
};
