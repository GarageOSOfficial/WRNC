import React, { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

interface EarlyAccessSectionProps {
  onPrivacy: () => void;
}

type Status = 'idle' | 'submitting' | 'success' | 'error';

export function EarlyAccessSection({ onPrivacy }: EarlyAccessSectionProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState('');

  const submit = async () => {
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail) {
      setStatus('error');
      setMessage('Enter your email address.');
      return;
    }

    setStatus('submitting');
    setMessage('');

    try {
      const referrer = typeof window !== 'undefined' ? window.location.href : '';
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: normalizedEmail, referrer }),
      });

      const result = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(result?.error || 'request_failed');
      }

      setStatus('success');
      setMessage("You're on the WRNC Early Access list.");
      setEmail('');
    } catch {
      setStatus('error');
      setMessage('We could not add you right now. Please try again.');
    }
  };

  const disabled = status === 'submitting';

  return (
    <View nativeID="early-access" style={styles.section}>
      <View style={styles.inner}>
        <Text style={styles.eyebrow}>EARLY ACCESS</Text>
        <Text style={styles.title}>GET IN BEFORE THE GARAGE OPENS.</Text>
        <Text style={styles.copy}>Join the WRNC Early Access list for product updates and first access as testing expands.</Text>
        <View style={styles.form}>
          <TextInput
            accessibilityLabel="Email address"
            autoCapitalize="none"
            autoComplete="email"
            keyboardType="email-address"
            onChangeText={setEmail}
            onSubmitEditing={submit}
            placeholder="you@example.com"
            placeholderTextColor="#737373"
            style={styles.input}
            value={email}
          />
          <Pressable accessibilityRole="button" disabled={disabled} onPress={submit} style={({ pressed }) => [styles.button, pressed && !disabled && styles.buttonPressed, disabled && styles.buttonDisabled]}>
            {disabled ? <ActivityIndicator /> : <Text style={styles.buttonText}>GET EARLY ACCESS</Text>}
          </Pressable>
        </View>
        {!!message && <Text accessibilityLiveRegion="polite" style={[styles.message, status === 'error' && styles.error]}>{message}</Text>}
        <Text style={styles.privacyCopy}>By submitting your email, you are asking WRNC to contact you about Early Access. <Text accessibilityRole="link" onPress={onPrivacy} style={styles.privacyLink}>Privacy</Text></Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: { backgroundColor: '#080808', paddingHorizontal: 24, paddingVertical: 72, width: '100%' },
  inner: { alignSelf: 'center', maxWidth: 760, width: '100%' },
  eyebrow: { color: '#FF6400', fontSize: 12, fontWeight: '800', letterSpacing: 2.2, marginBottom: 14 },
  title: { color: '#FFFFFF', fontSize: 34, fontWeight: '900', letterSpacing: 0.5, lineHeight: 38 },
  copy: { color: '#C0C0C0', fontSize: 17, lineHeight: 26, marginTop: 16, maxWidth: 620 },
  form: { gap: 12, marginTop: 28, width: '100%' },
  input: { backgroundColor: '#111111', borderColor: '#2A2A2A', borderRadius: 10, borderWidth: 1, color: '#FFFFFF', fontSize: 16, minHeight: 52, paddingHorizontal: 16, width: '100%' },
  button: { alignItems: 'center', backgroundColor: '#FF6400', borderRadius: 10, justifyContent: 'center', minHeight: 52, paddingHorizontal: 20 },
  buttonPressed: { opacity: 0.88 },
  buttonDisabled: { opacity: 0.55 },
  buttonText: { color: '#080808', fontSize: 14, fontWeight: '900', letterSpacing: 1.1 },
  message: { color: '#C0C0C0', fontSize: 14, lineHeight: 20, marginTop: 16 },
  error: { color: '#FF9B73' },
  privacyCopy: { color: '#777777', fontSize: 12, lineHeight: 18, marginTop: 14 },
  privacyLink: { color: '#C0C0C0', textDecorationLine: 'underline' },
});
