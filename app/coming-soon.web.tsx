import React, { useEffect } from 'react';
import { Image, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import Head from 'expo-router/head';
import { WrncLogo } from '../components/marketing/WrncLogo';

declare global {
  interface Window {
    va?: (...args: unknown[]) => void;
    vaq?: unknown[];
  }
}

type AnalyticsData = Record<string, string>;

type ProductPreviewSlotProps = {
  assetUri?: string;
  accessibilityLabel?: string;
};

const TRACKED_UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'] as const;

function trackComingSoonEvent(name: string, data: AnalyticsData = {}) {
  if (typeof window === 'undefined') return;

  window.va =
    window.va ||
    function (...args: unknown[]) {
      window.vaq = window.vaq || [];
      window.vaq.push(args);
    };

  window.va('event', { name, data });
}

function sourceFromReferrer(referrer: string): string {
  if (!referrer) return 'direct';

  try {
    const host = new URL(referrer).hostname.toLowerCase();
    if (host.includes('instagram.com')) return 'instagram';
    if (host.includes('tiktok.com')) return 'tiktok';
    if (host.includes('facebook.com') || host.includes('fb.com')) return 'facebook';
    if (host.includes('youtube.com') || host.includes('youtu.be')) return 'youtube';
    if (host.includes('reddit.com')) return 'reddit';
    if (host.includes('linktr.ee') || host.includes('linktree')) return 'linktree';
    return host;
  } catch {
    return 'unknown';
  }
}

function ProductPreviewSlot({ assetUri, accessibilityLabel = 'WRNC product preview' }: ProductPreviewSlotProps) {
  if (!assetUri) return null;

  return (
    <View
      accessibilityLabel={accessibilityLabel}
      accessible
      onTouchStart={() => trackComingSoonEvent('Coming Soon Product Preview Interaction')}
      style={styles.previewShell}
    >
      <Image resizeMode="contain" source={{ uri: assetUri }} style={styles.previewImage} />
    </View>
  );
}

export default function ComingSoonScreen() {
  const { height: viewportHeight } = useWindowDimensions();

  useEffect(() => {
    if (typeof window === 'undefined' || !window.location) return;

    const params = new URLSearchParams(window.location.search);
    const analyticsData: AnalyticsData = {
      source: params.get('utm_source') || sourceFromReferrer(document.referrer),
      referrer: document.referrer || 'direct',
    };

    TRACKED_UTM_KEYS.forEach((key) => {
      const value = params.get(key);
      if (value) {
        analyticsData[key] = value;
        try {
          window.sessionStorage.setItem(`wrnc_${key}`, value);
        } catch {
          // Session storage can be unavailable in hardened/private browser modes.
        }
      }
    });

    trackComingSoonEvent('Coming Soon Visit', analyticsData);
  }, []);

  return (
    <>
      <Head>
        <title>WRNC | The Car Culture Platform</title>
        <meta
          name="description"
          content="Every build deserves a living record. WRNC is building a purpose-built home for automotive Builders and their Builds."
        />
        <meta name="theme-color" content="#080808" />
        <meta name="robots" content="noindex,follow" />
        <link rel="canonical" href="https://wrnc.app/coming-soon" />

        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="WRNC" />
        <meta property="og:title" content="WRNC | The Car Culture Platform" />
        <meta
          property="og:description"
          content="Every build deserves a living record. WRNC is building a purpose-built home for automotive Builders and their Builds."
        />
        <meta property="og:url" content="https://wrnc.app/coming-soon" />

        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="WRNC | The Car Culture Platform" />
        <meta
          name="twitter:description"
          content="Every build deserves a living record. WRNC is building a purpose-built home for automotive Builders and their Builds."
        />

        <script
          dangerouslySetInnerHTML={{
            __html:
              'window.va=window.va||function(){(window.vaq=window.vaq||[]).push(arguments);};',
          }}
        />
        <script defer src="/_vercel/insights/script.js" />
      </Head>

      <ScrollView
        contentContainerStyle={[styles.page, { minHeight: Math.max(viewportHeight, 720) }]}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <WrncLogo style={styles.logo} />

          <View style={styles.copyBlock}>
            <Text accessibilityRole="header" style={styles.headline}>
              EVERY BUILD DESERVES{`\n`}A LIVING RECORD.
            </Text>

            <Text style={styles.supportingCopy}>
              Your build history shouldn’t be scattered across camera rolls, receipts, emails, notes and memory.
            </Text>
            <Text style={styles.supportingCopy}>
              WRNC is building a purpose-built home for the Builder and the Build.
            </Text>
          </View>

          <View style={styles.statusBlock}>
            <Text style={styles.builderStatement}>BUILT FOR BUILDERS.</Text>
            <View style={styles.accentLine} />
            <Text style={styles.comingSoon}>COMING SOON</Text>
          </View>
        </View>

        <ProductPreviewSlot />
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  page: {
    backgroundColor: '#080808',
    paddingHorizontal: 24,
    width: '100%',
  },
  hero: {
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    maxWidth: 920,
    paddingBottom: 72,
    paddingTop: 72,
    width: '100%',
  },
  logo: {
    height: 50,
    marginBottom: 64,
    width: 226,
  },
  copyBlock: {
    alignItems: 'center',
    maxWidth: 760,
    width: '100%',
  },
  headline: {
    color: '#FFFFFF',
    fontSize: 48,
    fontWeight: '800',
    letterSpacing: 0.4,
    lineHeight: 52,
    textAlign: 'center',
  },
  supportingCopy: {
    color: '#C0C0C0',
    fontSize: 18,
    lineHeight: 28,
    marginTop: 22,
    maxWidth: 660,
    textAlign: 'center',
  },
  statusBlock: {
    alignItems: 'center',
    marginTop: 52,
  },
  builderStatement: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 2.2,
  },
  accentLine: {
    backgroundColor: '#FF6400',
    height: 2,
    marginVertical: 18,
    width: 42,
  },
  comingSoon: {
    color: '#C0C0C0',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 3.6,
  },
  previewShell: {
    alignSelf: 'center',
    backgroundColor: '#111111',
    borderColor: '#242424',
    borderRadius: 28,
    borderWidth: 1,
    maxWidth: 980,
    overflow: 'hidden',
    padding: 12,
    width: '100%',
  },
  previewImage: {
    aspectRatio: 16 / 10,
    borderRadius: 18,
    width: '100%',
  },
});
