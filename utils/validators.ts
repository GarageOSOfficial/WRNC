import type { ActivityType, CreateActivityInput } from '../types/activity';
import type { CreateDocumentInput } from '../types/document';

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

  const normalizedVin = input.vin?.trim().toUpperCase() || null;

  if (normalizedVin) {
    if (normalizedVin.length !== VIN_LENGTH) {
      errors.vin = `VIN must be ${VIN_LENGTH} characters.`;
    } else if (!/^[A-HJ-NPR-Z0-9]{17}$/.test(normalizedVin)) {
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
  'Purchased Part',
  'Installed Part',
  'Maintenance',
  'Progress Update',
  'Journal Entry',
  'Record Upload',
];

export interface ActivityValidationResult {
  valid: boolean;
  errors: Partial<Record<'vehicleId' | 'activityType' | 'metadata', string>>;
}

/** Validates required activity fields per WRNC-002 acceptance criteria. */
export function validateActivityInput(
  input: Partial<CreateActivityInput>
): ActivityValidationResult {
  const errors: ActivityValidationResult['errors'] = {};

  if (!input.vehicleId || !input.vehicleId.trim()) {
    errors.vehicleId = 'Vehicle ID is required.';
  }

  if (!input.activityType) {
    errors.activityType = 'Activity type is required.';
  } else if (!ACTIVITY_TYPES.includes(input.activityType)) {
    errors.activityType = `Activity type must be one of: ${ACTIVITY_TYPES.join(', ')}.`;
  }

  if (input.activityType === 'Purchased Part') {
    const meta = (input.metadata ?? {}) as Record<string, unknown>;
    if (!meta.partName || !(meta.partName as string).trim()) {
      errors.metadata = 'Part name is required for Purchased Part activities.';
    }
  }

  if (input.activityType === 'Installed Part') {
    const meta = (input.metadata ?? {}) as Record<string, unknown>;
    if (!meta.partName || !(meta.partName as string).trim()) {
      errors.metadata = 'Part name is required for Installed Part activities.';
    }
  }

  if (input.activityType === 'Maintenance') {
    const meta = (input.metadata ?? {}) as Record<string, unknown>;
    if (!meta.serviceType || !(meta.serviceType as string).trim()) {
      errors.metadata = 'Service type is required for Maintenance activities.';
    }
  }

  if (input.activityType === 'Record Upload') {
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

// ─── Document validation ─────────────────────────────────────────────────────

export const SUPPORTED_MIME_TYPES = [
  'application/pdf',
  'image/png',
  'image/jpeg',
  'image/webp',
  'text/plain',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
] as const;

export interface DocumentValidationResult {
  valid: boolean;
  errors: Partial<Record<'title' | 'documentType' | 'fileUrl' | 'mimeType' | 'fileSize', string>>;
}

export function validateDocumentInput(
  input: Partial<CreateDocumentInput>
): DocumentValidationResult {
  const errors: DocumentValidationResult['errors'] = {};

  if (!input.title || !input.title.trim()) {
    errors.title = 'Title is required.';
  }

  if (!input.documentType || !input.documentType.trim()) {
    errors.documentType = 'Document type is required.';
  }

  if (!input.fileUrl || !input.fileUrl.trim()) {
    errors.fileUrl = 'File URL is required.';
  }

  if (input.mimeType && !SUPPORTED_MIME_TYPES.includes(input.mimeType as (typeof SUPPORTED_MIME_TYPES)[number])) {
    errors.mimeType = 'Unsupported MIME type.';
  }

  if (input.fileSize !== undefined && input.fileSize !== null && input.fileSize <= 0) {
    errors.fileSize = 'File size must be greater than 0.';
  }

  return { valid: Object.keys(errors).length === 0, errors };
}
