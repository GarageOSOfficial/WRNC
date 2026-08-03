import type { ActivityType, CreateActivityInput } from '../types/activity';

// ─── Vehicle validation ───────────────────────────────────────────────────────

export interface ValidationResult {
  valid: boolean;
  errors: Partial<Record<'year' | 'make' | 'model' | 'vin' | 'mileage', string>>;
}

export const MIN_YEAR = 1900;
export const VIN_LENGTH = 17;

export interface VehicleValidationInput {
  year?: number | null;
  make?: string | null;
  model?: string | null;
  vin?: string | null;
  mileage?: number | null;
}

/** Validates required/optional vehicle fields per WRNC-001 acceptance criteria. */
export function validateVehicleInput(
  input: VehicleValidationInput
): ValidationResult {
  const errors: ValidationResult['errors'] = {};
  const maxYear = new Date().getFullYear() + 1;

  if (input.year === null || input.year === undefined) {
    errors.year = 'Year is required.';
  } else if (!Number.isInteger(input.year) || input.year < MIN_YEAR || input.year > maxYear) {
    errors.year = `Year must be a whole number between ${MIN_YEAR} and ${maxYear}.`;
  }

  if (!input.make || !input.make.trim()) {
    errors.make = 'Make is required.';
  }

  if (!input.model || !input.model.trim()) {
    errors.model = 'Model is required.';
  }

  if (input.vin) {
    if (input.vin.length !== VIN_LENGTH) {
      errors.vin = `VIN must be ${VIN_LENGTH} characters.`;
    } else if (!/^[A-HJ-NPR-Z0-9]+$/i.test(input.vin)) {
      errors.vin = 'VIN contains invalid characters.';
    }
  }

  if (input.mileage !== null && input.mileage !== undefined && input.mileage < 0) {
    errors.mileage = 'Mileage cannot be negative.';
  }

  return { valid: Object.keys(errors).length === 0, errors };
}

// ─── Activity validation ──────────────────────────────────────────────────────

export const ACTIVITY_TYPES: ActivityType[] = [
  'purchased_part',
  'installed_part',
  'maintenance',
  'progress_update',
  'journal_entry',
  'record_upload',
];

export interface ActivityValidationResult {
  valid: boolean;
  errors: Partial<Record<'vehicleId' | 'type' | 'metadata', string>>;
}

/** Validates required activity fields per WRNC-002 acceptance criteria. */
export function validateActivityInput(
  input: Partial<CreateActivityInput>
): ActivityValidationResult {
  const errors: ActivityValidationResult['errors'] = {};

  if (!input.vehicleId || !input.vehicleId.trim()) {
    errors.vehicleId = 'Vehicle ID is required.';
  }

  if (!input.type) {
    errors.type = 'Activity type is required.';
  } else if (!ACTIVITY_TYPES.includes(input.type)) {
    errors.type = `Activity type must be one of: ${ACTIVITY_TYPES.join(', ')}.`;
  }

  if (input.type === 'purchased_part') {
    const meta = (input.metadata ?? {}) as Record<string, unknown>;
    if (!meta.partName || !(meta.partName as string).trim()) {
      errors.metadata = 'Part name is required for Purchased Part activities.';
    }
  }

  if (input.type === 'installed_part') {
    const meta = (input.metadata ?? {}) as Record<string, unknown>;
    if (!meta.partName || !(meta.partName as string).trim()) {
      errors.metadata = 'Part name is required for Installed Part activities.';
    }
  }

  if (input.type === 'maintenance') {
    const meta = (input.metadata ?? {}) as Record<string, unknown>;
    if (!meta.serviceType || !(meta.serviceType as string).trim()) {
      errors.metadata = 'Service type is required for Maintenance activities.';
    }
  }

  if (input.type === 'record_upload') {
    const meta = (input.metadata ?? {}) as Record<string, unknown>;
    if (!meta.fileUrl || !(meta.fileUrl as string).trim()) {
      errors.metadata = 'File URL is required for Record Upload activities.';
    }
    if (!meta.fileName || !(meta.fileName as string).trim()) {
      errors.metadata = 'File name is required for Record Upload activities.';
    }
  }

  return { valid: Object.keys(errors).length === 0, errors };
}

export const ACTIVITY_TYPES: ActivityType[] = [
  'purchased_part',
  'installed_part',
  'maintenance',
  'progress_update',
  'journal_entry',
  'record_upload',
];

export interface ActivityValidationResult {
  valid: boolean;
  errors: Partial<Record<'vehicleId' | 'type' | 'metadata', string>>;
}

/** Validates required activity fields per WRNC-002 acceptance criteria. */
export function validateActivityInput(
  input: Partial<CreateActivityInput>
): ActivityValidationResult {
  const errors: ActivityValidationResult['errors'] = {};

  if (!input.vehicleId || !input.vehicleId.trim()) {
    errors.vehicleId = 'Vehicle ID is required.';
  }

  if (!input.type) {
    errors.type = 'Activity type is required.';
  } else if (!ACTIVITY_TYPES.includes(input.type)) {
    errors.type = `Activity type must be one of: ${ACTIVITY_TYPES.join(', ')}.`;
  }

  if (input.type === 'purchased_part') {
    const meta = (input.metadata ?? {}) as Record<string, unknown>;
    if (!meta.partName || !(meta.partName as string).trim()) {
      errors.metadata = 'Part name is required for Purchased Part activities.';
    }
  }

  if (input.type === 'installed_part') {
    const meta = (input.metadata ?? {}) as Record<string, unknown>;
    if (!meta.partName || !(meta.partName as string).trim()) {
      errors.metadata = 'Part name is required for Installed Part activities.';
    }
  }

  if (input.type === 'maintenance') {
    const meta = (input.metadata ?? {}) as Record<string, unknown>;
    if (!meta.serviceType || !(meta.serviceType as string).trim()) {
      errors.metadata = 'Service type is required for Maintenance activities.';
    }
  }

  if (input.type === 'record_upload') {
    const meta = (input.metadata ?? {}) as Record<string, unknown>;
    if (!meta.fileUrl || !(meta.fileUrl as string).trim()) {
      errors.metadata = 'File URL is required for Record Upload activities.';
    }
    if (!meta.fileName || !(meta.fileName as string).trim()) {
      errors.metadata = 'File name is required for Record Upload activities.';
    }
  }

  return { valid: Object.keys(errors).length === 0, errors };
}
