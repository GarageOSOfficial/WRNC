import React, { useState } from 'react';
import { SafeAreaView, ScrollView, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Button } from '../../../../../components/common/Button';
import { Input } from '../../../../../components/common/Input';
import { useCreateActivity } from '../../../../../hooks/useActivity';
import { useVehicle } from '../../../../../hooks/useVehicle';
import { useCurrentWorkspace } from '../../../../../hooks/useWorkspace';
import { ACTIVITY_TYPES, type ActivityType } from '../../../../../types/activity';

function ActivityTypeOption({
  label,
  selected,
  onPress,
}: {
  label: ActivityType;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Button
      label={label}
      variant={selected ? 'primary' : 'secondary'}
      onPress={onPress}
    />
  );
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
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSave = () => {
    if (!vehicleId || !workspace) {
      setErrorMessage('Vehicle or workspace is unavailable.');
      return;
    }

    createActivity.mutate(
      {
        vehicleId,
        userId: workspace.ownerId,
        activityType,
        title,
        description,
        activityDate,
        metadata: {
          ...(odometer ? { odometer: Number(odometer) } : {}),
          ...(cost ? { cost: Number(cost) } : {}),
        },
      },
      {
        onSuccess: () => {
          router.replace(`/vehicle/${vehicleId}/timeline`);
        },
        onError: (error) => {
          setErrorMessage(error instanceof Error ? error.message : 'Unable to save activity.');
        },
      }
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1 p-4">
        <Button label="Cancel" variant="secondary" onPress={() => router.back()} />
        <View className="mt-4 rounded-2xl border border-gray-200 bg-white p-4">
          <Text className="text-2xl font-bold text-gray-900">Create Activity</Text>
          <Text className="mt-2 text-sm text-gray-500">
            {vehicle ? `Log work for ${vehicle.year} ${vehicle.make} ${vehicle.model}.` : 'Log work for this vehicle.'}
          </Text>

          <View className="mt-4 gap-3">
            {ACTIVITY_TYPES.map((option) => (
              <ActivityTypeOption
                key={option}
                label={option}
                selected={activityType === option}
                onPress={() => setActivityType(option)}
              />
            ))}
          </View>

          <View className="mt-4">
            <Input label="Title" value={title} onChangeText={setTitle} />
            <Input label="Description" value={description} onChangeText={setDescription} multiline numberOfLines={4} />
            <Input label="Activity Date" value={activityDate} onChangeText={setActivityDate} placeholder="YYYY-MM-DD" />
            <Input label="Odometer" value={odometer} onChangeText={setOdometer} keyboardType="number-pad" placeholder="Optional" />
            <Input label="Cost" value={cost} onChangeText={setCost} keyboardType="decimal-pad" placeholder="Optional" />
          </View>

          {errorMessage ? <Text className="mb-4 text-sm text-red-600">{errorMessage}</Text> : null}

          <Button label="Save Activity" loading={createActivity.isPending} onPress={handleSave} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}