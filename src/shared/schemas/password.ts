import { z } from 'zod';

export const Password = z.string().min(8, 'At least 8 characters');
