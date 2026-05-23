import { z } from 'zod';

import { financialInfoFields } from './finance';

export const personalInfoEditSchema = z.object({
  countryIso2: z.string().min(2, { message: 'Please select a country' }),
  ...financialInfoFields,
  workHoursPerDay: z
    .number()
    .min(1, { message: 'Min 1 hour' })
    .max(16, { message: 'Max 16 hours' }),
});
export type PersonalInfoEditData = z.infer<typeof personalInfoEditSchema>;
