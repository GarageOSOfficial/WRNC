import React from 'react';
import { Linking, Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { WrncLogo } from './WrncLogo';

const productLinks = ['About', 'Founding Builders', 'Shop', 'Sign In'];
const legalLinks = ['Privacy', 'Terms', 'Contact', 'Support'];

type MarketingFooterProps = { onSignIn?: () => void; onShop?: () => void };

export function MarketingFooter({ onSignIn, onShop }: MarketingFooterProps) {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const isCompact = width < 1100;
  return (
    <View style={[styles.footer, isCompact && styles.footerCompact, isMobile && styles.footerMobile]}>
      <View style={[styles.content, isCompact && styles.contentCompact]}>
        <View style={styles.brand}>
          <WrncLogo />
          <Text style={styles.tagline}>The OS for Automotive Builders.</Text>
          <Text style={styles.socials}>Instagram   Facebook   YouTube   Discord</Text>
        </View>
        <View style={styles.links}>{productLinks.map((item) => item === 'Sign In' ? (
          <Pressable accessibilityRole="button" key={item} onPress={onSignIn} style={styles.linkPressable}><Text style={styles.link}>{item}</Text></Pressable>
        ) : item === 'Shop' ? (
          <Pressable accessibilityRole="link" key={item} onPress={onShop} style={styles.linkPressable}><Text style={styles.link}>{item}</Text></Pressable>
        ) : <Text key={item} style={styles.link}>{item}</Text>)}</View>
        <View style={styles.links}>{legalLinks.map((item) => item === 'Contact' || item === 'Support' ? (
          <Pressable accessibilityRole="link" key={item} onPress={() => Linking.openURL(`mailto:${item.toLowerCase()}@wrnc.app`)} style={styles.linkPressable}>
            <Text style={styles.link}>{item}</Text>
          </Pressable>
        ) : <Text key={item} style={styles.link}>{item}</Text>)}</View>
        <View style={styles.legal}>
          <Text style={styles.legalText}>© 2026 WRNC.</Text>
          <Text style={styles.legalText}>A Swear Like A Sailor, LLC company.</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: { backgroundColor: '#080808', paddingHorizontal: 48, paddingVertical: 44 },
  footerCompact: { paddingHorizontal: 32 },
  footerMobile: { paddingHorizontal: 20, paddingVertical: 40 },
  content: { alignItems: 'flex-start', alignSelf: 'center', flexDirection: 'row', gap: 64, justifyContent: 'space-between', maxWidth: 1344, width: '100%' },
  contentCompact: { flexDirection: 'column', gap: 28 },
  brand: { gap: 10 },
  tagline: { color: '#C0C0C0', fontSize: 12 },
  socials: { color: '#FFFFFF', fontSize: 12, lineHeight: 22 },
  links: { gap: 11 },
  link: { color: '#C0C0C0', fontSize: 13 },
  linkPressable: { justifyContent: 'center', minHeight: 44 },
  legal: { gap: 5 },
  legalText: { color: '#C0C0C0', fontSize: 12 },
});
