import React from 'react';
import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

type MarketingPillarProps = {
  accentColor: string;
  description: string;
  label: string;
  style?: StyleProp<ViewStyle>;
};

/** Reusable labeled value pillar used across WRNC marketing sections. */
export function MarketingPillar({ accentColor, description, label, style }: MarketingPillarProps) {
  return (
    <View style={[styles.pillar, style]}>
      <View style={[styles.accent, { backgroundColor: accentColor }]} />
      <Text style={[styles.label, { color: accentColor }]}>{label}</Text>
      <Text style={styles.description}>{description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pillar: {
    height: 100,
    width: 360,
  },
  accent: {
    borderRadius: 2,
    height: 4,
    left: 0,
    position: 'absolute',
    top: 0,
    width: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    left: 0,
    lineHeight: 17,
    position: 'absolute',
    top: 9,
  },
  description: {
    color: '#C0C0C0',
    fontSize: 16,
    fontWeight: '600',
    left: 0,
    lineHeight: 19,
    position: 'absolute',
    top: 26,
    right: 0,
  },
});
