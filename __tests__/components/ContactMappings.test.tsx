import React from 'react';
import { Linking } from 'react-native';
import { fireEvent, render } from '@testing-library/react-native';
import AboutScreen from '../../app/about';
import PrivacyScreen from '../../app/privacy';
import TermsScreen from '../../app/terms';
import { MarketingFooter } from '../../components/marketing/MarketingFooter';
import { WRNC_CONTACT_EMAILS, WRNC_SYSTEM_SENDER } from '../../lib/contactEmails';

jest.mock('expo-router', () => ({ useRouter: () => ({ replace: jest.fn() }) }));
jest.mock('@expo/vector-icons/FontAwesome6', () => 'FontAwesome6');

describe('canonical contact mappings', () => {
  let openURL: jest.SpyInstance;
  beforeEach(() => { openURL = jest.spyOn(Linking, 'openURL').mockResolvedValue(undefined).mockClear(); });
  afterEach(() => jest.restoreAllMocks());

  it('keeps the approved hierarchy separate from the outbound-only sender', () => {
    expect(WRNC_CONTACT_EMAILS).toEqual({
      founder: 'travis@wrnc.app', support: 'support@wrnc.app', feedback: 'feedback@wrnc.app',
      privacy: 'privacy@wrnc.app', legal: 'legal@wrnc.app', security: 'security@wrnc.app',
      beta: 'beta@wrnc.app', sponsorship: 'sponsor@wrnc.app', billing: 'billing@wrnc.app',
    });
    expect(WRNC_SYSTEM_SENDER).toBe('noreply@wrnc.app');
    expect(Object.values(WRNC_CONTACT_EMAILS)).not.toContain(WRNC_SYSTEM_SENDER);
  });

  it.each([
    [AboutScreen, 'General help and support: support@wrnc.app', 'mailto:support@wrnc.app'],
    [PrivacyScreen, 'Privacy inquiries: privacy@wrnc.app', 'mailto:privacy@wrnc.app'],
    [PrivacyScreen, 'Security reporting: security@wrnc.app', 'mailto:security@wrnc.app'],
    [TermsScreen, 'Legal and intellectual property inquiries: legal@wrnc.app', 'mailto:legal@wrnc.app'],
    [TermsScreen, 'Billing (future): billing@wrnc.app', 'mailto:billing@wrnc.app'],
  ] as const)('opens the intended destination for %s / %s', (Screen, label, destination) => {
    const route = render(<Screen />);
    fireEvent.press(route.getByRole('link', { name: label }));
    expect(openURL).toHaveBeenCalledWith(destination);
    expect(openURL).toHaveBeenCalledTimes(1);
    expect(route.queryByText(/contact@wrnc.app|noreply@wrnc.app|travis@wrnc.app/)).toBeNull();
  });

  it('routes both existing general footer contacts to Support without adding contact surfaces', () => {
    const footer = render(<MarketingFooter />);
    fireEvent.press(footer.getByText('Contact'));
    fireEvent.press(footer.getByText('Support'));
    expect(openURL.mock.calls).toEqual([['mailto:support@wrnc.app'], ['mailto:support@wrnc.app']]);
    footer.getByText('Built for Builders.');
    expect(footer.queryByText('Billing')).toBeNull();
    expect(footer.queryByText('Founder')).toBeNull();
  });

  it('preserves footer route callbacks separately from mail destinations', () => {
    const onAbout = jest.fn(), onPrivacy = jest.fn(), onTerms = jest.fn();
    const onFounding23 = jest.fn(), onSignIn = jest.fn();
    const footer = render(<MarketingFooter {...{ onAbout, onPrivacy, onTerms, onFounding23, onSignIn }} />);
    ['About', 'Privacy', 'Terms', 'Founding Builders', 'Sign In'].forEach(label => fireEvent.press(footer.getByText(label)));
    [onAbout, onPrivacy, onTerms, onFounding23, onSignIn].forEach(callback => expect(callback).toHaveBeenCalledTimes(1));
    expect(openURL).not.toHaveBeenCalled();
  });

  it.each([
    ['Instagram', 'https://www.instagram.com/wrnc.app/'],
    ['Facebook', 'https://www.facebook.com/WRNCapp/'],
    ['YouTube', 'https://www.youtube.com/@WRNC_app'],
    ['Discord', 'https://discord.gg/YfbcetDD'],
    ['TikTok', 'https://www.tiktok.com/@wrnc.app'],
    ['Reddit profile', 'https://www.reddit.com/user/WRNC_app/'],
  ])('preserves the %s social destination', (label, destination) => {
    const footer = render(<MarketingFooter />);
    fireEvent.press(footer.getByLabelText(label));
    expect(openURL).toHaveBeenCalledWith(destination);
  });
});
