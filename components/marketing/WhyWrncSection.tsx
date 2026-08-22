import React from 'react';
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';

const benefits = [
  { title: 'Organize your vehicle.', body: 'Keep everything in one place. Parts, notes, files, and more.' },
  { title: 'Document your build.', body: 'Capture every step of your build with photos, notes, and records.' },
  { title: 'Preserve its history.', body: 'Create a permanent record that adds value for years to come.' },
];

export function WhyWrncSection() {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  return (
    <View style={[styles.section, isMobile && styles.sectionMobile]}>
      <View style={[styles.content, isMobile && styles.contentMobile]}>
        {benefits.map((benefit, index) => (
          <View key={benefit.title} style={[styles.item, !isMobile && index > 0 && styles.itemBorder]}>
            <Text style={styles.index}>0{index + 1}</Text>
            <Text style={styles.title}>{benefit.title}</Text>
            <Text style={styles.body}>{benefit.body}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: { backgroundColor: '#080808', borderBottomColor: '#2A2A2A', borderBottomWidth: 1, borderTopColor: '#2A2A2A', borderTopWidth: 1, paddingHorizontal: 48 },
  sectionMobile: { paddingHorizontal: 20 },
  content: { alignSelf: 'center', flexDirection: 'row', maxWidth: 1344, width: '100%' },
  contentMobile: { flexDirection: 'column' },
  item: { flex: 1, minHeight: 190, paddingHorizontal: 34, paddingVertical: 34 },
  itemBorder: { borderLeftColor: '#2A2A2A', borderLeftWidth: 1 },
  index: { color: '#C0C0C0', fontSize: 11, fontWeight: '700', letterSpacing: 1 },
  title: { color: '#FFFFFF', fontSize: 23, fontWeight: '700', lineHeight: 27, marginTop: 18 },
  body: { color: '#C0C0C0', fontSize: 14, lineHeight: 21, marginTop: 12, maxWidth: 310 },
});
