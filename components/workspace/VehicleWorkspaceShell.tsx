import React, { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useCurrentWorkspace } from '../../hooks/useWorkspace';
import { useVehicles, useCreateVehicle, useArchiveVehicle, useRestoreVehicle, useUpdateVehicle } from '../../hooks/useVehicle';
import { useDocumentationScore } from '../../hooks/useDocumentationScore';
import { Button } from '../common/Button';
import { EmptyState } from '../common/EmptyState';
import { VehicleCard } from './VehicleCard';
import { VehicleDetailsForm } from './VehicleDetailsForm';
import { DocumentationScoreCard } from './DocumentationScoreCard';
import { Input } from '../common/Input';
import { validateVehicleInput } from '../../utils/validators';
import type { Vehicle } from '../../types/vehicle';

export function VehicleWorkspaceShell() {
  const router = useRouter();
  const { data: workspace } = useCurrentWorkspace();
  const { data: vehicles = [], isLoading } = useVehicles(workspace?.id);
  const createVehicle = useCreateVehicle();
  const updateVehicle = useUpdateVehicle();
  const archiveVehicle = useArchiveVehicle();
  const restoreVehicle = useRestoreVehicle();
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ year: '', make: '', model: '', nickname: '', vin: '' });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [activeVehicle, setActiveVehicle] = useState<Vehicle | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const documentationScore = useDocumentationScore(activeVehicle?.id);

  const handleCreate = () => {
    const year = Number(form.year);
    const { valid, errors } = validateVehicleInput({
      year,
      make: form.make,
      model: form.model,
      vin: form.vin || null,
    });

    if (!valid) {
      setFormErrors(errors as Record<string, string>);
      return;
    }

    if (!workspace) return;
    createVehicle.mutate(
      {
        workspaceId: workspace.id,
        year,
        make: form.make.trim(),
        model: form.model.trim(),
        nickname: form.nickname.trim() || null,
        vin: form.vin.trim() || null,
      },
      {
        onSuccess: () => {
          setShowCreate(false);
          setForm({ year: '', make: '', model: '', nickname: '', vin: '' });
          setFormErrors({});
        },
      }
    );
  };

  const handleSelectVehicle = (vehicle: Vehicle) => {
    setActiveVehicle(vehicle);
    setIsEditMode(false);
  };

  if (isLoading) {
    return <Text className="p-4 text-gray-600">Loading vehicles…</Text>;
  }

  return (
    <ScrollView className="flex-1 bg-gray-50 p-4">
      <Text className="mb-4 text-2xl font-bold text-gray-900">Vehicles</Text>
      {!showCreate ? (
        <Button label="Create Vehicle" onPress={() => setShowCreate(true)} />
      ) : (
        <View className="mb-4 rounded-xl border border-gray-200 bg-white p-4">
          <Input label="Year" value={form.year} onChangeText={(year) => setForm((f) => ({ ...f, year }))} keyboardType="number-pad" error={formErrors.year} />
          <Input label="Make" value={form.make} onChangeText={(make) => setForm((f) => ({ ...f, make }))} error={formErrors.make} />
          <Input label="Model" value={form.model} onChangeText={(model) => setForm((f) => ({ ...f, model }))} error={formErrors.model} />
          <Input label="Nickname" value={form.nickname} onChangeText={(nickname) => setForm((f) => ({ ...f, nickname }))} />
          <Input label="VIN" value={form.vin} onChangeText={(vin) => setForm((f) => ({ ...f, vin }))} autoCapitalize="characters" error={formErrors.vin} />
          <View className="flex-row gap-3">
            <View className="flex-1">
              <Button label="Cancel" variant="secondary" onPress={() => setShowCreate(false)} />
            </View>
            <View className="flex-1">
              <Button label="Save" loading={createVehicle.isPending} onPress={handleCreate} />
            </View>
          </View>
        </View>
      )}

      {vehicles.length === 0 ? (
        <EmptyState title="No vehicles yet" message="Create your first vehicle to begin tracking your build." actionLabel="Create Vehicle" onAction={() => setShowCreate(true)} />
      ) : (
        vehicles.map((vehicle) => (
          <View key={vehicle.id} className="mb-3">
            <VehicleCard vehicle={vehicle} onPress={() => handleSelectVehicle(vehicle)} />
            {activeVehicle?.id === vehicle.id ? (
              <View className="rounded-xl border border-gray-200 bg-white p-4">
                <DocumentationScoreCard
                  score={documentationScore.data?.overallScore ?? 0}
                  onPress={() => router.push(`/vehicle/${activeVehicle.id}/passport`)}
                />
                <VehicleDetailsForm
                  vehicleData={activeVehicle}
                  isEditMode={isEditMode}
                  onSubmit={(input) => {
                    updateVehicle.mutate({ id: activeVehicle.id, input }, { onSuccess: () => setIsEditMode(false) });
                  }}
                  onCancel={() => setIsEditMode(false)}
                  isSubmitting={updateVehicle.isPending}
                />
                {!isEditMode ? (
                  <View className="mt-4 flex-row gap-3">
                    <Button label="Timeline" variant="secondary" onPress={() => router.push(`/vehicle/${activeVehicle.id}/timeline`)} />
                    <Button label="Edit" variant="secondary" onPress={() => setIsEditMode(true)} />
                    {activeVehicle.archivedAt ? (
                      <Button label="Restore" onPress={() => restoreVehicle.mutate(activeVehicle.id)} />
                    ) : (
                      <Button label="Archive" variant="danger" onPress={() => archiveVehicle.mutate(activeVehicle.id)} />
                    )}
                  </View>
                ) : null}
              </View>
            ) : null}
          </View>
        ))
      )}
    </ScrollView>
  );
}
