module.exports = {
  preset: '@react-native/jest-preset',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  // Libraries that ship untranspiled code: axios resolves to ESM under the
  // react-native export condition.
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?@?react-native'
      + '|@react-native-community'
      + '|@react-navigation'
      + '|@shopify/flash-list'
      + '|axios'
      + ')/)',
  ],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/__tests__/**',
    '!src/test/**',
  ],
};
