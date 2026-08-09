import React from 'react';
import { Image, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

type WrncLogoProps = {
  style?: StyleProp<ViewStyle>;
};

/**
 * Canonical full WRNC mark. The source artwork is the approved Hyper Silver
 * master; the frame only presents its existing letterforms at logo scale.
 */
export function WrncLogo({ style }: WrncLogoProps) {
  return (
    <View accessible accessibilityLabel="WRNC" style={[styles.frame, style]}>
      <Image
        accessibilityIgnoresInvertColors
        resizeMode="contain"
        source={require('../../assets/brand/wrnc-master-logo-hyper-silver-080808.png')}
        style={styles.artwork}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    height: 32,
    overflow: 'hidden',
    position: 'relative',
    width: 145,
  },
  artwork: {
    height: 107,
    left: -10,
    position: 'absolute',
    top: -35,
    width: 160,
  },
});
