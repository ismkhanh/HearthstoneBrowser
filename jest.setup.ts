// RTL v14 registers its jest matchers when the package is imported.
import '@testing-library/react-native';

// Screens read safe-area insets; the official mock supplies zero insets.
// The mock module is ESM-shaped (everything under `default`), so unwrap it.
jest.mock('react-native-safe-area-context', () =>
  require('react-native-safe-area-context/jest/mock').default,
);

// Build-time config: fixed values rather than reading a real .env.
jest.mock('react-native-config', () => ({
  RAPIDAPI_BASE_URL: 'https://hearthstone11.p.rapidapi.com',
  RAPIDAPI_HOST: 'hearthstone11.p.rapidapi.com',
  RAPIDAPI_KEY: 'test-key',
  REQUEST_TIMEOUT_MS: '10000',
}));

// FlashList renders through a native (Fabric) view that does not exist in
// the jest environment. Swapping it for FlatList keeps the component tests
// focused on our own behaviour: paging, states and navigation.
jest.mock('@shopify/flash-list', () => {
  const React = jest.requireActual<typeof import('react')>('react');
  const { FlatList } = jest.requireActual<typeof import('react-native')>('react-native');

  return {
    FlashList: (props: object) =>
      React.createElement(FlatList as unknown as React.ComponentType<object>, props),
  };
});

// A native view — replace with a plain Image.
jest.mock('@d11/react-native-fast-image', () => {
  const React = jest.requireActual<typeof import('react')>('react');
  const { Image } = jest.requireActual<typeof import('react-native')>('react-native');

  const FastImage = (props: object) =>
    React.createElement(Image as unknown as React.ComponentType<object>, props);
  FastImage.priority = { normal: 'normal', high: 'high', low: 'low' };
  FastImage.cacheControl = { immutable: 'immutable', web: 'web', cacheOnly: 'cacheOnly' };
  FastImage.resizeMode = { contain: 'contain', cover: 'cover', stretch: 'stretch', center: 'center' };
  return { __esModule: true, default: FastImage };
});
