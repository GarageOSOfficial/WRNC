import React from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import { MarketingButton } from './MarketingButton';
import { WrncLogo } from './WrncLogo';

type MarketingHeaderProps = {
  onJoin?: () => void;
};

/** Approved global WRNC.app navigation shell. */
export function MarketingHeader({ onJoin }: MarketingHeaderProps) {
  const { width } = useWindowDimensions();
  const isNarrow = width < 400;

  return (
    <View style={[styles.header, isNarrow && styles.headerNarrow]}>
      <WrncLogo />
      <MarketingButton
        label="JOIN THE GARAGE"
        onPress={onJoin}
        style={[styles.joinButton, isNarrow && styles.joinButtonNarrow]}
        tone="light"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    backgroundColor: '#080808',
    flexDirection: 'row',
    borderBottomColor: '#1F2228',
    borderBottomWidth: 1,
    height: 88,
    justifyContent: 'space-between',
    paddingHorizontal: 48,
  },
  joinButton: {
    minWidth: 169,
  },
  headerNarrow: {
    alignItems: 'flex-start',
    flexDirection: 'column',
    height: 145,
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  joinButtonNarrow: {
    alignSelf: 'flex-start',
  },
});
