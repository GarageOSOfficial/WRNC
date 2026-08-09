import React from 'react';
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { MarketingPillar } from './MarketingPillar';

const pillars = [
  {
    accentColor: '#FF6400',
    description: 'Track the work, parts, modifications, costs, and progress.',
    label: 'BUILD',
  },
  {
    accentColor: '#7C3AED',
    description: 'Keep photos, receipts, records, specs, and history connected to your build.',
    label: 'DOCUMENT',
  },
  {
    accentColor: '#C0C0C0',
    description: 'Create a permanent record of the mods, achievements, maintenance of your build.',
    label: 'PRESERVE',
  },
];

/** Approved PRODUCT VALUE homepage section. */
export function ProductValueSection() {
  const { width } = useWindowDimensions();
  const isCompact = width < 768;

  return (
    <View style={[styles.section, isCompact && styles.sectionCompact]}>
      <View style={[styles.content, isCompact && styles.contentCompact]}>
        <Text style={[styles.eyebrow, isCompact && styles.eyebrowCompact]}>PRODUCT VALUE</Text>
        <Text style={[styles.heading, isCompact && styles.headingCompact]}>YOUR BUILD. YOUR HISTORY. ONE PLACE</Text>
        <Text style={[styles.body, isCompact && styles.bodyCompact]}>
          WRNC keeps the parts, work, passion, documentation, progress, and history of your build connected - from the first wrench to the final drive.
        </Text>
        <View style={[styles.pillars, isCompact && styles.pillarsCompact]}>
          {pillars.map((pillar) => (
            <MarketingPillar {...pillar} key={pillar.label} style={isCompact && styles.pillarCompact} />
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    backgroundColor: '#080808',
    minHeight: 1000,
  },
  sectionCompact: {
    minHeight: 0,
    paddingHorizontal: 24,
    paddingVertical: 96,
  },
  content: {
    height: 772,
    marginTop: -35,
    position: 'relative',
    width: '100%',
  },
  contentCompact: {
    height: undefined,
    marginTop: 0,
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
    top: 264,
  },
  headingCompact: {
    fontSize: 32,
    lineHeight: 38,
    marginTop: 32,
    position: 'relative',
    top: 0,
  },
  body: {
    color: '#C0C0C0',
    fontSize: 20,
    fontWeight: '600',
    left: 0,
    lineHeight: 24,
    maxWidth: 1361,
    position: 'absolute',
    top: 334,
  },
  bodyCompact: {
    fontSize: 18,
    lineHeight: 23,
    marginTop: 20,
    position: 'relative',
    top: 0,
  },
  pillars: {
    flexDirection: 'row',
    gap: 42,
    left: 0,
    position: 'absolute',
    top: 389,
  },
  pillarsCompact: {
    flexDirection: 'column',
    gap: 42,
    marginTop: 48,
    position: 'relative',
    top: 0,
  },
  pillarCompact: {
    width: '100%',
  },
});
