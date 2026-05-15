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

export type RegisterFormType = z.infer<typeof RegisterFormSchema>;

export const LoginFormSchema = z.object({
  email: EmailSchema,
  password: PasswordSchema,
});

export type LoginFormType = z.infer<typeof LoginFormSchema>;
