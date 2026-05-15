import { z } from 'zod';

export const EmailSchema = z
  .string()
  .min(1, 'Please enter an email')
  .email('Please enter a valid email');

export type EmailType = z.infer<typeof EmailSchema>;
