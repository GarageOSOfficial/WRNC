import { supabase } from '../../lib/supabase';
import {
  ACTIVITY_TYPES,
  toActivity,
  type Activity,
  type CreateActivityInput,
  type ListActivitiesOptions,
} from '../../types/activity';

function validateActivityInput(input: CreateActivityInput) {
  const errors: string[] = [];

  if (!input.vehicleId) errors.push('Vehicle is required.');
  if (!input.userId) errors.push('User is required.');
  if (!ACTIVITY_TYPES.includes(input.activityType)) errors.push('Activity type is invalid.');
  if (!input.title.trim()) errors.push('Title is required.');
  if (!input.activityDate) errors.push('Activity date is required.');

  if (errors.length > 0) {
    throw new Error(errors.join(' '));
  }
}

export async function listActivities(
  vehicleId: string,
  options: ListActivitiesOptions = {}
): Promise<Activity[]> {
  const sortDirection = options.sortDirection ?? 'desc';

  let query = supabase
    .from('activities')
    .select('*')
    .eq('vehicle_id', vehicleId)
    .order('activity_date', { ascending: sortDirection === 'asc' })
    .order('created_at', { ascending: sortDirection === 'asc' });

  if (!options.includeArchived) {
    query = query.is('archived_at', null);
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []).map(toActivity);
}

export async function getActivity(activityId: string): Promise<Activity> {
  const { data, error } = await supabase
    .from('activities')
    .select('*')
    .eq('id', activityId)
    .single();

  if (error) throw error;
  return toActivity(data);
}

export async function createActivity(input: CreateActivityInput): Promise<Activity> {
  validateActivityInput(input);

  const { data, error } = await supabase
    .from('activities')
    .insert({
      vehicle_id: input.vehicleId,
      user_id: input.userId,
      activity_type: input.activityType,
      title: input.title.trim(),
      description: input.description?.trim() || null,
      activity_date: input.activityDate,
      photos: input.photos ?? [],
      attachments: input.attachments ?? [],
      metadata: input.metadata ?? null,
    })
    .select('*')
    .single();

  if (error) throw error;
  return toActivity(data);
}

export async function archiveActivity(activityId: string): Promise<Activity> {
  const { data, error } = await supabase
    .from('activities')
    .update({ archived_at: new Date().toISOString() })
    .eq('id', activityId)
    .select('*')
    .single();

  if (error) throw error;
  return toActivity(data);
}

export async function restoreActivity(activityId: string): Promise<Activity> {
  const { data, error } = await supabase
    .from('activities')
    .update({ archived_at: null })
    .eq('id', activityId)
    .select('*')
    .single();

  if (error) throw error;
  return toActivity(data);
}