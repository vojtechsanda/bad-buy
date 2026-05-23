import { z } from 'zod';

export const financialInfoFields = {
  displayCurrency: z.string().min(1, { message: 'Please select a display currency' }),
  hourlyWage: z
    .number({ error: 'Please enter your hourly wage' })
    .positive({ message: 'Wage must be greater than 0' }),
  wageCurrency: z.string().min(1, { message: 'Please select a wage currency' }),
};
