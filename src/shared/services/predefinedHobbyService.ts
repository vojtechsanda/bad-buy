import { PredefinedHobby } from '@shared/types';

import { supabase } from './supabase';

/**
 * Returns all predefined hobbies, sorted by category and sort_order.
 */
async function listPredefinedHobbies(): Promise<PredefinedHobby[]> {
  const { data, error } = await supabase
    .from('predefined_hobby')
    .select('*')
    .order('category', { ascending: true })
    .order('sort_order', { ascending: true });

  if (error) throw error;

  return data ?? [];
}

/*
 * Returns all predefined hobbies, grouped by category.
 * Categories are sorted alphabetically; hobbies inside each category preserve their sort_order.
 */
async function listGroupedByCategory(): Promise<Record<string, PredefinedHobby[]>> {
  const rows = await listPredefinedHobbies();

  return rows.reduce<Record<string, PredefinedHobby[]>>((acc, hobby) => {
    (acc[hobby.category] ??= []).push(hobby);

    return acc;
  }, {});
}

export const predefinedHobbyService = {
  listPredefinedHobbies,
  listGroupedByCategory,
};
