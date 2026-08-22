import React from 'react';
import { Image, Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { MarketingButton } from './MarketingButton';

type HomeHeroProps = { onGetStarted?: () => void; onSignIn?: () => void };

export function HomeHero({ onGetStarted, onSignIn }: HomeHeroProps) {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const isTablet = width >= 768 && width < 1100;

  return (
    <View style={[styles.section, isMobile && styles.sectionMobile]}>
      <View style={[styles.content, (isMobile || isTablet) && styles.contentStacked]}>
        <View style={styles.copy}>
          <Text style={[styles.heading, isMobile && styles.headingMobile]}>Every build deserves a living record.</Text>
          <Text style={[styles.body, isMobile && styles.bodyMobile]}>
            WRNC is the operating system for automotive builders. Organize, document, and preserve your vehicle’s journey.
          </Text>
          <View style={[styles.actions, isMobile && styles.actionsMobile]}>
            <MarketingButton label="JOIN WRNC" onPress={onGetStarted} style={styles.primary} />
            <Pressable accessibilityRole="button" onPress={onSignIn} style={styles.secondaryButton}>
              <Text style={styles.secondary}>SIGN IN →</Text>
            </Pressable>
          </View>
        </View>
        <View style={[styles.visual, (isMobile || isTablet) && styles.visualStacked]}>
          <Image
            accessibilityLabel="WRNC product preview"
            resizeMode="contain"
            source={require('../../assets/marketing/wrnc-marketing-hero-v2.webp')}
            style={styles.heroArtwork}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: { backgroundColor: '#080808', paddingHorizontal: 48, paddingVertical: 64 },
  sectionMobile: { paddingHorizontal: 20, paddingVertical: 44 },
  content: { alignItems: 'center', alignSelf: 'center', flexDirection: 'row', gap: 36, maxWidth: 1344, width: '100%' },
  contentStacked: { alignItems: 'stretch', flexDirection: 'column', gap: 28 },
  copy: { flex: 0.78, maxWidth: 520, minWidth: 0 },
  heading: { color: '#FFFFFF', fontSize: 58, fontWeight: '700', letterSpacing: -1.6, lineHeight: 62 },
  headingMobile: { fontSize: 40, letterSpacing: -0.8, lineHeight: 43 },
  body: { color: '#C0C0C0', fontSize: 18, lineHeight: 27, marginTop: 22, maxWidth: 470 },
  bodyMobile: { fontSize: 16, lineHeight: 24 },
  actions: { alignItems: 'center', flexDirection: 'row', gap: 26, marginTop: 32 },
  actionsMobile: { alignItems: 'stretch', flexDirection: 'column', gap: 12 },
  primary: { minWidth: 142 },
  secondaryButton: { alignItems: 'center', justifyContent: 'center', minHeight: 44, paddingHorizontal: 8 },
  secondary: { color: '#FFFFFF', fontSize: 13, fontWeight: '700', letterSpacing: 0.4 },
  visual: { flex: 1.22, minHeight: 430, minWidth: 0 },
  visualStacked: { alignSelf: 'center', maxWidth: 820, minHeight: 0, width: '100%' },
  heroArtwork: { aspectRatio: 16 / 9, height: undefined, width: '100%' },
});