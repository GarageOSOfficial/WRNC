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
                <View pointerEvents="none" style={styles.logoMask}>
                  <Image
                    accessibilityIgnoresInvertColors
                    resizeMode="contain"
                    source={require('../../assets/brand/wrnc-master-logo-hyper-silver-080808.png')}
                    style={styles.logoMark}
                  />
                </View>
              </View>
              <Text style={styles.caption}>{view.caption}</Text>
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
  logoMask: {
    alignItems: 'center',
    backgroundColor: '#080808',
    borderBottomRightRadius: 8,
    left: 0,
    paddingBottom: 8,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 8,
    position: 'absolute',
    top: 0,
  },
  logoMark: {
    height: 22,
    width: 106,
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
