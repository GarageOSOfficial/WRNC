import React from 'react';
import { Image, StyleSheet, Text, useWindowDimensions, View } from 'react-native';

const productViews = [
  {
    caption: 'SEE THE WHOLE BUILD AT A GLANCE',
    source: require('../../assets/marketing/wrnc-build-dashboard.jpeg'),
  },
  {
    caption: 'TURN EVERY WRENCH INTO HISTORY',
    source: require('../../assets/marketing/wrnc-activity-timeline.jpeg'),
  },
  {
    caption: 'KEEP EVERY RECORD WITH THE CAR',
    source: require('../../assets/marketing/wrnc-document-library.jpeg'),
  },
];

/** A product-led proof section built from the approved WRNC concept artwork. */
export function ProductShowcaseSection() {
  const { width } = useWindowDimensions();
  const isCompact = width < 768;

  return (
    <View style={[styles.section, isCompact && styles.sectionCompact]}>
      <View style={styles.content}>
        <Text style={styles.eyebrow}>BUILT AROUND THE CAR</Text>
        <Text style={[styles.heading, isCompact && styles.headingCompact]}>YOUR ENTIRE BUILD, IN FOCUS.</Text>
        <Text style={[styles.body, isCompact && styles.bodyCompact]}>
          From the first part to the final drive, WRNC turns scattered details into one living record.
        </Text>
        <View style={styles.grid}>
          <View style={[styles.card, styles.cardWide]}>
            <Image resizeMode="cover" source={productViews[0].source} style={styles.imageWide} />
            <Text style={styles.caption}>{productViews[0].caption}</Text>
          </View>

          <View style={[styles.portraitRow, isCompact && styles.portraitRowCompact]}>
            {productViews.slice(1).map((view) => (
              <View key={view.caption} style={[styles.card, styles.portraitCard, isCompact && styles.portraitCardCompact]}>
                <Image resizeMode="contain" source={view.source} style={[styles.imagePortrait, isCompact && styles.imagePortraitCompact]} />
                <Text style={styles.caption}>{view.caption}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    backgroundColor: '#101216',
    paddingHorizontal: 48,
    paddingVertical: 120,
  },
  sectionCompact: {
    paddingHorizontal: 24,
    paddingVertical: 80,
  },
  content: {
    alignSelf: 'center',
    maxWidth: 1344,
    width: '100%',
  },
  eyebrow: {
    color: '#FF6400',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1.4,
  },
  heading: {
    color: '#FFFFFF',
    fontSize: 44,
    fontWeight: '700',
    lineHeight: 50,
    marginTop: 20,
  },
  headingCompact: {
    fontSize: 32,
    lineHeight: 38,
  },
  body: {
    color: '#A7ABB3',
    fontSize: 19,
    lineHeight: 28,
    marginTop: 18,
    maxWidth: 760,
  },
  bodyCompact: {
    fontSize: 17,
    lineHeight: 25,
  },
  grid: {
    marginTop: 56,
  },
  card: {
    backgroundColor: '#080808',
    borderColor: '#282B31',
    borderRadius: 12,
    borderWidth: 1,
    flexGrow: 1,
    minWidth: 280,
    overflow: 'hidden',
  },
  cardWide: {
    width: '100%',
  },
  portraitRow: {
    flexDirection: 'row',
    gap: 18,
    marginTop: 18,
  },
  portraitRowCompact: {
    flexDirection: 'column',
  },
  portraitCard: {
    flex: 1,
  },
  portraitCardCompact: {
    width: '100%',
  },
  imageWide: {
    aspectRatio: 16 / 8.6,
    width: '100%',
  },
  imagePortrait: {
    backgroundColor: '#080808',
    height: 520,
    width: '100%',
  },
  imagePortraitCompact: {
    height: 360,
  },
  caption: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    paddingHorizontal: 18,
    paddingVertical: 16,
  },
});
