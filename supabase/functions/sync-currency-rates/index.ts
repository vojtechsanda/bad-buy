import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.105.1';

import { fetchNames, fetchRates } from './api.ts';
import {
  fetchCountryCurrencyCodes,
  resetMissingCountryCurrencies,
  upsertCurrencies,
  upsertRates,
} from './db.ts';

function requireEnv(name: string): string {
  const value = Deno.env.get(name);
  if (!value) throw new Error(`Missing required environment variable: ${name}`);

  return value;
}

const SUPABASE_URL = requireEnv('SUPABASE_URL');
const SUPABASE_SERVICE_ROLE_KEY = requireEnv('SUPABASE_SERVICE_ROLE_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function jsonResponse(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function handleRequest(): Promise<Response> {
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  const [rates, names, countryCurrencyCodes] = await Promise.all([
    fetchRates(),
    fetchNames(),
    fetchCountryCurrencyCodes(supabase),
  ]);

  const fetchedAt = new Date().toISOString();

  // Currencies before rates (FK); upsert only inserts new codes, symbol falls back to code.
  const currencyRows = rates
    .filter(({ code }) => countryCurrencyCodes.has(code))
    .map(({ code }) => ({
      code,
      name: names.get(code) ?? code,
      symbol: code,
    }))
    .filter((row) => row.name.trim().length > 0);

  await upsertCurrencies(supabase, currencyRows);

  const validCodes = new Set(currencyRows.map((r) => r.code));
  const rateRows = rates
    .filter(({ code }) => validCodes.has(code))
    .map(({ code, rate }) => ({
      base: 'USD',
      target: code,
      rate,
      fetched_at: fetchedAt,
    }));

  await upsertRates(supabase, rateRows);
  await resetMissingCountryCurrencies(supabase, validCodes);

  return jsonResponse({ synced: rateRows.length, fetched_at: fetchedAt });
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  if (req.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed' }, 405);
  }

  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`) {
    return jsonResponse({ error: 'Unauthorized' }, 401);
  }

  try {
    return await handleRequest();
  } catch (err) {
    console.error('[sync-currency-rates]', err);

    return jsonResponse({ error: 'Internal server error' }, 500);
  }
});
