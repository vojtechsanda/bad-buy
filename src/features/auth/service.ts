import { supabase } from '@shared/services/supabase';

async function signIn(email: string, password: string): Promise<void> {
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
}

async function signUp(email: string, password: string): Promise<void> {
  const { error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;
}

async function signOut(): Promise<void> {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

async function getCurrentUserId(): Promise<string> {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) throw new Error(`authService.getCurrentUserId: ${error.message}`);
  if (!user) throw new Error('authService.getCurrentUserId: not authenticated');

  return user.id;
}

export const authService = {
  signIn,
  signUp,
  signOut,
  getCurrentUserId,
};
