import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { useRouter } from 'expo-router';
import Head from 'expo-router/head';
import { WrncLogo } from '../components/marketing/WrncLogo';

const RESERVED_NUMBERS = new Set([1, 2, 7]);
const foundingNumbers = Array.from({ length: 23 }, (_, index) => index + 1);

export default function Founding23Screen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  return (
    <>
      <Head>
        <title>Founding 23 | WRNC</title>
        <meta name="description" content="WRNC is recruiting 20 original Founding Builders to validate the product before launch." />
        <meta name="theme-color" content="#080808" />
        <link rel="canonical" href="https://wrnc.app/founding23" />
      </Head>
      <ScrollView contentContainerStyle={styles.page} showsHorizontalScrollIndicator={false}>
        <View style={[styles.header, isMobile && styles.headerMobile]}>
          <Pressable accessibilityLabel="Return to WRNC home" accessibilityRole="link" onPress={() => router.push('/')}>
            <WrncLogo />
          </Pressable>
          <Pressable accessibilityRole="link" onPress={() => router.push('/')} style={styles.homeLink}>
            <Text style={styles.homeLinkText}>WRNC HOME</Text>
          </Pressable>
        </View>

        <View style={[styles.hero, isMobile && styles.sectionMobile]}>
          <Text style={styles.eyebrow}>THE ORIGINAL COHORT</Text>
          <Text style={[styles.title, isMobile && styles.titleMobile]}>Founding 23</Text>
          <Text style={[styles.lead, isMobile && styles.leadMobile]}>
            Twenty-three permanent Founding Builder numbers. Three reserved. Twenty open to builders who will use WRNC on real projects and provide structured product feedback.
          </Text>
          <View style={[styles.stats, isMobile && styles.statsMobile]}>
            <View style={styles.stat}><Text style={styles.statNumber}>23</Text><Text style={styles.statLabel}>PERMANENT NUMBERS</Text></View>
            <View style={styles.stat}><Text style={styles.statNumber}>20</Text><Text style={styles.statLabel}>BUILDERS BEING RECRUITED</Text></View>
            <View style={styles.stat}><Text style={styles.statNumber}>3</Text><Text style={styles.statLabel}>RESERVED</Text></View>
          </View>
        </View>

        <View style={[styles.section, isMobile && styles.sectionMobile]}>
          <Text style={styles.sectionTitle}>Built for product validation</Text>
          <Text style={styles.body}>
            Founding 23 is a permanent record of WRNC's original builder cohort. It is not a subscription tier, a follower contest, or a leaderboard. Selection is based on active participation with a real vehicle build.
          </Text>
          <View style={styles.requirements}>
            {[
              'Document an active or completed vehicle build in WRNC.',
              'Use the product consistently during launch validation.',
              'Provide direct, structured feedback on what works and what fails.',
              'Help prove that WRNC solves real documentation problems for builders.',
            ].map((item) => <View key={item} style={styles.requirement}><Text style={styles.bullet}>•</Text><Text style={styles.requirementText}>{item}</Text></View>)}
          </View>
        </View>

        <View style={[styles.section, styles.numberSection, isMobile && styles.sectionMobile]}>
          <Text style={styles.sectionTitle}>The permanent numbers</Text>
          <Text style={styles.body}>Numbers are WRNC-assigned, unique, permanent, and never recycled, reassigned, or sold.</Text>
          <View style={styles.numberGrid}>
            {foundingNumbers.map((number) => {
              const reserved = RESERVED_NUMBERS.has(number);
              return (
                <View accessibilityLabel={`Founding Builder ${String(number).padStart(3, '0')}, ${reserved ? 'reserved' : 'open'}`} key={number} style={[styles.numberCard, reserved ? styles.numberReserved : styles.numberOpen]}>
                  <Text style={styles.numberValue}>#{String(number).padStart(3, '0')}</Text>
                  <Text style={[styles.numberStatus, reserved && styles.numberStatusReserved]}>{reserved ? 'RESERVED' : 'OPEN'}</Text>
                </View>
              );
            })}
          </View>
        </View>

        <View style={[styles.section, styles.applySection, isMobile && styles.sectionMobile]}>
          <Text style={styles.sectionTitle}>Apply for the Founding 23</Text>
          <Text style={styles.body}>
            Application intake is awaiting the Founder-approved collection destination. No applicant data will be sent to an unapproved service.
          </Text>
          <Pressable accessibilityRole="button" accessibilityState={{ disabled: true }} disabled style={styles.disabledButton}>
            <Text style={styles.disabledButtonText}>APPLY FOR THE FOUNDING 23</Text>
          </Pressable>
          <Text style={styles.gateText}>APPLICATION INTAKE GATE PENDING</Text>
        </View>

        <View style={styles.footer}>
          <WrncLogo />
          <Text style={styles.footerText}>© 2026 WRNC. A Swear Like A Sailor, LLC company.</Text>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  page: { backgroundColor: '#080808', width: '100%' },
  header: { alignItems: 'center', alignSelf: 'center', borderBottomColor: '#2A2A2A', borderBottomWidth: 1, flexDirection: 'row', height: 76, justifyContent: 'space-between', maxWidth: 1344, paddingHorizontal: 48, width: '100%' },
  headerMobile: { height: 68, paddingHorizontal: 20 },
  homeLink: { alignItems: 'center', justifyContent: 'center', minHeight: 44, paddingHorizontal: 8 },
  homeLinkText: { color: '#C0C0C0', fontSize: 12, fontWeight: '700', letterSpacing: 0.4 },
  hero: { alignSelf: 'center', maxWidth: 1344, paddingHorizontal: 48, paddingVertical: 80, width: '100%' },
  eyebrow: { color: '#FF6400', fontSize: 13, fontWeight: '800', letterSpacing: 1.4 },
  title: { color: '#FFFFFF', fontSize: 72, fontWeight: '800', letterSpacing: -2, lineHeight: 76, marginTop: 12 },
  titleMobile: { fontSize: 48, lineHeight: 52 },
  lead: { color: '#C0C0C0', fontSize: 21, lineHeight: 31, marginTop: 24, maxWidth: 850 },
  leadMobile: { fontSize: 17, lineHeight: 26 },
  stats: { flexDirection: 'row', flexWrap: 'wrap', gap: 16, marginTop: 42 },
  statsMobile: { flexDirection: 'column' },
  stat: { backgroundColor: '#141414', borderColor: '#2A2A2A', borderRadius: 8, borderWidth: 1, flexGrow: 1, minWidth: 210, padding: 22 },
  statNumber: { color: '#FFFFFF', fontSize: 36, fontWeight: '800' },
  statLabel: { color: '#C0C0C0', fontSize: 11, fontWeight: '700', letterSpacing: 0.7, marginTop: 6 },
  section: { alignSelf: 'center', borderTopColor: '#2A2A2A', borderTopWidth: 1, maxWidth: 1344, paddingHorizontal: 48, paddingVertical: 64, width: '100%' },
  sectionMobile: { paddingHorizontal: 20, paddingVertical: 48 },
  sectionTitle: { color: '#FFFFFF', fontSize: 36, fontWeight: '700', letterSpacing: -0.6, lineHeight: 42 },
  body: { color: '#C0C0C0', fontSize: 17, lineHeight: 27, marginTop: 16, maxWidth: 850 },
  requirements: { gap: 14, marginTop: 28, maxWidth: 850 },
  requirement: { alignItems: 'flex-start', flexDirection: 'row', gap: 12 },
  bullet: { color: '#FF6400', fontSize: 20, lineHeight: 24 },
  requirementText: { color: '#FFFFFF', flex: 1, fontSize: 16, lineHeight: 24 },
  numberSection: { backgroundColor: '#0D0D0D' },
  numberGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 30 },
  numberCard: { borderRadius: 6, borderWidth: 1, minWidth: 104, paddingHorizontal: 14, paddingVertical: 14 },
  numberOpen: { backgroundColor: '#141414', borderColor: '#5B21FF' },
  numberReserved: { backgroundColor: '#1B1B1B', borderColor: '#555555' },
  numberValue: { color: '#FFFFFF', fontSize: 17, fontWeight: '800' },
  numberStatus: { color: '#8F6BFF', fontSize: 9, fontWeight: '800', letterSpacing: 0.8, marginTop: 4 },
  numberStatusReserved: { color: '#A0A0A0' },
  applySection: { alignItems: 'flex-start' },
  disabledButton: { alignItems: 'center', backgroundColor: '#FF6400', borderRadius: 4, justifyContent: 'center', marginTop: 28, minHeight: 48, paddingHorizontal: 24 },
  disabledButtonText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
  gateText: { color: '#A0A0A0', fontSize: 10, fontWeight: '700', letterSpacing: 0.8, marginTop: 10 },
  footer: { alignItems: 'flex-start', alignSelf: 'center', borderTopColor: '#2A2A2A', borderTopWidth: 1, gap: 14, maxWidth: 1344, paddingHorizontal: 48, paddingVertical: 44, width: '100%' },
  footerText: { color: '#A0A0A0', fontSize: 12 },
});
