import React from 'react';
import { render } from '@testing-library/react-native';
import AboutScreen from '../../app/about';
import PrivacyScreen from '../../app/privacy';
import TermsScreen from '../../app/terms';

jest.mock('expo-router', () => ({ useRouter: () => ({ replace: jest.fn() }) }));

describe('prepared public content routes', () => {
  it('marks the privacy notice as an unapproved draft with unresolved decisions', () => {
    const route = render(<PrivacyScreen />);
    route.getByText('PRIVACY NOTICE');
    route.getByText('DRAFT. NOT APPROVED OR EFFECTIVE. DO NOT RELY ON OR PUBLISH AS FINAL.');
    route.getByText(/define retention periods/i);
  });

  it('marks the terms as inactive and does not present placeholders as terms', () => {
    const route = render(<TermsScreen />);
    route.getByText('TERMS OF SERVICE');
    route.getByText('DRAFT. NOT APPROVED OR EFFECTIVE. NO USER ASSENT IS BEING COLLECTED.');
    route.getByText(/governing law, venue, arbitration/i);
  });

  it('renders sourced About content and its Founder review gate', () => {
    const route = render(<AboutScreen />);
    route.getByText('BUILT FOR BUILDERS.');
    route.getByText('PREPARED COPY. FOUNDER REVIEW REQUIRED BEFORE PUBLICATION.');
    route.getByText(/vehicle build documentation and collaboration platform/i);
  });
});
