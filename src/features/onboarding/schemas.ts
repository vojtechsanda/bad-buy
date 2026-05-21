import { MIN_HOBBY_SELECTION } from '@shared/modules/hobby';
import { z } from 'zod';

export const identityFormSchema = z.object({
  name: z.string().min(1, { message: 'Please input a name' }),
  birthdate: z.date({ message: 'Please input a birthdate' }),
  countryIso2: z.string().min(2, { message: 'Please select a country' }),
});

export type identityFormData = z.infer<typeof identityFormSchema>;

export const moneyFormSchema = z.object({
  displayCurrency: z.string().min(1, { message: 'Please select a display currency' }),
  hourlyWage: z
    .number({ error: 'Please enter your hourly wage' })
    .positive({ message: 'Wage must be greater than 0' }),
  wageCurrency: z.string().min(1, { message: 'Please select a wage currency' }),
  workHoursPerDay: z
    .number()
    .min(0.5, { message: 'Min 0.5 hours' })
    .max(24, { message: 'Max 24 hours' }),
});

export type moneyFormData = z.infer<typeof moneyFormSchema>;

export const hobbyFormSchema = z.object({
  selectedIds: z
    .array(z.string())
    .min(MIN_HOBBY_SELECTION, `Select at least ${MIN_HOBBY_SELECTION} hobbies`),
});
export type hobbyFormData = z.infer<typeof hobbyFormSchema>;
