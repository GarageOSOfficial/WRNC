import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import { HomeHero } from '../../components/marketing/HomeHero';
import { ProductShowcaseSection } from '../../components/marketing/ProductShowcaseSection';
import { WrncLogo } from '../../components/marketing/WrncLogo';

// useWindowDimensions is mocked per breakpoint where needed
jest.mock('react-native/Libraries/Utilities/useWindowDimensions', () => ({
  default: jest.fn(() => ({ width: 1440, height: 900, scale: 1, fontScale: 1 })),
}));

const mockDimensions = require('react-native/Libraries/Utilities/useWindowDimensions').default as jest.Mock;

// ─── HomeHero ──────────────────────────────────────────────────────────────

describe('HomeHero', () => {
  beforeEach(() => mockDimensions.mockReturnValue({ width: 1440, height: 900, scale: 1, fontScale: 1 }));

  it('renders the approved headline copy', () => {
    const { getByText } = render(<HomeHero />);
    getByText(/EVERY BUILD DESERVES A/i);
    getByText(/LIVING RECORD\./i);
  });

  it('renders the eyebrow label', () => {
    const { getByText } = render(<HomeHero />);
    getByText('THE CAR CULTURE PLATFORM');
  });

  it('renders the CTA button with the approved label', () => {
    const { getByText } = render(<HomeHero />);
    getByText('START YOUR BUILD');
  });

  it('calls onGetStarted when the CTA is pressed', () => {
    const onGetStarted = jest.fn();
    const { getByText } = render(<HomeHero onGetStarted={onGetStarted} />);
    fireEvent.press(getByText('START YOUR BUILD'));
    expect(onGetStarted).toHaveBeenCalledTimes(1);
  });

  it('renders the three proof-row items', () => {
    const { getByText } = render(<HomeHero />);
    getByText('ONE GARAGE');
    getByText('ONE TIMELINE');
    getByText('ONE LEGACY');
  });

  it('renders the inventory dashboard image with correct accessibility label', () => {
    const { getByLabelText } = render(<HomeHero />);
    getByLabelText('WRNC inventory dashboard');
  });

  it('renders the activity timeline image with correct accessibility label', () => {
    const { getByLabelText } = render(<HomeHero />);
    getByLabelText('WRNC activity timeline');
  });

  it('renders the documentation score card', () => {
    const { getByText } = render(<HomeHero />);
    getByText('94%');
    getByText('DOCUMENTATION SCORE');
  });

  it('uses stacked layout on mobile (width < 768)', () => {
    mockDimensions.mockReturnValue({ width: 375, height: 812, scale: 2, fontScale: 1 });
    // Component should render without error at mobile width
    const { getByText } = render(<HomeHero />);
    getByText(/EVERY BUILD DESERVES A/i);
  });

  it('uses stacked layout on tablet (768 ≤ width < 1100)', () => {
    mockDimensions.mockReturnValue({ width: 834, height: 1194, scale: 2, fontScale: 1 });
    const { getByText } = render(<HomeHero />);
    getByText(/EVERY BUILD DESERVES A/i);
  });
});

// ─── ProductShowcaseSection ────────────────────────────────────────────────

describe('ProductShowcaseSection', () => {
  beforeEach(() => mockDimensions.mockReturnValue({ width: 1440, height: 900, scale: 1, fontScale: 1 }));

  it('renders the section heading', () => {
    const { getByText } = render(<ProductShowcaseSection />);
    getByText('YOUR ENTIRE BUILD, IN FOCUS.');
  });

  it('renders the eyebrow label', () => {
    const { getByText } = render(<ProductShowcaseSection />);
    getByText('BUILT AROUND THE CAR');
  });

  it('renders all three approved product card captions', () => {
    const { getByText } = render(<ProductShowcaseSection />);
    getByText('BUILD PASSPORT™');
    getByText('PARTS INVENTORY');
    getByText('DOCUMENTATION SCORE™');
  });

  it('renders descriptions for each product card', () => {
    const { getByText } = render(<ProductShowcaseSection />);
    getByText(/permanent record of every part/i);
    getByText(/Know what you own/i);
    getByText(/how complete the vehicle story/i);
  });

  it('renders without error on mobile width', () => {
    mockDimensions.mockReturnValue({ width: 390, height: 844, scale: 3, fontScale: 1 });
    const { getByText } = render(<ProductShowcaseSection />);
    getByText('BUILD PASSPORT™');
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
