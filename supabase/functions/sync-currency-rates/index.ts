import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.105.1';

import { fetchNames, fetchRates } from './api.ts';
import { upsertCurrencies, upsertRates } from './db.ts';

// =============================================================================
// Environment
// =============================================================================

function requireEnv(name: string): string {
  const value = Deno.env.get(name);
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

const SUPABASE_URL = requireEnv('SUPABASE_URL');
const SUPABASE_SERVICE_ROLE_KEY = requireEnv('SUPABASE_SERVICE_ROLE_KEY');

// =============================================================================
// HTTP helpers
// =============================================================================

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

// =============================================================================
// Request handler
// =============================================================================

async function handleRequest(): Promise<Response> {
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  const [rates, names] = await Promise.all([fetchRates(), fetchNames()]);

  const fetchedAt = new Date().toISOString();

  // Upsert currencies first — currency_rate has a FK on currency(code).
  // ignoreDuplicates keeps existing curated symbols intact; only new codes get inserted.
  // The code itself is used as the symbol fallback for codes not yet in the table.
  const currencyRows = rates.map(({ code }) => ({
    code,
    name: names.get(code) ?? code,
    symbol: code,
  }));

  await upsertCurrencies(supabase, currencyRows);

  const rateRows = rates.map(({ code, rate }) => ({
    base: 'USD',
    target: code,
    rate,
    fetched_at: fetchedAt,
  }));

  await upsertRates(supabase, rateRows);

  return jsonResponse({ synced: rates.length, fetched_at: fetchedAt });
}

// =============================================================================
// Entry point
// =============================================================================

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    return await handleRequest();
  } catch (err) {
    console.error('[sync-currency-rates]', err);
    return jsonResponse({ error: 'Internal server error' }, 500);
  }
});
