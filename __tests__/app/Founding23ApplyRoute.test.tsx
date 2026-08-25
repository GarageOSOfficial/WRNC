import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import Founding23ApplyScreen from '../../app/founding23/apply.web';

const mockPush = jest.fn();

jest.mock('expo-router', () => ({ useRouter: () => ({ push: mockPush }) }));
jest.mock('expo-router/head', () => ({ __esModule: true, default: ({ children }: { children: React.ReactNode }) => children }));
jest.mock('react-native/Libraries/Utilities/useWindowDimensions', () => ({
  default: jest.fn(() => ({ width: 390, height: 844, scale: 3, fontScale: 1 })),
}));

const requiredFields = [
  ['NAME', 'Travis Builder'],
  ['EMAIL', 'builder@example.com'],
  ['GENERAL LOCATION', 'San Diego, CA'],
  ['VEHICLE', 'E30 track build'],
  ['YEAR / MAKE / MODEL', '1989 BMW 325i'],
  ['BUILD DESCRIPTION', 'A documented track-focused restoration.'],
  ['CURRENT BUILD STAGE', 'Running and sorting final systems.'],
  ['WORK YOU PERFORM', 'Fabrication, wiring, assembly, and testing.'],
  ['CURRENT DOCUMENTATION METHOD', 'Photos, notes, and spreadsheets.'],
  ['WHAT SHOULD WRNC SOLVE?', 'One durable record for the entire build.'],
] as const;

describe('Founding23ApplyScreen', () => {
  beforeEach(() => mockPush.mockClear());

  it('renders the Issue 49 fields and states the no-transmission boundary', () => {
    const { getByLabelText, getByText } = render(<Founding23ApplyScreen />);

    requiredFields.forEach(([label]) => getByLabelText(label));
    getByLabelText('SOCIAL HANDLE (OPTIONAL)');
    getByText(/does not store, upload, or transmit applicant data/i);
    getByText(/Build photos will be requested only after WRNC approves a private upload destination/i);
  });

  it('blocks review when required fields are missing', () => {
    const { getByRole, getByText } = render(<Founding23ApplyScreen />);

    fireEvent.press(getByRole('button', { name: 'REVIEW APPLICATION' }));
    getByText('Complete name before reviewing your application.');
  });

  it('reviews a complete application locally while final submission remains disabled', () => {
    const { getByLabelText, getByRole, getByText } = render(<Founding23ApplyScreen />);

    requiredFields.forEach(([label, value]) => fireEvent.changeText(getByLabelText(label), value));
    fireEvent.press(getByRole('checkbox'));
    fireEvent.press(getByRole('button', { name: 'REVIEW APPLICATION' }));

    getByText('Review your application');
    getByText('Travis Builder');
    getByText('Confirmed');
    getByText('NO APPLICANT DATA HAS BEEN SENT');
    const submitButton = getByRole('button', { name: 'SUBMISSION DESTINATION PENDING' });
    expect(submitButton.props.accessibilityState).toEqual({ disabled: true });
  });

  it('returns to the Founding 23 page', () => {
    const { getByRole } = render(<Founding23ApplyScreen />);
    fireEvent.press(getByRole('link', { name: 'BACK TO FOUNDING 23' }));
    expect(mockPush).toHaveBeenCalledWith('/founding23');
  });
});
