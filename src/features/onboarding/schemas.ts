import { z } from 'zod';

export const IdentitySchema = z.object({
  name: z.string().min(1, { message: 'Please input a name' }),
  birthdate: z.date({ message: 'Please input a birthdate' }),
  countryIso2: z.string().min(2, { message: 'Please select a country' }),
});

export type IdentityFormData = z.infer<typeof IdentitySchema>;
