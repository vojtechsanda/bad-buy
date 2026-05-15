import { z } from 'zod';

export const EmailSchema = z.email();

export type EmailType = z.infer<typeof EmailSchema>;
