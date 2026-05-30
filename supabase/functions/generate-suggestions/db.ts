import type { SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2.105.1';
import { z } from 'https://esm.sh/zod@3';

export type Hobby = { id: string; hobby_name: string };

export type SuggestionRow = {
  hobby_id: string;
  name: string;
  item_emoji: string;
  price_usd: number;
  country: string;
};

type SuggestionInput = {
  hobby_name: string;
  name: string;
  item_emoji: string;
  price_usd: number;
};

const RateLimitRowSchema = z.array(z.object({ out_window_key: z.string(), out_count: z.number() }));

export async function fetchAccount(supabase: SupabaseClient, userId: string) {
  return supabase.from('account').select('country, premium_expires_at').eq('id', userId).single();
}

export async function fetchHobbies(supabase: SupabaseClient, userId: string) {
  return supabase
    .from('account_hobby')
    .select('id, hobby_name')
    .eq('account_id', userId)
    .eq('is_moderated', true);
}

export async function incrementRateLimit(
  supabase: SupabaseClient,
  windowKeys: string[],
): Promise<Map<string, number>> {
  const { data, error } = await supabase.rpc('increment_suggestion_rate_limit', {
    p_window_keys: windowKeys,
  });
  if (error) throw error;

  const parsed = RateLimitRowSchema.safeParse(data);
  if (!parsed.success) throw new Error('Unexpected rate limit RPC response shape');

  return new Map(parsed.data.map((r) => [r.out_window_key, r.out_count]));
}

export async function fetchCachedSuggestions(
  supabase: SupabaseClient,
  hobbyIds: string[],
  country: string,
) {
  return supabase
    .from('account_suggestion')
    .select('*')
    .in('hobby_id', hobbyIds)
    .eq('country', country);
}

export async function replaceSuggestions(
  supabase: SupabaseClient,
  hobbyIds: string[],
  country: string,
  rows: SuggestionRow[],
) {
  return supabase.rpc('replace_suggestions', {
    p_hobby_ids: hobbyIds,
    p_country: country,
    p_rows: rows,
  });
}

export function toSuggestionRows(
  suggestions: SuggestionInput[],
  hobbies: Hobby[],
  country: string,
): SuggestionRow[] {
  const hobbyMap = new Map(hobbies.map((h) => [h.hobby_name.toLowerCase(), h.id]));
  const fallbackId = hobbies[0].id;

  return suggestions.map((s) => {
    const hobbyId = hobbyMap.get(s.hobby_name.toLowerCase());
    if (!hobbyId) {
      console.warn(
        `[generate-suggestions] Unknown hobby name "${s.hobby_name}" from Gemini, falling back to first hobby`,
      );
    }
    return {
      hobby_id: hobbyId ?? fallbackId,
      name: s.name,
      item_emoji: s.item_emoji,
      price_usd: s.price_usd,
      country,
    };
  });
}
