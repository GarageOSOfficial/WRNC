import React from 'react';
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';
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
        <Text style={styles.eyebrow}>THE CAR CULTURE PLATFORM</Text>
        <Text style={[styles.heading, isCompact && styles.headingCompact]}>
          BUILD SOMETHING WORTH REMEMBERING.
        </Text>
        <Text style={[styles.body, isCompact && styles.bodyCompact]}>
          WRNC, the operating system for people who build, modify, maintain, and obsess over their builds.
        </Text>
        <MarketingButton label="GET STARTED" onPress={onGetStarted} style={styles.cta} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    backgroundColor: '#1A1D22',
    minHeight: 720,
    paddingBottom: 84,
    paddingHorizontal: 0,
    justifyContent: 'flex-end',
  },
  sectionCompact: {
    minHeight: 640,
    paddingBottom: 48,
    paddingHorizontal: 24,
  },
  content: {
    maxWidth: 1200,
    minHeight: 300,
  },
  contentCompact: {
    minHeight: 0,
  },
  eyebrow: {
    color: '#C0C0C0',
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 17,
    marginBottom: 28,
    minHeight: 34,
  },
  heading: {
    color: '#FFFFFF',
    fontSize: 48,
    fontWeight: '600',
    letterSpacing: 0,
    lineHeight: 55,
    maxWidth: 1200,
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
    marginTop: 77,
  },
});
