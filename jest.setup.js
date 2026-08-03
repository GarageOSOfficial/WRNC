/* eslint-disable */
try {
  require('react-native-url-polyfill/auto');
} catch (error) {
  // jest-expo can load the polyfill through the CommonJS entrypoint when ESM is not supported.
}

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);
