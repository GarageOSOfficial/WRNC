import React from 'react';
import { render } from '@testing-library/react-native';
import ComingSoonScreen from '../../app/coming-soon.web';

jest.mock('expo-router/head', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => children,
}));

jest.mock('../../components/marketing/WrncLogo', () => ({
  WrncLogo: () => null,
}));

describe('ComingSoonScreen', () => {
  it('renders the approved pre-launch messaging without exposing product navigation', () => {
    const { getByText, queryByText } = render(<ComingSoonScreen />);

    expect(getByText(/EVERY BUILD DESERVES/)).toBeTruthy();
    expect(getByText('BUILT FOR BUILDERS.')).toBeTruthy();
    expect(getByText('COMING SOON')).toBeTruthy();
    expect(getByText('THE CAR CULTURE PLATFORM')).toBeTruthy();
    expect(queryByText('SIGN IN')).toBeNull();
    expect(queryByText('JOIN WRNC')).toBeNull();
    expect(queryByText('APPLY FOR THE FOUNDING 23')).toBeNull();
  });
});
