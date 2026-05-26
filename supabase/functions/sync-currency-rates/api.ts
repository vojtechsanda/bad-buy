import { z } from 'https://esm.sh/zod@3';

const RATES_URL =
  'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json';
const NAMES_URL =
  'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies.json';

// =============================================================================
// Schemas
// =============================================================================

const RatesResponseSchema = z.object({
  date: z.string(),
  usd: z.record(z.string(), z.number()),
});

const NamesResponseSchema = z.record(z.string(), z.string());

// =============================================================================
// Types
// =============================================================================

export type FetchedRate = { code: string; rate: number };

// =============================================================================
// Fetch helpers
// =============================================================================

export async function fetchRates(): Promise<FetchedRate[]> {
  const res = await fetch(RATES_URL);
  if (!res.ok) throw new Error(`Rates fetch failed: ${res.status}`);

  const parsed = RatesResponseSchema.safeParse(await res.json());
  if (!parsed.success) {
    throw new Error(`Unexpected rates response shape: ${JSON.stringify(parsed.error.flatten())}`);
  }

  return Object.entries(parsed.data.usd).map(([code, rate]) => ({
    code: code.toUpperCase(),
    rate,
  }));
}

export async function fetchNames(): Promise<Map<string, string>> {
  const res = await fetch(NAMES_URL);
  if (!res.ok) throw new Error(`Names fetch failed: ${res.status}`);

  const parsed = NamesResponseSchema.safeParse(await res.json());
  if (!parsed.success) {
    throw new Error(`Unexpected names response shape: ${JSON.stringify(parsed.error.flatten())}`);
  }

  return new Map(Object.entries(parsed.data).map(([code, name]) => [code.toUpperCase(), name]));
}
