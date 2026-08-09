import React from 'react';
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { MarketingPillar } from './MarketingPillar';

const pillars = [
  {
    accentColor: '#FF6400',
    description: 'Keep every part, record, receipt, photo, and detail of your build in one place.',
    label: 'ORGANIZE',
  },
  {
    accentColor: '#7C3AED',
    description: 'Track what you’re building, what you’ve modified, and what’s next - from first wrench turn to final drive.',
    label: 'BUILD',
  },
  {
    accentColor: '#C0C0C0',
    description: 'Build a permanent record of the work, history, and story behind the vehicle you built.',
    label: 'PRESERVE',
  },
];

/** Approved WHY WRNC homepage section. */
export function WhyWrncSection() {
  const { width } = useWindowDimensions();
  const isCompact = width < 768;

  return (
    <View style={[styles.section, isCompact && styles.sectionCompact]}>
      <View style={[styles.content, isCompact && styles.contentCompact]}>
        <Text style={[styles.eyebrow, isCompact && styles.eyebrowCompact]}>BUILT FOR THE OBSESSED</Text>
        <Text style={[styles.heading, isCompact && styles.headingCompact]}>
          YOUR BUILD DESERVES MORE THAN A FOLDER
        </Text>
        <Text style={[styles.body, isCompact && styles.bodyCompact]}>
          WRNC brings your entire build into one place - parts, progress, maintenance, documentation, and the story behind it.
        </Text>
        <View style={[styles.pillars, isCompact && styles.pillarsCompact]}>
          {pillars.map((pillar, index) => (
            <MarketingPillar
              {...pillar}
              key={pillar.label}
              style={[
                styles.pillar,
                index === 1 && styles.pillarSecond,
                index === 2 && styles.pillarThird,
                isCompact && styles.pillarCompact,
              ]}
            />
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
    height: 750,
    position: 'relative',
    width: '100%',
  },
  contentCompact: {
    height: undefined,
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
    maxWidth: 1157,
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
    height: 450,
    left: 0,
    position: 'absolute',
    top: 389,
    width: '100%',
  },
  pillarsCompact: {
    height: undefined,
    marginTop: 48,
    position: 'relative',
    top: 0,
  },
  pillar: {
    left: 0,
    position: 'absolute',
    top: 0,
  },
  pillarSecond: {
    top: 142,
  },
  pillarThird: {
    top: 283,
  },
  pillarCompact: {
    marginBottom: 42,
    position: 'relative',
    top: 0,
    width: '100%',
  },
});
