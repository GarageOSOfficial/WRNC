import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { validateVehicleInput } from '../../utils/validators';
import type { UpdateVehicleInput, Vehicle } from '../../types/vehicle';

export interface VehicleDetailsFormProps {
  vehicleData: Vehicle;
  isEditMode: boolean;
  onSubmit: (input: UpdateVehicleInput) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

type FormState = {
  year: string;
  make: string;
  model: string;
  trim: string;
  nickname: string;
  vin: string;
  engine: string;
  transmission: string;
  mileage: string;
};

function toFormState(vehicle: Vehicle): FormState {
  return {
    year: String(vehicle.year),
    make: vehicle.make,
    model: vehicle.model,
    trim: vehicle.trim ?? '',
    nickname: vehicle.nickname ?? '',
    vin: vehicle.vin ?? '',
    engine: vehicle.engine ?? '',
    transmission: vehicle.transmission ?? '',
    mileage: vehicle.mileage !== null ? String(vehicle.mileage) : '',
  };
}

/** Displays vehicle details read-only, or as an editable inline form (Decision #8). */
export function VehicleDetailsForm({
  vehicleData,
  isEditMode,
  onSubmit,
  onCancel,
  isSubmitting,
}: VehicleDetailsFormProps) {
  const [form, setForm] = useState<FormState>(() => toFormState(vehicleData));
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isEditMode) {
      setForm(toFormState(vehicleData));
      setErrors({});
    }
  }, [isEditMode, vehicleData]);

  if (!isEditMode) {
    return (
      <View testID="vehicle-details-readonly">
        <Text className="text-2xl font-bold text-wrnc-text-primary">
          {vehicleData.nickname || `${vehicleData.year} ${vehicleData.make} ${vehicleData.model}`}
        </Text>
        <Text className="mt-1 text-base text-wrnc-text-secondary">
          {vehicleData.year} {vehicleData.make} {vehicleData.model}
          {vehicleData.trim ? ` ${vehicleData.trim}` : ''}
        </Text>
        <View className="mt-4">
          <DetailRow label="VIN" value={vehicleData.vin} />
          <DetailRow label="Engine" value={vehicleData.engine} />
          <DetailRow label="Transmission" value={vehicleData.transmission} />
          <DetailRow
            label="Mileage"
            value={vehicleData.mileage !== null ? `${vehicleData.mileage} mi` : null}
          />
        </View>
      </View>
    );
  }

  const handleSubmit = () => {
    const year = Number(form.year);
    const mileage = form.mileage.trim() ? Number(form.mileage) : null;

    const { valid, errors: validationErrors } = validateVehicleInput({
      year,
      make: form.make,
      model: form.model,
      vin: form.vin.trim() || null,
      mileage,
    });

    if (!valid) {
      setErrors(validationErrors as Record<string, string>);
      return;
    }

    setErrors({});
    onSubmit({
      year,
      make: form.make.trim(),
      model: form.model.trim(),
      trim: form.trim.trim() || null,
      nickname: form.nickname.trim() || null,
      vin: form.vin.trim() || null,
      engine: form.engine.trim() || null,
      transmission: form.transmission.trim() || null,
      mileage,
    });
  };

  return (
    <View testID="vehicle-details-edit">
      <Input
        label="Nickname"
        value={form.nickname}
        onChangeText={(nickname) => setForm((f) => ({ ...f, nickname }))}
      />
      <Input
        label="Year"
        value={form.year}
        onChangeText={(year) => setForm((f) => ({ ...f, year }))}
        keyboardType="number-pad"
        error={errors.year}
      />
      <Input
        label="Make"
        value={form.make}
        onChangeText={(make) => setForm((f) => ({ ...f, make }))}
        error={errors.make}
      />
      <Input
        label="Model"
        value={form.model}
        onChangeText={(model) => setForm((f) => ({ ...f, model }))}
        error={errors.model}
      />
      <Input
        label="Trim"
        value={form.trim}
        onChangeText={(trim) => setForm((f) => ({ ...f, trim }))}
      />
      <Input
        label="VIN"
        value={form.vin}
        onChangeText={(vin) => setForm((f) => ({ ...f, vin }))}
        autoCapitalize="characters"
        error={errors.vin}
      />
      <Input
        label="Engine"
        value={form.engine}
        onChangeText={(engine) => setForm((f) => ({ ...f, engine }))}
      />
      <Input
        label="Transmission"
        value={form.transmission}
        onChangeText={(transmission) => setForm((f) => ({ ...f, transmission }))}
      />
      <Input
        label="Mileage"
        value={form.mileage}
        onChangeText={(mileage) => setForm((f) => ({ ...f, mileage }))}
        keyboardType="number-pad"
        error={errors.mileage}
      />
      <View className="mt-2 flex-row gap-3">
        <View className="flex-1">
          <Button label="Cancel" variant="secondary" onPress={onCancel} disabled={isSubmitting} />
        </View>
        <View className="flex-1">
          <Button label="Save Changes" onPress={handleSubmit} loading={isSubmitting} />
        </View>
      </View>
    </View>
  );
}

function DetailRow({ label, value }: { label: string; value: string | null }) {
  return (
    <View className="mb-2 flex-row justify-between border-b border-wrnc-border py-2">
      <Text className="text-sm text-wrnc-text-secondary">{label}</Text>
      <Text className="text-sm text-wrnc-text-primary">{value || '—'}</Text>
    </View>
  );
}
