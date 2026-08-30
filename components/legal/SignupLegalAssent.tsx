import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type SignupLegalAssentProps = {
  enabled?: boolean;
  onPrivacy: () => void;
  onTerms: () => void;
};

/** Prepared assent UI. It remains hidden until final legal text receives Founder approval. */
export function SignupLegalAssent({ enabled = false, onPrivacy, onTerms }: SignupLegalAssentProps) {
  if (!enabled) return null;

  return (
    <View accessibilityLabel="Legal agreement" style={styles.row}>
      <Text style={styles.text}>By creating an account, you agree to the </Text>
      <Pressable accessibilityRole="link" onPress={onTerms}><Text style={styles.link}>Terms</Text></Pressable>
      <Text style={styles.text}> and acknowledge the </Text>
      <Pressable accessibilityRole="link" onPress={onPrivacy}><Text style={styles.link}>Privacy Notice</Text></Pressable>
      <Text style={styles.text}>.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 20 },
  text: { color: '#A0A0A0', fontSize: 13, lineHeight: 20 },
  link: { color: '#C0C0C0', fontSize: 13, lineHeight: 20, textDecorationLine: 'underline' },
});
