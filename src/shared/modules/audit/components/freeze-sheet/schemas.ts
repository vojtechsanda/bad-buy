import { z } from 'zod';

export const FreezeSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  durationMs: z.number().min(1, 'Please select a duration'),
});
