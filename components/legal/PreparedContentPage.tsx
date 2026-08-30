import React from 'react';
import { Linking, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { WrncContactEmail } from '../../lib/contactEmails';
import { WrncLogo } from '../marketing/WrncLogo';

export type PreparedContentSection = {
  body?: string[];
  items?: string[];
  title: string;
  contacts?: { label: string; email: WrncContactEmail }[];
};

type PreparedContentPageProps = {
  description: string;
  eyebrow: string;
  onBack: () => void;
  sections: PreparedContentSection[];
  status: string;
  title: string;
};

/** Shared presentation shell for prepared public-information and legal-draft routes. */
export function PreparedContentPage({ description, eyebrow, onBack, sections, status, title }: PreparedContentPageProps) {
  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsHorizontalScrollIndicator={false}>
        <View style={styles.container}>
          <Pressable accessibilityLabel="Back to WRNC" accessibilityRole="link" onPress={onBack} style={styles.logoLink}>
            <WrncLogo />
          </Pressable>

          <View accessibilityRole="summary" style={styles.statusBox}>
            <Text style={styles.statusLabel}>STATUS</Text>
            <Text style={styles.statusText}>{status}</Text>
          </View>

          <Text style={styles.eyebrow}>{eyebrow}</Text>
          <Text accessibilityRole="header" style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>

          <View style={styles.sections}>
            {sections.map((section) => (
              <View key={section.title} style={styles.section}>
                <Text accessibilityRole="header" style={styles.sectionTitle}>{section.title}</Text>
                {section.body?.map((paragraph) => <Text key={paragraph} style={styles.body}>{paragraph}</Text>)}
                {section.contacts?.map(({ label, email }) => (
                  <Pressable
                    key={email}
                    accessibilityRole="link"
                    accessibilityLabel={`${label}: ${email}`}
                    onPress={() => Linking.openURL(`mailto:${email}`)}
                    style={styles.contact}
                  >
                    <Text style={styles.contactText}>{label}: {email}</Text>
                  </Pressable>
                ))}
                {section.items?.map((item) => (
                  <View key={item} style={styles.itemRow}>
                    <Text style={styles.bullet}>•</Text>
                    <Text style={styles.itemText}>{item}</Text>
                  </View>
                ))}
              </View>
            ))}
          </View>

          <Text style={styles.footer}>Built for Builders.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: '#080808', flex: 1 },
  scrollContent: { flexGrow: 1 },
  container: { alignSelf: 'center', maxWidth: 920, paddingHorizontal: 24, paddingVertical: 48, width: '100%' },
  logoLink: { alignSelf: 'flex-start', marginBottom: 48, minHeight: 44, justifyContent: 'center' },
  statusBox: { backgroundColor: '#24170F', borderColor: '#FF6400', borderRadius: 4, borderWidth: 1, padding: 16 },
  statusLabel: { color: '#FF8F5B', fontSize: 12, fontWeight: '700', letterSpacing: 1.2 },
  statusText: { color: '#FFFFFF', fontSize: 15, lineHeight: 22, marginTop: 6 },
  eyebrow: { color: '#FF6400', fontSize: 14, fontWeight: '700', letterSpacing: 1.2, marginTop: 44 },
  title: { color: '#FFFFFF', fontSize: 42, fontWeight: '700', lineHeight: 48, marginTop: 12 },
  description: { color: '#C0C0C0', fontSize: 18, lineHeight: 28, marginTop: 18, maxWidth: 760 },
  sections: { gap: 24, marginTop: 40 },
  section: { backgroundColor: '#14161A', borderColor: '#34373D', borderRadius: 6, borderWidth: 1, padding: 24 },
  sectionTitle: { color: '#FFFFFF', fontSize: 21, fontWeight: '700', lineHeight: 27, marginBottom: 12 },
  body: { color: '#C0C0C0', fontSize: 16, lineHeight: 25, marginTop: 8 },
  contact: { justifyContent: 'center', minHeight: 44, marginTop: 8 },
  contactText: { color: '#C0C0C0', fontSize: 16, lineHeight: 25, textDecorationLine: 'underline' },
  itemRow: { alignItems: 'flex-start', flexDirection: 'row', gap: 10, marginTop: 8 },
  bullet: { color: '#FF6400', fontSize: 18, lineHeight: 24 },
  itemText: { color: '#C0C0C0', flex: 1, fontSize: 16, lineHeight: 24 },
  footer: { borderTopColor: '#34373D', borderTopWidth: 1, color: '#C0C0C0', fontSize: 13, marginTop: 40, paddingTop: 24 },
});
