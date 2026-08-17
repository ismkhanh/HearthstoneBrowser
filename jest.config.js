module.exports = {
  preset: '@react-native/jest-preset',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  // Libraries that ship untranspiled code: fast-image is TypeScript source,
  // axios resolves to ESM under the react-native export condition.
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?@?react-native'
      + '|@react-native-community'
      + '|@react-navigation'
      + '|@shopify/flash-list'
      + '|@d11/react-native-fast-image'
      + '|axios'
      + ')/)',
  ],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/__tests__/**',
    '!src/test/**',
  ],
};
