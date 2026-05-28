import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.105.1';
import { z } from 'https://esm.sh/zod@3';

import { APP_ERROR_STATUS, SQLSTATE_APP_ERROR } from './constants.ts';
import { redeemCode } from './db.ts';

function requireEnv(name: string): string {
  const value = Deno.env.get(name);
  if (!value) throw new Error(`Missing required environment variable: ${name}`);

  return value;
}

const SUPABASE_URL = requireEnv('SUPABASE_URL');
const SUPABASE_ANON_KEY = requireEnv('SUPABASE_ANON_KEY');
const SUPABASE_SERVICE_ROLE_KEY = requireEnv('SUPABASE_SERVICE_ROLE_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

function jsonResponse(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

const RequestBodySchema = z.object({
  code: z.string().trim().min(1),
});

async function handleRequest(req: Request): Promise<Response> {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader) return jsonResponse({ error: 'Missing authorization' }, 401);

  // User-scoped client — used only for auth verification
  const authClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    global: { headers: { Authorization: authHeader } },
  });
  const {
    data: { user },
    error: authError,
  } = await authClient.auth.getUser();
  if (authError || !user) return jsonResponse({ error: 'Unauthorized' }, 401);

  const rawBody = req.headers.get('content-type')?.includes('application/json')
    ? await req.json()
    : {};
  const bodyResult = RequestBodySchema.safeParse(rawBody);
  if (!bodyResult.success) {
    return jsonResponse({ error: 'Invalid request body', detail: bodyResult.error.flatten() }, 400);
  }
  const code = bodyResult.data.code.trim().toUpperCase();

  // Service role client — required for cross-user writes inside the SQL function
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  try {
    const premiumExpiresAt = await redeemCode(supabase, user.id, code);

    return jsonResponse({ premium_expires_at: premiumExpiresAt });
  } catch (err) {
    const e = err as { code?: string; message?: string };
    if (e.code === SQLSTATE_APP_ERROR && e.message !== undefined && e.message in APP_ERROR_STATUS) {
      return jsonResponse({ error: e.message }, APP_ERROR_STATUS[e.message]);
    }
    throw err;
  }
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    return await handleRequest(req);
  } catch (err) {
    console.error('[redeem-code]', err);

    return jsonResponse({ error: 'Internal server error' }, 500);
  }
});
