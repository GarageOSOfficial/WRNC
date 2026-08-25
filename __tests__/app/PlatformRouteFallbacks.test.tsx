import React from 'react';
import { render } from '@testing-library/react-native';
import ComingSoonNativeFallback from '../../app/coming-soon';
import Founding23NativeFallback from '../../app/founding23';

const mockRedirect = jest.fn((_props: { href: string }) => null);

jest.mock('expo-router', () => ({
  Redirect: (props: { href: string }) => mockRedirect(props),
}));

describe('platform-neutral route fallbacks', () => {
  beforeEach(() => mockRedirect.mockClear());

  it.each([
    ['coming soon', ComingSoonNativeFallback],
    ['Founding 23', Founding23NativeFallback],
  ])('redirects the native %s route to the application root', (_name, Component) => {
    render(<Component />);
    expect(mockRedirect).toHaveBeenCalledWith({ href: '/' });
  });
});
