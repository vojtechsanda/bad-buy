import { emailSchema } from '@shared/schemas/email';
import { passwordSchema } from '@shared/schemas/password';
import { z } from 'zod';

export const RegisterFormSchema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
    passwordRepeat: z.string(),
  })
  .refine((v) => v.password === v.passwordRepeat, {
    path: ['passwordRepeat'],
    message: "Passwords don't match",
  });

export type RegisterFormType = z.infer<typeof RegisterFormSchema>;

export const LoginFormSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export type LoginFormType = z.infer<typeof LoginFormSchema>;
