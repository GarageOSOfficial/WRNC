import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { MarketingButton } from './MarketingButton';
import { WrncLogo } from './WrncLogo';

type MarketingHeaderProps = {
  onJoin?: () => void;
  onSignIn?: () => void;
};

export function MarketingHeader({ onJoin, onSignIn }: MarketingHeaderProps) {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => setMenuOpen((value) => !value);
  const menuKeyboardProps = {
    onKeyDown: (event: { key: string; preventDefault: () => void }) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        toggleMenu();
      }
    },
  };
  const handleJoin = () => {
    setMenuOpen(false);
    onJoin?.();
  };
  const handleSignIn = () => {
    setMenuOpen(false);
    onSignIn?.();
  };

  return (
    <View style={styles.shell}>
      <View style={[styles.header, isMobile && styles.headerMobile]}>
        <WrncLogo />
        {isMobile ? (
          <Pressable
            {...menuKeyboardProps}
            accessibilityLabel={menuOpen ? 'Close navigation' : 'Open navigation'}
            accessibilityRole="button"
            onPress={toggleMenu}
            style={styles.menuButton}
          >
            <Text style={styles.menuIcon}>{menuOpen ? '×' : '☰'}</Text>
          </Pressable>
        ) : (
          <View style={styles.nav}>
            <Text style={styles.navLink}>ABOUT</Text>
            <Text style={styles.navLink}>FOUNDING BUILDERS</Text>
            <Pressable accessibilityRole="button" onPress={handleSignIn} style={styles.navPressable}><Text style={styles.navLink}>SIGN IN</Text></Pressable>
            <MarketingButton label="JOIN WRNC" onPress={handleJoin} style={styles.joinButton} />
          </View>
        )}
      </View>
      {isMobile && menuOpen ? (
        <View style={styles.mobileMenu}>
          <Text style={styles.mobileLink}>ABOUT</Text>
          <Text style={styles.mobileLink}>FOUNDING BUILDERS</Text>
          <Pressable accessibilityRole="button" onPress={handleSignIn} style={styles.mobilePressable}><Text style={styles.mobileLink}>SIGN IN</Text></Pressable>
          <MarketingButton label="JOIN WRNC" onPress={handleJoin} style={styles.mobileJoin} />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  shell: { backgroundColor: '#080808', borderBottomColor: '#2A2A2A', borderBottomWidth: 1 },
  header: { alignItems: 'center', alignSelf: 'center', flexDirection: 'row', height: 76, justifyContent: 'space-between', maxWidth: 1344, paddingHorizontal: 48, width: '100%' },
  headerMobile: { height: 68, paddingHorizontal: 20 },
  nav: { alignItems: 'center', flexDirection: 'row', gap: 34 },
  navLink: { color: '#C0C0C0', fontSize: 12, fontWeight: '700', letterSpacing: 0.4 },
  navPressable: { alignItems: 'center', justifyContent: 'center', minHeight: 44, minWidth: 64 },
  joinButton: { minWidth: 126 },
  menuButton: { alignItems: 'center', height: 44, justifyContent: 'center', width: 44 },
  menuIcon: { color: '#FFFFFF', fontSize: 25, lineHeight: 28 },
  mobileMenu: { borderTopColor: '#1F1F1F', borderTopWidth: 1, gap: 22, paddingHorizontal: 20, paddingVertical: 24 },
  mobileLink: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
  mobilePressable: { justifyContent: 'center', minHeight: 44 },
  mobileJoin: { alignSelf: 'stretch' },
});
