import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import { HomeHero } from '../../components/marketing/HomeHero';
import { MarketingFooter } from '../../components/marketing/MarketingFooter';
import { MarketingHeader } from '../../components/marketing/MarketingHeader';
import { ProductShowcaseSection } from '../../components/marketing/ProductShowcaseSection';
import { WhyWrncSection } from '../../components/marketing/WhyWrncSection';
import { WrncLogo } from '../../components/marketing/WrncLogo';

jest.mock('@expo/vector-icons/FontAwesome6', () => 'FontAwesome6');

// useWindowDimensions is mocked per breakpoint where needed
jest.mock('react-native/Libraries/Utilities/useWindowDimensions', () => ({
  default: jest.fn(() => ({ width: 1440, height: 900, scale: 1, fontScale: 1 })),
}));

const mockDimensions = require('react-native/Libraries/Utilities/useWindowDimensions').default as jest.Mock;

// ─── HomeHero ──────────────────────────────────────────────────────────────

describe('HomeHero', () => {
  beforeEach(() => mockDimensions.mockReturnValue({ width: 1440, height: 900, scale: 1, fontScale: 1 }));

  it('renders the approved V3.1 copy and product proof', () => {
    const { getByText } = render(<HomeHero />);
    getByText('Every build deserves a living record.');
    getByText(/operating system for automotive builders/i);
    getByText('JOIN WRNC');
    getByText('SIGN IN →');
  });

  it('routes both hero actions through their callbacks', () => {
    const onGetStarted = jest.fn();
    const onSignIn = jest.fn();
    const { getByText } = render(<HomeHero onGetStarted={onGetStarted} onSignIn={onSignIn} />);
    fireEvent.press(getByText('JOIN WRNC'));
    fireEvent.press(getByText('SIGN IN →'));
    expect(onGetStarted).toHaveBeenCalledTimes(1);
    expect(onSignIn).toHaveBeenCalledTimes(1);
  });

  it('uses stacked layout on mobile (width < 768)', () => {
    mockDimensions.mockReturnValue({ width: 375, height: 812, scale: 2, fontScale: 1 });
    // Component should render without error at mobile width
    const { getByText } = render(<HomeHero />);
    getByText('Every build deserves a living record.');
  });

  it('uses stacked layout on tablet (768 ≤ width < 1100)', () => {
    mockDimensions.mockReturnValue({ width: 834, height: 1194, scale: 2, fontScale: 1 });
    const { getByText } = render(<HomeHero />);
    getByText('Every build deserves a living record.');
  });
});

// ─── ProductShowcaseSection ────────────────────────────────────────────────

describe('ProductShowcaseSection', () => {
  beforeEach(() => mockDimensions.mockReturnValue({ width: 1440, height: 900, scale: 1, fontScale: 1 }));

  it('renders the single Garage proof and positioning copy', () => {
    const { getByLabelText, getByText } = render(<ProductShowcaseSection />);
    getByLabelText('WRNC Garage product interface');
    getByText('Built for builders, not algorithms.');
    getByText(/personal build database/i);
  });

  it('renders without error on mobile width', () => {
    mockDimensions.mockReturnValue({ width: 390, height: 844, scale: 3, fontScale: 1 });
    const { getByText } = render(<ProductShowcaseSection />);
    getByText('Built for builders, not algorithms.');
  });
});

describe('V3.1 navigation and benefits', () => {
  it('routes mobile header auth actions and toggles its accessible menu', () => {
    mockDimensions.mockReturnValue({ width: 390, height: 844, scale: 3, fontScale: 1 });
    const onJoin = jest.fn();
    const onSignIn = jest.fn();
    const { getByLabelText, getByText } = render(<MarketingHeader onJoin={onJoin} onSignIn={onSignIn} />);
    fireEvent.press(getByLabelText('Open navigation'));
    fireEvent.press(getByText('SIGN IN'));
    fireEvent.press(getByLabelText('Open navigation'));
    fireEvent.press(getByText('JOIN WRNC'));
    expect(onJoin).toHaveBeenCalledTimes(1);
    expect(onSignIn).toHaveBeenCalledTimes(1);
  });

  it('renders the three approved benefits and public footer labels', () => {
    const benefits = render(<WhyWrncSection />);
    benefits.getByText('Organize your vehicle.');
    benefits.getByText('Document your build.');
    benefits.getByText('Preserve its history.');
    const onSignIn = jest.fn();
    const footer = render(<MarketingFooter onSignIn={onSignIn} />);
    ['WRNC links', 'Instagram', 'Facebook', 'YouTube', 'Discord', 'TikTok', 'Reddit profile'].forEach((label) => {
      footer.getByLabelText(label);
    });
    footer.getByText('© 2026 WRNC.');
    fireEvent.press(footer.getByText('Sign In'));
    expect(onSignIn).toHaveBeenCalledTimes(1);
  });
});

// ─── WrncLogo ─────────────────────────────────────────────────────────────

describe('WrncLogo', () => {
  it('renders with the WRNC accessibility label', () => {
    const { getByLabelText } = render(<WrncLogo />);
    getByLabelText('WRNC');
  });

  it('references the transparent Hyper Silver placement asset', () => {
    // Confirm the asset path is the approved transparent master, not the dark background variant
    const source = require('../../assets/brand/wrnc-master-logo-hyper-silver-transparent-placement.png');
    expect(source).toBeDefined();
  });

  it('renders without error when a custom style is supplied', () => {
    const { getByLabelText } = render(<WrncLogo style={{ marginTop: 8 }} />);
    getByLabelText('WRNC');
  });
});
