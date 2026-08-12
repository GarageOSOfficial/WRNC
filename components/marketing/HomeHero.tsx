import React from 'react';
import { Image, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { MarketingButton } from './MarketingButton';

type HomeHeroProps = {
  onGetStarted?: () => void;
};

/** The approved opening WRNC.app homepage section. */
export function HomeHero({ onGetStarted }: HomeHeroProps) {
  const { width } = useWindowDimensions();
  const isCompact = width < 768;
  const isStacked = width < 1360;

  return (
    <View style={[styles.section, isCompact && styles.sectionCompact]}>
      <View style={[styles.content, isStacked && styles.contentStacked]}>
        <View style={[styles.copy, isCompact && styles.copyCompact]}>
          <View style={styles.eyebrowRow}>
            <View style={styles.eyebrowRule} />
            <Text style={styles.eyebrow}>THE CAR CULTURE PLATFORM</Text>
          </View>
          <Text style={[styles.heading, isCompact && styles.headingCompact]}>
            EVERY BUILD DESERVES A{' '}
            <Text style={styles.headingAccent}>LIVING RECORD.</Text>
          </Text>
          <Text style={[styles.body, isCompact && styles.bodyCompact]}>
            WRNC brings your parts, progress, documents, maintenance, and memories together—so the full story
            of every vehicle lasts as long as the vehicle does.
          </Text>
          <MarketingButton label="START YOUR BUILD" onPress={onGetStarted} style={styles.cta} />
          <View style={[styles.proofRow, isCompact && styles.proofRowCompact]}>
            <View style={styles.proofItem}><Text style={styles.proofTitle}>ONE GARAGE</Text><Text style={styles.proofCopy}>Every vehicle</Text></View>
            <View style={styles.proofItem}><Text style={styles.proofTitle}>ONE TIMELINE</Text><Text style={styles.proofCopy}>Every milestone</Text></View>
            <View style={styles.proofItem}><Text style={styles.proofTitle}>ONE LEGACY</Text><Text style={styles.proofCopy}>Built to last</Text></View>
          </View>
        </View>
        <View style={[styles.visual, isStacked && styles.visualStacked]}>
          <View style={styles.proofStage} testID="hero-proof-stage">
            <View style={styles.stageGrid} testID="hero-proof-grid" />
            <View style={styles.desktopFrame} testID="hero-proof-dashboard-frame">
            <View style={styles.frameBar}><View style={styles.frameDot} /><View style={styles.frameDot} /><View style={styles.frameDot} /><Text style={styles.frameLabel}>WRNC / INVENTORY</Text></View>
            <Image
              accessibilityLabel="WRNC inventory dashboard"
              resizeMode="cover"
              source={require('../../assets/marketing/wrnc-product-inventory-v2.webp')}
              style={styles.desktopArtwork}
            />
            </View>
            <View style={[styles.phoneFrame, isCompact && styles.phoneFrameCompact]} testID="hero-proof-phone-frame">
              <Image accessibilityLabel="WRNC activity timeline" resizeMode="cover" source={require('../../assets/marketing/wrnc-product-activity-v2.webp')} style={styles.phoneArtwork} />
            </View>
            <View style={styles.scoreCard} testID="hero-proof-score-card"><Text style={styles.scoreLabel}>DOCUMENTATION SCORE</Text><Text style={styles.scoreValue}>94%</Text><Text style={styles.scoreStatus}>EXCELLENT</Text></View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    backgroundColor: '#080808',
    minHeight: 780,
    overflow: 'hidden',
    paddingHorizontal: 48,
    paddingVertical: 88,
    justifyContent: 'center',
  },
  sectionCompact: {
    minHeight: 0,
    paddingHorizontal: 24,
    paddingVertical: 64,
  },
  content: {
    alignItems: 'center',
    alignSelf: 'center',
    flexDirection: 'row',
    gap: 48,
    maxWidth: 1344,
    width: '100%',
  },
  contentStacked: {
    alignItems: 'stretch',
    flexDirection: 'column',
    gap: 48,
  },
  copy: {
    flex: 0.92,
    maxWidth: 610,
    minWidth: 0,
  },
  copyCompact: {
    maxWidth: undefined,
  },
  eyebrow: {
    color: '#C0C0C0',
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 17,
    letterSpacing: 1.2,
  },
  eyebrowRow: { alignItems: 'center', flexDirection: 'row', gap: 12, marginBottom: 28 },
  eyebrowRule: { backgroundColor: '#FF6400', height: 2, width: 24 },
  heading: {
    color: '#FFFFFF',
    fontSize: 64,
    fontWeight: '700',
    letterSpacing: -1,
    lineHeight: 66,
  },
  headingAccent: { color: '#8A8C93' },
  headingCompact: {
    fontSize: 38,
    lineHeight: 44,
  },
  body: {
    color: '#C0C0C0',
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 24,
    marginTop: 10,
    maxWidth: 974,
    minHeight: 55,
  },
  bodyCompact: {
    fontSize: 18,
    lineHeight: 23,
    minHeight: 0,
  },
  cta: {
    marginTop: 42,
  },
  visual: {
    flex: 1.25,
    minHeight: 520,
    minWidth: 0,
    position: 'relative',
  },
  visualStacked: {
    alignSelf: 'center',
    maxWidth: 860,
    width: '100%',
  },
  proofStage: {
    alignSelf: 'flex-end',
    aspectRatio: 1.42,
    maxWidth: 820,
    minHeight: 420,
    position: 'relative',
    width: '100%',
  },
  stageGrid: {
    ...StyleSheet.absoluteFillObject,
    borderColor: '#17171C',
    borderWidth: 1,
    opacity: 0.8,
  },
  desktopFrame: {
    backgroundColor: '#101014',
    aspectRatio: 1.7,
    borderColor: '#3B3B44',
    borderWidth: 1,
    left: '2%',
    overflow: 'hidden',
    padding: 8,
    position: 'absolute',
    top: '10%',
    width: '82%',
  },
  frameBar: { alignItems: 'center', flexDirection: 'row', gap: 5, height: 22, paddingHorizontal: 4 },
  frameDot: { backgroundColor: '#48484E', borderRadius: 4, height: 5, width: 5 },
  frameLabel: { color: '#77777D', fontSize: 8, marginLeft: 7 },
  desktopArtwork: {
    ...StyleSheet.absoluteFillObject,
    height: '100%',
    width: '100%',
  },
  phoneFrame: {
    aspectRatio: 711 / 1536,
    backgroundColor: '#050506',
    borderColor: '#53535B',
    borderRadius: 24,
    borderWidth: 1,
    bottom: '3%',
    overflow: 'hidden',
    padding: 5,
    position: 'absolute',
    right: '2%',
    width: '19%',
  },
  phoneFrameCompact: { width: '27%' },
  phoneArtwork: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 19,
    height: '100%',
    width: '100%',
  },
  scoreCard: {
    backgroundColor: '#101014',
    borderColor: '#34343A',
    borderLeftColor: '#FF6400',
    borderLeftWidth: 2,
    borderWidth: 1,
    bottom: '4%',
    left: '2%',
    paddingHorizontal: 16,
    paddingVertical: 13,
    position: 'absolute',
  },
  scoreLabel: { color: '#7F7E85', fontSize: 8, letterSpacing: 1 },
  scoreValue: { color: '#FFFFFF', fontSize: 25, fontWeight: '700', marginTop: 5 },
  scoreStatus: { color: '#83D248', fontSize: 9, marginTop: 2 },
  proofRow: { borderTopColor: '#25252B', borderTopWidth: 1, flexDirection: 'row', gap: 28, marginTop: 48, paddingTop: 20 },
  proofRowCompact: { justifyContent: 'space-between', gap: 10 },
  proofItem: { flex: 1, gap: 5, minWidth: 0 },
  proofTitle: { color: '#FFFFFF', fontSize: 10, fontWeight: '700', letterSpacing: 0.7 },
  proofCopy: { color: '#77767C', fontSize: 10 },
  artwork: {
    width: '100%',
  },
});
