import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { KeyboardSafeScrollView } from '../../components/common/KeyboardSafeScrollView';
import { isMotorSandboxEnabled, lookupMotorVin } from '../../services/api/motor';
import type { MotorVinLookup } from '../../types/motor';

const MOCK_VIN = '1HGCM82633A004352';

export default function MotorSandboxScreen() {
  const router = useRouter();
  const [vin, setVin] = useState(MOCK_VIN);
  const [result, setResult] = useState<MotorVinLookup | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isMotorSandboxEnabled()) {
    return (
      <SafeAreaView className="flex-1 bg-wrnc-background p-6">
        <Text className="text-xl font-bold text-wrnc-text-primary">MOTOR test surface disabled</Text>
        <Text className="mt-2 text-wrnc-text-secondary">Enable the internal sandbox flag in a test build to use this route.</Text>
        <View className="mt-6"><Button label="Back to Vehicles" variant="secondary" onPress={() => router.replace('/workspace')} /></View>
      </SafeAreaView>
    );
  }

  const runLookup = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      setResult(await lookupMotorVin(vin));
    } catch (lookupError) {
      setError(lookupError instanceof Error ? lookupError.message : 'MOTOR lookup failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-wrnc-background">
      <KeyboardSafeScrollView contentContainerStyle={{ padding: 16 }}>
        <Text className="text-2xl font-bold text-wrnc-text-primary">MOTOR Sandbox</Text>
        <Text className="mt-2 text-sm text-wrnc-text-secondary">Internal, read-only VIN lookup. Results are never saved to a vehicle.</Text>
        <View className="mt-6 rounded-xl border border-wrnc-border bg-wrnc-surface p-4">
          <Input label="VIN" value={vin} onChangeText={setVin} autoCapitalize="characters" maxLength={17} />
          <Button label="Look Up VIN" onPress={runLookup} loading={loading} />
          {error ? <Text className="mt-4 text-sm text-semantic-error">{error}</Text> : null}
          {result ? (
            <View testID="motor-vin-result" className="mt-5 border-t border-wrnc-border pt-4">
              <Text className="text-lg font-semibold text-wrnc-text-primary">{[result.year, result.make, result.model].filter(Boolean).join(' ')}</Text>
              <Text className="mt-2 text-sm text-wrnc-text-secondary">Trim: {result.trim ?? 'Unknown'}</Text>
              <Text className="mt-1 text-sm text-wrnc-text-secondary">Engine: {result.engine ?? 'Unknown'}</Text>
              <Text className="mt-1 text-sm text-wrnc-text-secondary">Transmission: {result.transmission ?? 'Unknown'}</Text>
              <Text className="mt-3 text-xs text-semantic-warning">Source: {result.source}. Test data only.</Text>
            </View>
          ) : null}
        </View>
        <View className="mt-6"><Button label="Back to Vehicles" variant="secondary" onPress={() => router.replace('/workspace')} /></View>
      </KeyboardSafeScrollView>
    </SafeAreaView>
  );
}
