import { supabase } from '../../lib/supabase';
import { toWorkspace, type Workspace } from '../../types/workspace';

/**
 * Returns the current user's personal workspace (Garage).
 * A workspace row is auto-created for every new user (see migration trigger).
 */
export async function getCurrentWorkspace(): Promise<Workspace> {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) throw authError;
  if (!user) throw new Error('No authenticated user.');

  const { data, error } = await supabase
    .from('workspaces')
    .select('*')
    .eq('owner_id', user.id)
    .order('created_at', { ascending: true })
    .limit(1)
    .single();

  if (error) throw error;
  return toWorkspace(data);
}
