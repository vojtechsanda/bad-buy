import { Account } from '@shared/types';

export const mockAccount: Account = {
  id: 'mock-user-id-001',
  name: 'Vojta',
  created_at: '2026-01-01T00:00:00Z',
  birthdate: '1998-05-15',
  country: 'CZ',
  decision_count: 5,
  display_currency: 'EUR',
  hourly_wage_usd: 12.5,
  notifications_enabled: true,
  premium_expires_at: null,
  referral_code: 'VOJTA2026',
  wage_currency: 'EUR',
  wage_rate_snapshot: 0.92,
  work_hours_per_day: 8,
};

export const mockAccountHobbies: string[] = ['1', '6', '9', '12', '15'];
