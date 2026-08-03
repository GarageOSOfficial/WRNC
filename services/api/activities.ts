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

  toActivity,
  type Activity,
  type CreateActivityInput,
  type UpdateActivityInput,
} from '../../types/activity';
import { validateActivityInput } from '../../utils/validators';

export interface ListActivitiesOptions {
  includeArchived?: boolean;
}

/** Read: list activities for a vehicle, ordered by occurred_at descending. Archived excluded by default. */
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
    .order('occurred_at', { ascending: false });

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
/** Read: fetch a single activity by id. */
export async function getActivity(id: string): Promise<Activity> {
  const { data, error } = await supabase
    .from('activities')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return toActivity(data);
}

export async function createActivity(input: CreateActivityInput): Promise<Activity> {
  validateActivityInput(input);
/** Create: insert a new activity. vehicleId and type are required. */
export async function createActivity(input: CreateActivityInput): Promise<Activity> {
  const { valid, errors } = validateActivityInput(input);
  if (!valid) {
    throw new Error(Object.values(errors).join(' '));
  }

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
      type: input.type,
      title: input.title ?? null,
      notes: input.notes ?? null,
      metadata: input.metadata ?? {},
      occurred_at: input.occurredAt ?? new Date().toISOString(),
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
/** Update: any activity field may be edited (title, notes, metadata, occurredAt). */
export async function updateActivity(
  id: string,
  input: UpdateActivityInput
): Promise<Activity> {
  const payload: Record<string, unknown> = {};

  if (input.title !== undefined) payload.title = input.title;
  if (input.notes !== undefined) payload.notes = input.notes;
  if (input.metadata !== undefined) payload.metadata = input.metadata;
  if (input.occurredAt !== undefined) payload.occurred_at = input.occurredAt;

  const { data, error } = await supabase
    .from('activities')
    .update(payload)
    .eq('id', id)
    .select('*')
    .single();

  if (error) throw error;
  return toActivity(data);
}

/** Archive: soft delete. Activity is hidden from default lists, never removed. */
export async function archiveActivity(id: string): Promise<Activity> {
  const { data, error } = await supabase
    .from('activities')
    .update({ archived_at: new Date().toISOString() })
    .eq('id', id)
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
/** Restore: un-archive a previously archived activity. */
export async function restoreActivity(id: string): Promise<Activity> {
  const { data, error } = await supabase
    .from('activities')
    .update({ archived_at: null })
    .eq('id', id)
    .select('*')
    .single();

  if (error) throw error;
  return toActivity(data);
}
}
