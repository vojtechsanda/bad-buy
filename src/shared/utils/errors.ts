import type { PostgrestError } from '@supabase/supabase-js';

export class SupabaseError extends Error {
  override readonly name = 'SupabaseError';
  readonly code: string | null;
  readonly details: string | null;
  readonly hint: string | null;

  constructor(error: PostgrestError) {
    super(error.message);
    this.code = error.code ?? null;
    this.details = error.details ?? null;
    this.hint = error.hint ?? null;
  }
}

export function assertNoError(error: PostgrestError | null): asserts error is null {
  if (error !== null) throw new SupabaseError(error);
}

/**
 * Unwraps a Supabase query result into T, throwing on either a PostgREST
 * error or a missing row.
 *
 * @param label - Label for the missing-row error message.
 *   Convention: ServiceName.methodName (e.g. AccountService.get).
 */
export function unwrapRow<T>(
  data: T | null | undefined,
  error: PostgrestError | null,
  label: string,
): T {
  assertNoError(error);
  if (data == null) throw new Error(`${label}: query returned no row`);

  return data;
}
