import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import Head from 'expo-router/head';
import { FinalCtaSection } from '../components/marketing/FinalCtaSection';
import { HowWrncSection } from '../components/marketing/HowWrncSection';
import { MarketingHeader } from '../components/marketing/MarketingHeader';
import { HomeHero } from '../components/marketing/HomeHero';
import { ProductValueSection } from '../components/marketing/ProductValueSection';
import { ProductShowcaseSection } from '../components/marketing/ProductShowcaseSection';
import { WhyWrncSection } from '../components/marketing/WhyWrncSection';

/** Web-only WRNC.app entry point. The native root remains Mission Control. */
export default function WebsiteHomeScreen() {
  const router = useRouter();
  const openSignup = () => router.push('/signup');

  return (
    <>
      <Head>
        <title>WRNC — Build Something Worth Remembering</title>
        <meta
          name="description"
          content="WRNC is the car culture platform for people who build, modify, maintain, and obsess over their builds."
        />
        <meta name="theme-color" content="#080808" />
        <link rel="canonical" href="https://wrnc.app/" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="WRNC" />
        <meta property="og:title" content="WRNC — Build Something Worth Remembering" />
        <meta
          property="og:description"
          content="The car culture platform for people who build, modify, maintain, and obsess over their builds."
        />
        <meta property="og:url" content="https://wrnc.app/" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="WRNC — Build Something Worth Remembering" />
        <meta
          name="twitter:description"
          content="The car culture platform for people who build, modify, maintain, and obsess over their builds."
        />
      </Head>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <MarketingHeader onJoin={openSignup} />
        <HomeHero onGetStarted={openSignup} />
        <ProductShowcaseSection />
        <WhyWrncSection />
        <HowWrncSection />
        <ProductValueSection />
        <FinalCtaSection onJoin={openSignup} />
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  content: {
    backgroundColor: '#080808',
  },
});
