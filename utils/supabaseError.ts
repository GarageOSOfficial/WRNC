type ErrorRecord = Record<string, unknown>;

function asErrorRecord(value: unknown): ErrorRecord | null {
  return typeof value === 'object' && value !== null ? (value as ErrorRecord) : null;
}

function getString(value: unknown): string | null {
  return typeof value === 'string' && value.trim().length > 0 ? value.trim() : null;
}

/**
 * Extracts a human-readable message from Error, PostgREST, or unknown error shapes.
 */
export function extractSupabaseErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error) {
    const errorMessage = getString(error.message);
    if (errorMessage) return errorMessage;
  }

  const directMessage = getString(error);
  if (directMessage) return directMessage;

  const record = asErrorRecord(error);
  if (!record) return fallback;

  const recordMessage = getString(record.message);
  if (recordMessage) return recordMessage;

  const recordDetails = getString(record.details);
  if (recordDetails) return recordDetails;

  const nestedError = record.error;
  if (nestedError !== undefined) {
    const nestedMessage = extractSupabaseErrorMessage(nestedError, '');
    if (nestedMessage) return nestedMessage;
  }

  return fallback;
}

/** Logs full error context for local development while keeping user messaging safe. */
export function logSupabaseError(context: string, error: unknown, extra?: ErrorRecord) {
  if (process.env.NODE_ENV === 'production') {
    return;
  }

  const record = asErrorRecord(error);
  const diagnostic = {
    code: record ? getString(record.code) : null,
    details: record ? getString(record.details) : null,
    hint: record ? getString(record.hint) : null,
  };

  console.error(`[${context}]`, {
    message: extractSupabaseErrorMessage(error, 'Unknown Supabase error'),
    diagnostic,
    extra,
    error,
  });
}