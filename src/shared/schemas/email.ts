import { z } from 'zod';

export const EmailSchema = z.email();
export type EmailValue = z.infer<typeof EmailSchema>;
