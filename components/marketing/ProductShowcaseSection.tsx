import React from 'react';
import { Image, StyleSheet, Text, useWindowDimensions, View } from 'react-native';

const productViews = [
  {
    caption: 'BUILD PASSPORT™',
    description: 'A permanent record of every part, milestone, receipt, and decision behind the build.',
    source: require('../../assets/marketing/wrnc-product-inventory-v2.webp'),
  },
  {
    caption: 'PARTS INVENTORY',
    description: 'Know what you own, where it lives, what it cost, and what still needs attention.',
    source: require('../../assets/marketing/wrnc-product-activity-v2.webp'),
  },
  {
    caption: 'DOCUMENTATION SCORE™',
    description: 'See what is captured, what is missing, and how complete the vehicle story really is.',
    source: require('../../assets/marketing/wrnc-product-documents-v2.webp'),
  },
];

/** A product-led proof section built from the approved WRNC concept artwork. */
export function ProductShowcaseSection() {
  const { width } = useWindowDimensions();
  const isCompact = width < 768;
  const isMedium = width >= 768 && width < 1100;
  const columns = isCompact ? 1 : isMedium ? 2 : 3;
  const gap = 18;
  const horizontalPadding = isCompact ? 24 : 48;
  const gridMaxWidth = 1200;
  const availableWidth = Math.min(gridMaxWidth, Math.max(0, width - horizontalPadding * 2));
  const cardWidth = Math.min(380, Math.floor((availableWidth - gap * (columns - 1)) / columns));
  const imageHeight = isCompact ? 340 : 440;

  return (
    <View style={[styles.section, isCompact && styles.sectionCompact]}>
      <View style={styles.content}>
        <Text style={styles.eyebrow}>BUILT AROUND THE CAR</Text>
        <Text style={[styles.heading, isCompact && styles.headingCompact]}>YOUR ENTIRE BUILD, IN FOCUS.</Text>
        <Text style={[styles.body, isCompact && styles.bodyCompact]}>
          From the first part to the final drive, WRNC turns scattered details into one living record.
        </Text>
        <View style={styles.grid}>
          {productViews.map((view) => (
            <View key={view.caption} style={[styles.card, { width: cardWidth, maxWidth: 380 }]}>
              <View style={[styles.imageFrame, { height: imageHeight }]}>
                <Image resizeMode="contain" source={view.source} style={styles.image} />
              </View>
              <View style={styles.cardCopy}>
                <Text style={styles.caption}>{view.caption}</Text>
                <Text style={styles.description}>{view.description}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    backgroundColor: '#101216',
    paddingHorizontal: 48,
    paddingVertical: 88,
  },
  sectionCompact: {
    paddingHorizontal: 24,
    paddingVertical: 64,
  },
  content: {
    alignSelf: 'center',
    maxWidth: 1200,
    width: '100%',
  },
  eyebrow: {
    color: '#C0C0C0',
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
    alignSelf: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 18,
    justifyContent: 'center',
    marginTop: 40,
    maxWidth: 1200,
    width: '100%',
  },
  card: {
    backgroundColor: '#080808',
    borderColor: '#282B31',
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  imageFrame: {
    backgroundColor: '#080808',
    overflow: 'hidden',
    position: 'relative',
    width: '100%',
  },
  image: {
    backgroundColor: '#080808',
    height: '100%',
    width: '100%',
  },
  caption: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
  },
  cardCopy: { borderTopColor: '#282B31', borderTopWidth: 1, minHeight: 112, paddingHorizontal: 18, paddingVertical: 16 },
  description: { color: '#8F929A', fontSize: 12, lineHeight: 18, marginTop: 9 },
});
