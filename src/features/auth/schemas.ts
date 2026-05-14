import { EmailSchema } from '@shared/schemas/email';
import { PasswordSchema } from '@shared/schemas/password';
import { z } from 'zod';

export const RegisterFormSchema = z
  .object({
    email: EmailSchema,
    password: PasswordSchema,
    passwordRepeat: z.string(),
  })
  .refine((v) => v.password === v.passwordRepeat, {
    path: ['passwordRepeat'],
    message: "Passwords don't match",
  });
export type RegisterInput = z.infer<typeof RegisterFormSchema>;

// TODO: Login schema below
