export interface ValidationResult {
  valid: boolean;
  errors: Partial<Record<'year' | 'make' | 'model' | 'vin' | 'mileage', string>>;
}

const MIN_YEAR = 1900;
const VIN_LENGTH = 17;

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
