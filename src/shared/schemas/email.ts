import { z } from 'zod';

export const Email = z.email();
export type EmailValue = z.infer<typeof Email>;
