import Head from 'expo-router/head';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, useWindowDimensions, View } from 'react-native';
import { WrncLogo } from '../../components/marketing/WrncLogo';

type ApplicationField =
  | 'name'
  | 'email'
  | 'location'
  | 'vehicle'
  | 'yearMakeModel'
  | 'buildDescription'
  | 'buildStage'
  | 'builderWork'
  | 'documentationMethod'
  | 'wrncGoal'
  | 'socialHandle';

type ApplicationDraft = Record<ApplicationField, string>;

const INITIAL_DRAFT: ApplicationDraft = {
  name: '',
  email: '',
  location: '',
  vehicle: '',
  yearMakeModel: '',
  buildDescription: '',
  buildStage: '',
  builderWork: '',
  documentationMethod: '',
  wrncGoal: '',
  socialHandle: '',
};

const REQUIRED_FIELDS: { key: Exclude<ApplicationField, 'socialHandle'>; label: string; multiline?: boolean; placeholder: string }[] = [
  { key: 'name', label: 'NAME', placeholder: 'Your name' },
  { key: 'email', label: 'EMAIL', placeholder: 'you@example.com' },
  { key: 'location', label: 'GENERAL LOCATION', placeholder: 'City and state, province, or region' },
  { key: 'vehicle', label: 'VEHICLE', placeholder: 'What are you building?' },
  { key: 'yearMakeModel', label: 'YEAR / MAKE / MODEL', placeholder: 'Example: 1989 BMW 325i' },
  { key: 'buildDescription', label: 'BUILD DESCRIPTION', multiline: true, placeholder: 'Describe the build, its purpose, and what makes it yours.' },
  { key: 'buildStage', label: 'CURRENT BUILD STAGE', multiline: true, placeholder: 'Where is the build today?' },
  { key: 'builderWork', label: 'WORK YOU PERFORM', multiline: true, placeholder: 'What work do you personally perform or manage?' },
  { key: 'documentationMethod', label: 'CURRENT DOCUMENTATION METHOD', multiline: true, placeholder: 'How do you currently record parts, work, photos, and history?' },
  { key: 'wrncGoal', label: 'WHAT SHOULD WRNC SOLVE?', multiline: true, placeholder: 'What documentation problem do you need WRNC to solve?' },
];

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export default function Founding23ApplyScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const [draft, setDraft] = useState<ApplicationDraft>(INITIAL_DRAFT);
  const [willingToParticipate, setWillingToParticipate] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isReviewing, setIsReviewing] = useState(false);

  const updateField = (key: ApplicationField, value: string) => {
    setDraft((current) => ({ ...current, [key]: value }));
  };

  const handleReview = () => {
    const missingField = REQUIRED_FIELDS.find(({ key }) => !draft[key].trim());

    if (missingField) {
      setError(`Complete ${missingField.label.toLowerCase()} before reviewing your application.`);
      return;
    }

    if (!isValidEmail(draft.email)) {
      setError('Enter a valid email address.');
      return;
    }

    if (!willingToParticipate) {
      setError('Confirm that you can actively use WRNC and provide structured feedback.');
      return;
    }

    setError(null);
    setIsReviewing(true);
  };

  return (
    <>
      <Head>
        <title>Apply for the Founding 23 | WRNC</title>
        <meta name="description" content="Prepare an application to join WRNC's original Founding Builder cadre." />
        <meta name="theme-color" content="#080808" />
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <ScrollView contentContainerStyle={styles.page} keyboardShouldPersistTaps="handled" showsHorizontalScrollIndicator={false}>
        <View style={[styles.header, isMobile && styles.headerMobile]}>
          <Pressable accessibilityLabel="Return to WRNC home" accessibilityRole="link" onPress={() => router.push('/')}>
            <WrncLogo />
          </Pressable>
          <Pressable accessibilityRole="link" onPress={() => router.push('/founding23')} style={styles.backLink}>
            <Text style={styles.backLinkText}>BACK TO FOUNDING 23</Text>
          </Pressable>
        </View>

        <View style={[styles.content, isMobile && styles.contentMobile]}>
          <Text style={styles.eyebrow}>FOUNDING 23 APPLICATION</Text>
          <Text style={[styles.title, isMobile && styles.titleMobile]}>Show us the build.</Text>
          <Text style={styles.lead}>
            Founding 23 is for builders who will document real work in WRNC and provide direct, structured product feedback.
          </Text>

          <View accessibilityRole="alert" style={styles.privacyNotice}>
            <Text style={styles.privacyTitle}>PRIVATE INTAKE PREVIEW</Text>
            <Text style={styles.privacyText}>
              This form currently validates and reviews your answers only. It does not store, upload, or transmit applicant data. Final submission remains locked until WRNC approves the first-party collection destination.
            </Text>
          </View>

          {isReviewing ? (
            <View style={styles.reviewCard}>
              <Text style={styles.sectionTitle}>Review your application</Text>
              {REQUIRED_FIELDS.map(({ key, label }) => (
                <View key={key} style={styles.reviewRow}>
                  <Text style={styles.reviewLabel}>{label}</Text>
                  <Text style={styles.reviewValue}>{draft[key]}</Text>
                </View>
              ))}
              {draft.socialHandle.trim() ? (
                <View style={styles.reviewRow}>
                  <Text style={styles.reviewLabel}>SOCIAL HANDLE</Text>
                  <Text style={styles.reviewValue}>{draft.socialHandle}</Text>
                </View>
              ) : null}
              <View style={styles.reviewRow}>
                <Text style={styles.reviewLabel}>PRODUCT PARTICIPATION</Text>
                <Text style={styles.reviewValue}>Confirmed</Text>
              </View>
              <Pressable accessibilityRole="button" onPress={() => setIsReviewing(false)} style={styles.secondaryButton}>
                <Text style={styles.secondaryButtonText}>EDIT APPLICATION</Text>
              </Pressable>
              <Pressable accessibilityRole="button" accessibilityState={{ disabled: true }} disabled style={styles.disabledButton}>
                <Text style={styles.disabledButtonText}>SUBMISSION DESTINATION PENDING</Text>
              </Pressable>
              <Text style={styles.gateText}>NO APPLICANT DATA HAS BEEN SENT</Text>
            </View>
          ) : (
            <View style={styles.formCard}>
              <Text style={styles.sectionTitle}>Builder and vehicle</Text>
              {REQUIRED_FIELDS.map(({ key, label, multiline, placeholder }) => (
                <View key={key}>
                  <Text style={styles.label}>{label}</Text>
                  <TextInput
                    accessibilityLabel={label}
                    autoCapitalize={key === 'email' ? 'none' : 'sentences'}
                    keyboardType={key === 'email' ? 'email-address' : 'default'}
                    multiline={multiline}
                    onChangeText={(value) => updateField(key, value)}
                    placeholder={placeholder}
                    placeholderTextColor="#777777"
                    style={[styles.input, multiline && styles.textArea]}
                    textAlignVertical={multiline ? 'top' : 'center'}
                    value={draft[key]}
                  />
                </View>
              ))}

              <Text style={styles.label}>SOCIAL HANDLE (OPTIONAL)</Text>
              <TextInput
                accessibilityLabel="SOCIAL HANDLE (OPTIONAL)"
                autoCapitalize="none"
                onChangeText={(value) => updateField('socialHandle', value)}
                placeholder="@builder"
                placeholderTextColor="#777777"
                style={styles.input}
                value={draft.socialHandle}
              />

              <Pressable
                accessibilityRole="checkbox"
                accessibilityState={{ checked: willingToParticipate }}
                onPress={() => setWillingToParticipate((current) => !current)}
                style={styles.checkboxRow}
              >
                <View style={[styles.checkbox, willingToParticipate && styles.checkboxChecked]}>
                  {willingToParticipate ? <Text style={styles.checkmark}>✓</Text> : null}
                </View>
                <Text style={styles.checkboxText}>
                  I am willing to actively use WRNC on this build and provide structured product feedback.
                </Text>
              </Pressable>

              <Text style={styles.photoNote}>
                Build photos will be requested only after WRNC approves a private upload destination.
              </Text>

              {error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}

              <Pressable accessibilityRole="button" onPress={handleReview} style={styles.primaryButton}>
                <Text style={styles.primaryButtonText}>REVIEW APPLICATION</Text>
              </Pressable>
            </View>
          )}
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  page: { backgroundColor: '#080808', minHeight: '100%', width: '100%' },
  header: { alignItems: 'center', alignSelf: 'center', borderBottomColor: '#2A2A2A', borderBottomWidth: 1, flexDirection: 'row', height: 76, justifyContent: 'space-between', maxWidth: 1344, paddingHorizontal: 48, width: '100%' },
  headerMobile: { height: 68, paddingHorizontal: 20 },
  backLink: { alignItems: 'center', justifyContent: 'center', minHeight: 44, paddingHorizontal: 8 },
  backLinkText: { color: '#C0C0C0', fontSize: 12, fontWeight: '700', letterSpacing: 0.4 },
  content: { alignSelf: 'center', maxWidth: 900, paddingHorizontal: 48, paddingVertical: 72, width: '100%' },
  contentMobile: { paddingHorizontal: 20, paddingVertical: 48 },
  eyebrow: { color: '#FF6400', fontSize: 13, fontWeight: '800', letterSpacing: 1.4 },
  title: { color: '#FFFFFF', fontSize: 58, fontWeight: '800', letterSpacing: -1.5, lineHeight: 64, marginTop: 12 },
  titleMobile: { fontSize: 42, lineHeight: 46 },
  lead: { color: '#C0C0C0', fontSize: 18, lineHeight: 28, marginTop: 20, maxWidth: 760 },
  privacyNotice: { backgroundColor: '#141414', borderColor: '#5B21FF', borderRadius: 6, borderWidth: 1, marginTop: 32, padding: 20 },
  privacyTitle: { color: '#FFFFFF', fontSize: 12, fontWeight: '800', letterSpacing: 0.8 },
  privacyText: { color: '#C0C0C0', fontSize: 14, lineHeight: 21, marginTop: 8 },
  formCard: { backgroundColor: '#111318', borderColor: '#34373D', borderRadius: 8, borderWidth: 1, marginTop: 32, padding: 28 },
  reviewCard: { backgroundColor: '#111318', borderColor: '#34373D', borderRadius: 8, borderWidth: 1, marginTop: 32, padding: 28 },
  sectionTitle: { color: '#FFFFFF', fontSize: 28, fontWeight: '700', lineHeight: 34 },
  label: { color: '#C0C0C0', fontSize: 12, fontWeight: '700', letterSpacing: 0.6, marginBottom: 8, marginTop: 22 },
  input: { backgroundColor: '#080808', borderColor: '#4C5057', borderRadius: 4, borderWidth: 1, color: '#FFFFFF', fontSize: 16, minHeight: 48, paddingHorizontal: 14 },
  textArea: { minHeight: 112, paddingTop: 14 },
  checkboxRow: { alignItems: 'flex-start', flexDirection: 'row', gap: 12, marginTop: 28 },
  checkbox: { alignItems: 'center', borderColor: '#6A6E76', borderRadius: 3, borderWidth: 1, height: 22, justifyContent: 'center', width: 22 },
  checkboxChecked: { backgroundColor: '#5B21FF', borderColor: '#8F6BFF' },
  checkmark: { color: '#FFFFFF', fontSize: 14, fontWeight: '800' },
  checkboxText: { color: '#FFFFFF', flex: 1, fontSize: 15, lineHeight: 22 },
  photoNote: { color: '#A0A0A0', fontSize: 13, lineHeight: 19, marginTop: 20 },
  error: { color: '#FF8F5B', fontSize: 14, lineHeight: 20, marginTop: 20 },
  primaryButton: { alignItems: 'center', backgroundColor: '#FF6400', borderRadius: 4, justifyContent: 'center', marginTop: 28, minHeight: 48, paddingHorizontal: 20 },
  primaryButtonText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
  secondaryButton: { alignItems: 'center', borderColor: '#5A5E66', borderRadius: 4, borderWidth: 1, justifyContent: 'center', marginTop: 28, minHeight: 48, paddingHorizontal: 20 },
  secondaryButtonText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
  disabledButton: { alignItems: 'center', backgroundColor: '#2C2F35', borderRadius: 4, justifyContent: 'center', marginTop: 14, minHeight: 48, opacity: 0.7, paddingHorizontal: 20 },
  disabledButtonText: { color: '#C0C0C0', fontSize: 13, fontWeight: '700' },
  gateText: { color: '#A0A0A0', fontSize: 10, fontWeight: '700', letterSpacing: 0.8, marginTop: 10, textAlign: 'center' },
  reviewRow: { borderBottomColor: '#2A2A2A', borderBottomWidth: 1, paddingVertical: 16 },
  reviewLabel: { color: '#A0A0A0', fontSize: 11, fontWeight: '800', letterSpacing: 0.7 },
  reviewValue: { color: '#FFFFFF', fontSize: 15, lineHeight: 22, marginTop: 6 },
});
