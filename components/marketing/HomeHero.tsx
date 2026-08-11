import React from 'react';
import { Image, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { MarketingButton } from './MarketingButton';

type HomeHeroProps = {
  onGetStarted?: () => void;
};

/** The approved opening WRNC.app homepage section. */
export function HomeHero({ onGetStarted }: HomeHeroProps) {
  const { width } = useWindowDimensions();
  const isCompact = width < 768;

  return (
    <View style={[styles.section, isCompact && styles.sectionCompact]}>
      <View style={[styles.content, isCompact && styles.contentCompact]}>
        <View style={[styles.copy, isCompact && styles.copyCompact]}>
          <Text style={styles.eyebrow}>THE CAR CULTURE PLATFORM</Text>
          <Text style={[styles.heading, isCompact && styles.headingCompact]}>
            BUILD SOMETHING WORTH REMEMBERING.
          </Text>
          <Text style={[styles.body, isCompact && styles.bodyCompact]}>
            The operating system for people who build, modify, maintain, and obsess over their cars.
          </Text>
          <MarketingButton label="GET STARTED" onPress={onGetStarted} style={styles.cta} />
        </View>
        <View style={[styles.visual, isCompact && styles.visualCompact]}>
          <View style={styles.glow} />
          <View style={styles.artworkFrame}>
            <Image
              accessibilityLabel="WRNC product experience across desktop and mobile"
              resizeMode="contain"
              source={require('../../assets/marketing/wrnc-marketing-hero-v2.webp')}
              style={styles.artwork}
            />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    backgroundColor: '#0D0F12',
    minHeight: 760,
    paddingHorizontal: 48,
    paddingVertical: 88,
    justifyContent: 'center',
  },
  sectionCompact: {
    minHeight: 0,
    paddingHorizontal: 24,
    paddingVertical: 64,
  },
  content: {
    alignItems: 'center',
    alignSelf: 'center',
    flexDirection: 'row',
    gap: 48,
    maxWidth: 1344,
    width: '100%',
  },
  contentCompact: {
    alignItems: 'stretch',
    flexDirection: 'column',
    gap: 48,
  },
  copy: {
    flex: 0.92,
    maxWidth: 610,
  },
  copyCompact: {
    maxWidth: undefined,
  },
  eyebrow: {
    color: '#C0C0C0',
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 17,
    marginBottom: 28,
    letterSpacing: 1.2,
  },
  heading: {
    color: '#FFFFFF',
    fontSize: 54,
    fontWeight: '700',
    letterSpacing: -1,
    lineHeight: 59,
  },
  headingCompact: {
    fontSize: 38,
    lineHeight: 44,
  },
  body: {
    color: '#C0C0C0',
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 24,
    marginTop: 10,
    maxWidth: 974,
    minHeight: 55,
  },
  bodyCompact: {
    fontSize: 18,
    lineHeight: 23,
    minHeight: 0,
  },
  cta: {
    marginTop: 42,
  },
  visual: {
    flex: 1.25,
    position: 'relative',
  },
  visualCompact: {
    width: '100%',
  },
  artworkFrame: {
    borderRadius: 10,
    overflow: 'hidden',
    position: 'relative',
  },
  glow: {
    backgroundColor: '#3B176B',
    borderRadius: 999,
    bottom: '10%',
    left: '12%',
    opacity: 0.32,
    position: 'absolute',
    right: '12%',
    top: '10%',
  },
  artwork: {
    aspectRatio: 1536 / 819,
    width: '100%',
  },
});
