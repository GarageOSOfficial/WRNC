import { extractSupabaseErrorMessage } from '../../utils/supabaseError';

describe('extractSupabaseErrorMessage', () => {
  it('returns standard Error messages', () => {
    const message = extractSupabaseErrorMessage(new Error('Boom'), 'Fallback');

    expect(message).toBe('Boom');
  });

  it('extracts message from PostgREST-like error objects', () => {
    const message = extractSupabaseErrorMessage(
      {
        code: '23502',
        details: 'Failing row contains (...)',
        hint: null,
        message: 'null value in column "type" violates not-null constraint',
      },
      'Fallback'
    );

    expect(message).toBe('null value in column "type" violates not-null constraint');
  });

  it('extracts nested error messages from wrapped responses', () => {
    const message = extractSupabaseErrorMessage(
      {
        error: {
          message: 'nested supabase error',
        },
      },
      'Fallback'
    );

    expect(message).toBe('nested supabase error');
  });

  it('uses fallback when no message can be extracted', () => {
    const message = extractSupabaseErrorMessage({ code: 500 }, 'Fallback');

    expect(message).toBe('Fallback');
  });
});
