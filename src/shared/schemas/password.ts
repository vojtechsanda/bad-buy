import { z } from 'zod';

export const passwordSchema = z
  .string()
  .min(1, 'Please enter a password')
  .min(8, 'At least 8 characters');

export type PasswordType = z.infer<typeof passwordSchema>;
