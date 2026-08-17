module.exports = {
  root: true,
  extends: [
    '@react-native',
    'plugin:@tanstack/query/recommended',
    'prettier',
  ],
  plugins: ['import'],
  rules: {
    // Clean architecture enforced
    'import/no-restricted-paths': ['error', {
      zones: [
        // feature domain stays pure: no data, presentation imports
        { target: './src/features/cards/domain', from: './src/features/cards/data' },
        { target: './src/features/cards/domain', from: './src/features/cards/presentation' },
        { target: './src/features/cards/domain', from: './src/core/network' },
        // data never imports UI
        { target: './src/features/cards/data', from: './src/features/cards/presentation' },
        // core and shared know nothing about features
        { target: './src/core', from: './src/features' },
        { target: './src/shared', from: './src/features' },
      ],
    }],

    'no-restricted-imports': ['error', {
      paths: [{
        name: 'axios',
        message: 'Import axios only in core/network. Everything else uses the HttpClient port.',
      }],
    }],

    'react-native/no-inline-styles': 'error',

    'react-hooks/exhaustive-deps': 'error',

    // console.error stays allowed the ErrorBoundary uses it.
    'no-console': ['error', { allow: ['warn', 'error'] }],
  },
  overrides: [
    {
      files: ['src/core/network/**'],
      rules: { 'no-restricted-imports': 'off' },
    },
  ],
};
