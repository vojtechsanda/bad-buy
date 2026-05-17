import { revalidateLogic } from '@tanstack/form-core';
import { z } from 'zod';

export const onboardingValidationLogic = revalidateLogic({
  mode: 'submit',
  modeAfterSubmission: 'change',
});

export const identityFormSchema = z.object({
  name: z.string().min(1, { message: 'Please input a name' }),
  birthdate: z.date({ message: 'Please input a birthdate' }),
  countryIso2: z.string().min(2, { message: 'Please select a country' }),
});

export type IdentityFormData = z.infer<typeof identityFormSchema>;

export const moneyFormSchema = z.object({
  displayCurrency: z.string().min(1, { message: 'Please select a display currency' }),
  hourlyWage: z
    .number({ error: 'Please enter your hourly wage' })
    .positive({ message: 'Wage must be greater than 0' }),
  wageCurrency: z.string().min(1, { message: 'Please select a wage currency' }),
  workHoursPerDay: z
    .number()
    .min(1, { message: 'Min 1 hour' })
    .max(16, { message: 'Max 16 hours' }),
});

export type MoneyFormData = z.infer<typeof moneyFormSchema>;
