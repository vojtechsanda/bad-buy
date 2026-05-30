import { z } from 'https://esm.sh/zod@3';

export const RatesResponseSchema = z.object({
  date: z.string(),
  usd: z.record(z.string(), z.number()),
});

export const NamesResponseSchema = z.record(z.string(), z.string());
