import '@testing-library/react-native';

jest.mock('react-native-safe-area-context', () =>
  require('react-native-safe-area-context/jest/mock').default,
);

// dummy config
jest.mock('react-native-config', () => ({
  RAPIDAPI_BASE_URL: 'https://hearthstone11.p.rapidapi.com',
  RAPIDAPI_HOST: 'hearthstone11.p.rapidapi.com',
  RAPIDAPI_KEY: 'test-key',
  REQUEST_TIMEOUT_MS: '10000',
}));
