import React from 'react';
import { Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { MarketingButton } from './MarketingButton';

type FinalCtaSectionProps = { onJoin?: () => void };

export function FinalCtaSection({ onJoin }: FinalCtaSectionProps) {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  return (
    <View style={[styles.section, isMobile && styles.sectionMobile]}>
      <View style={styles.content}>
        <Text style={[styles.heading, isMobile && styles.headingMobile]}>Built for builders, not algorithms.</Text>
        <Text style={styles.body}>WRNC is not social media.{`\n`}It’s your personal build database.</Text>
        <View style={[styles.actions, isMobile && styles.actionsMobile]}>
          <MarketingButton label="JOIN WRNC" onPress={onJoin} />
          <Pressable accessibilityRole="link" style={styles.secondary}><Text style={styles.secondaryText}>BECOME A FOUNDING BUILDER →</Text></Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: { backgroundColor: '#141414', borderBottomColor: '#2A2A2A', borderBottomWidth: 1, borderTopColor: '#2A2A2A', borderTopWidth: 1, paddingHorizontal: 48, paddingVertical: 72 },
  sectionMobile: { paddingHorizontal: 20, paddingVertical: 52 },
  content: { alignSelf: 'center', maxWidth: 1344, width: '100%' },
  heading: { color: '#FFFFFF', fontSize: 42, fontWeight: '700', letterSpacing: -0.8, lineHeight: 47, maxWidth: 650 },
  headingMobile: { fontSize: 32, lineHeight: 37 },
  body: { color: '#C0C0C0', fontSize: 17, lineHeight: 25, marginTop: 18 },
  actions: { alignItems: 'center', flexDirection: 'row', gap: 24, marginTop: 30 },
  actionsMobile: { alignItems: 'stretch', flexDirection: 'column', gap: 12 },
  secondary: { justifyContent: 'center', minHeight: 44 },
  secondaryText: { color: '#FFFFFF', fontSize: 12, fontWeight: '700', letterSpacing: 0.3 },
});