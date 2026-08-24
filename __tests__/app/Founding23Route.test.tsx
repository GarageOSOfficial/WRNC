import React from 'react';
import { render } from '@testing-library/react-native';
import Founding23Screen from '../../app/founding23.web';

jest.mock('expo-router', () => ({ useRouter: () => ({ push: jest.fn() }) }));
jest.mock('expo-router/head', () => ({ __esModule: true, default: ({ children }: { children: React.ReactNode }) => children }));
jest.mock('react-native/Libraries/Utilities/useWindowDimensions', () => ({
  default: jest.fn(() => ({ width: 390, height: 844, scale: 3, fontScale: 1 })),
}));

describe('Founding23Screen', () => {
  it('renders the locked V1 cohort model and honest intake gate', () => {
    const { getAllByLabelText, getAllByText, getByLabelText, getByText } = render(<Founding23Screen />);

    getByText('Founding 23');
    getByText('20');
    getByText('BUILDERS BEING RECRUITED');
    getByLabelText('Founding Builder 001, reserved');
    getByLabelText('Founding Builder 002, reserved');
    getByLabelText('Founding Builder 007, reserved');
    getByLabelText('Founding Builder 023, open');
    expect(getAllByLabelText(/, reserved$/)).toHaveLength(3);
    expect(getAllByText('OPEN')).toHaveLength(20);
    getByText('APPLY FOR THE FOUNDING 23');
    getByText('APPLICATION INTAKE GATE PENDING');
  });
});
