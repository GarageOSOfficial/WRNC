import React from 'react';
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { MarketingButton } from './MarketingButton';

type FinalCtaSectionProps = {
  onJoin?: () => void;
};

/** Approved closing call-to-action for the WRNC.app homepage. */
export function FinalCtaSection({ onJoin }: FinalCtaSectionProps) {
  const { width } = useWindowDimensions();
  const isCompact = width < 768;

  return (
    <View style={[styles.section, isCompact && styles.sectionCompact]}>
      <View style={[styles.content, isCompact && styles.contentCompact]}>
        <Text style={[styles.eyebrow, isCompact && styles.eyebrowCompact]}>READY TO BUILD?</Text>
        <Text style={[styles.heading, isCompact && styles.headingCompact]}>BUILD SOMETHING WORTH REMEMBERING</Text>
        <Text style={[styles.body, isCompact && styles.bodyCompact]}>
          WRNC keeps the parts, work, passion, documentation, progress, and history of your build connected — from the first wrench to the final drive.
        </Text>
        <MarketingButton label="JOIN THE GARAGE" onPress={onJoin} style={[styles.cta, isCompact && styles.ctaCompact]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    backgroundColor: '#080808',
    paddingHorizontal: 48,
    paddingVertical: 120,
  },
  sectionCompact: {
    minHeight: 0,
    paddingHorizontal: 24,
    paddingVertical: 96,
  },
  content: {
    alignSelf: 'center',
    height: 217,
    maxWidth: 1344,
    position: 'relative',
    width: '100%',
  },
  contentCompact: {
    height: undefined,
    width: '100%',
  },
  eyebrow: {
    color: '#C0C0C0',
    fontSize: 14,
    fontWeight: '600',
    left: 0,
    lineHeight: 17,
    position: 'absolute',
    top: 0,
  },
  eyebrowCompact: {
    position: 'relative',
  },
  heading: {
    color: '#FFFFFF',
    fontSize: 40,
    fontWeight: '600',
    left: 0,
    lineHeight: 48,
    position: 'absolute',
    top: 46,
  },
  headingCompact: {
    fontSize: 32,
    lineHeight: 38,
    marginTop: 29,
    position: 'relative',
    top: 0,
  },
  body: {
    color: '#C0C0C0',
    fontSize: 20,
    fontWeight: '600',
    left: 0,
    lineHeight: 24,
    maxWidth: 1344,
    position: 'absolute',
    top: 123,
  },
  bodyCompact: {
    fontSize: 18,
    lineHeight: 23,
    marginTop: 20,
    position: 'relative',
    top: 0,
  },
  cta: {
    minWidth: 167,
    position: 'absolute',
    top: 176,
  },
  ctaCompact: {
    marginTop: 29,
    position: 'relative',
    top: 0,
  },
});
