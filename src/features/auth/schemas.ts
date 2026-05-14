import { Email } from '@shared/schemas/email';
import { Password } from '@shared/schemas/password';
import { z } from 'zod';

export const RegisterSchema = z
  .object({
    email: Email,
    password: Password,
    passwordRepeat: z.string(),
  })
  .refine((v) => v.password === v.passwordRepeat, {
    path: ['passwordRepeat'],
    message: "Passwords don't match",
  });
export type RegisterInput = z.infer<typeof RegisterSchema>;

// TODO: Login schema bellow
