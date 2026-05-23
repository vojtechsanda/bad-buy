import { MIN_HOBBY_SELECTION } from '@shared/modules/hobby';
import { financialInfoSchema } from '@shared/schemas/finance';
import { z } from 'zod';

export const identityFormSchema = z.object({
  name: z.string().min(1, { message: 'Please input a name' }),
  birthdate: z.date({ message: 'Please input a birthdate' }),
  countryIso2: z.string().min(2, { message: 'Please select a country' }),
});

export type IdentityFormData = z.infer<typeof identityFormSchema>;

export const moneyFormSchema = financialInfoSchema.extend({
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

export type HobbyFormData = z.infer<typeof hobbyFormSchema>;
