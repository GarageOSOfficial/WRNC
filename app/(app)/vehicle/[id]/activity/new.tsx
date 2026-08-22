import React, { useState } from 'react';
import { SafeAreaView, ScrollView, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Button } from '../../../../../components/common/Button';
import { Input } from '../../../../../components/common/Input';
import { useCreateActivity } from '../../../../../hooks/useActivity';
import { useVehicle } from '../../../../../hooks/useVehicle';
import { useCurrentWorkspace } from '../../../../../hooks/useWorkspace';
import { ACTIVITY_TYPES, type ActivityType } from '../../../../../types/activity';
import { buildCreateActivityPayload, type CreateActivityFieldErrors } from '../../../../../utils/activityPayload';
import { extractSupabaseErrorMessage, logSupabaseError } from '../../../../../utils/supabaseError';

function ActivityTypeOption({ label, selected, onPress }: { label: ActivityType; selected: boolean; onPress: () => void }) {
  return <Button label={label} variant={selected ? 'primary' : 'secondary'} onPress={onPress} />;
}

export default function NewActivityRoute() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string }>();
  const vehicleId = Array.isArray(params.id) ? params.id[0] : params.id;
  const { data: vehicle } = useVehicle(vehicleId);
  const { data: workspace } = useCurrentWorkspace();
  const createActivity = useCreateActivity();
  const [activityType, setActivityType] = useState<ActivityType>('Progress Update');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [activityDate, setActivityDate] = useState(new Date().toISOString().slice(0, 10));
  const [odometer, setOdometer] = useState('');
  const [cost, setCost] = useState('');
  const [fieldErrors, setFieldErrors] = useState<CreateActivityFieldErrors>({});
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSave = () => {
    if (!vehicleId || !workspace) {
      setErrorMessage('Vehicle or workspace is unavailable.');
      return;
    }

    const payloadResult = buildCreateActivityPayload({ vehicleId, userId: workspace.ownerId, activityType, title, description, activityDate, odometer, cost });
    if (!payloadResult.input) {
      setFieldErrors(payloadResult.errors);
      setErrorMessage(null);
      return;
    }

    setFieldErrors({});
    setErrorMessage(null);
    createActivity.mutate(payloadResult.input, {
      onSuccess: () => router.replace(`/vehicle/${vehicleId}/timeline`),
      onError: (error) => {
        setErrorMessage(extractSupabaseErrorMessage(error, 'Unable to save activity right now. Please try again.'));
        logSupabaseError('NewActivityRoute.handleSave', error, { vehicleId, activityType });
      },
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-wrnc-background">
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Button label="Cancel" variant="secondary" onPress={() => router.back()} />
        <View className="mt-4 rounded-2xl border border-wrnc-border bg-wrnc-surface p-4">
          <Text className="text-2xl font-bold text-wrnc-text-primary">Create Activity</Text>
          <Text className="mt-2 text-sm text-wrnc-text-secondary">
            {vehicle ? `Log work for ${vehicle.year} ${vehicle.make} ${vehicle.model}.` : 'Log work for this vehicle.'}
          </Text>

          <View className="mt-4 gap-3">
            {ACTIVITY_TYPES.map((option) => (
              <ActivityTypeOption key={option} label={option} selected={activityType === option} onPress={() => setActivityType(option)} />
            ))}
          </View>

          <View className="mt-4">
            <Input label="Title" value={title} onChangeText={(nextTitle) => { setTitle(nextTitle); setFieldErrors((currentErrors) => ({ ...currentErrors, title: undefined })); }} error={fieldErrors.title} />
            <Input label="Description" value={description} onChangeText={setDescription} multiline numberOfLines={4} />
            <Input label="Activity Date" value={activityDate} onChangeText={(nextDate) => { setActivityDate(nextDate); setFieldErrors((currentErrors) => ({ ...currentErrors, activityDate: undefined })); }} placeholder="YYYY-MM-DD" error={fieldErrors.activityDate} />
            <Input label="Odometer" value={odometer} onChangeText={(nextOdometer) => { setOdometer(nextOdometer); setFieldErrors((currentErrors) => ({ ...currentErrors, odometer: undefined })); }} keyboardType="number-pad" placeholder="Optional" error={fieldErrors.odometer} />
            <Input label="Cost" value={cost} onChangeText={(nextCost) => { setCost(nextCost); setFieldErrors((currentErrors) => ({ ...currentErrors, cost: undefined })); }} keyboardType="decimal-pad" placeholder="Optional" error={fieldErrors.cost} />
          </View>

          {errorMessage ? <Text className="mb-4 text-sm text-red-600">{errorMessage}</Text> : null}
          <Button label="Save Activity" loading={createActivity.isPending} onPress={handleSave} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}