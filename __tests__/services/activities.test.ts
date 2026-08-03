process.env.EXPO_PUBLIC_SUPABASE_URL = 'https://example.supabase.co';
process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY = 'anon-key';

import { supabase } from '../../lib/supabase';
import {
  listActivities,
  getActivity,
  createActivity,
  updateActivity,
  archiveActivity,
  restoreActivity,
} from '../../services/api/activities';
import { validateActivityInput, ACTIVITY_TYPES } from '../../utils/validators';

process.env.EXPO_PUBLIC_SUPABASE_URL = 'https://example.supabase.co';
process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY = 'anon-key';

const mockSingle = jest.fn();
const mockEq = jest.fn();
const mockSelect = jest.fn();
const mockInsert = jest.fn();
const mockUpdate = jest.fn();
const mockOrder = jest.fn();
const mockIs = jest.fn();

jest.mock('../../lib/supabase', () => ({
  __esModule: true,
  supabase: {
    from: jest.fn(),
  },
}));

import { supabase } from '../../lib/supabase';
import { createActivity, listActivities } from '../../services/api/activities';

const mockFrom = supabase.from as jest.Mock;

describe('activity service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('lists activities newest first and excludes archived rows by default', async () => {
    const queryBuilder = {
      eq: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      is: jest.fn().mockReturnThis(),
      data: [
        {
          id: 'act-1',
          vehicle_id: 'veh-1',
          user_id: 'user-1',
          activity_type: 'Maintenance',
          title: 'Brake Service',
          description: 'Replaced pads and flushed fluid.',
          activity_date: '2026-08-01',
          created_at: '2026-08-01T18:00:00.000Z',
          updated_at: null,
          photos: [],
          attachments: [],
          metadata: { cost: 249.99 },
          archived_at: null,
        },
      ],
      error: null,
    };
    const select = jest.fn().mockReturnValue(queryBuilder);
    mockFrom.mockReturnValue({ select });

    const activities = await listActivities('veh-1');

    expect(mockFrom).toHaveBeenCalledWith('activities');
    expect(queryBuilder.eq).toHaveBeenCalledWith('vehicle_id', 'veh-1');
    expect(queryBuilder.order).toHaveBeenNthCalledWith(1, 'activity_date', { ascending: false });
    expect(queryBuilder.order).toHaveBeenNthCalledWith(2, 'created_at', { ascending: false });
    expect(queryBuilder.is).toHaveBeenCalledWith('archived_at', null);
    expect(activities[0]).toMatchObject({ id: 'act-1', vehicleId: 'veh-1' });
  });

  it('creates an activity and trims string fields', async () => {
    const single = jest.fn().mockResolvedValue({
      data: {
        id: 'act-2',
        vehicle_id: 'veh-1',
        user_id: 'user-1',
        activity_type: 'Maintenance',
        title: 'Brake Service',
        description: 'Changed pads',
        activity_date: '2026-08-01',
        created_at: '2026-08-01T18:00:00.000Z',
        updated_at: null,
        photos: [],
        attachments: [],
        metadata: { odometer: 125000 },
        archived_at: null,
      },
      error: null,
    });
    const select = jest.fn().mockReturnValue({ single });
    const insert = jest.fn().mockReturnValue({ select });
    mockFrom.mockReturnValue({ insert });

    const activity = await createActivity({
      vehicleId: 'veh-1',
      userId: 'user-1',
      activityType: 'Maintenance',
      title: '  Brake Service  ',
      description: '  Changed pads  ',
      activityDate: '2026-08-01',
      metadata: { odometer: 125000 },
    });

    expect(insert).toHaveBeenCalledWith(
      expect.objectContaining({
        vehicle_id: 'veh-1',
        user_id: 'user-1',
        title: 'Brake Service',
        description: 'Changed pads',
      })
    );
    expect(activity).toMatchObject({ title: 'Brake Service', vehicleId: 'veh-1' });
  });
});
const mockFrom = supabase.from as jest.Mock;

const makeRow = (overrides: Record<string, unknown> = {}) => ({
  id: 'act-1',
  vehicle_id: 'veh-1',
  type: 'journal_entry',
  title: null,
  notes: 'Test note',
  metadata: {},
  occurred_at: '2024-01-01T00:00:00.000Z',
  archived_at: null,
  created_at: '2024-01-01T00:00:00.000Z',
  updated_at: '2024-01-01T00:00:00.000Z',
  ...overrides,
});

describe('activity service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockFrom.mockReturnValue({
      select: mockSelect,
      insert: mockInsert,
      update: mockUpdate,
      eq: mockEq,
      order: mockOrder,
      is: mockIs,
      single: mockSingle,
    });
    mockSelect.mockReturnValue({
      eq: mockEq,
      order: mockOrder,
      is: mockIs,
      single: mockSingle,
    });
    mockInsert.mockReturnValue({
      select: mockSelect,
      single: mockSingle,
    });
    mockUpdate.mockReturnValue({
      eq: mockEq,
      select: mockSelect,
      single: mockSingle,
    });
    mockEq.mockReturnValue({
      select: mockSelect,
      single: mockSingle,
      order: mockOrder,
      is: mockIs,
    });
    mockOrder.mockReturnValue({
      is: mockIs,
      single: mockSingle,
    });
    mockIs.mockReturnValue({
      single: mockSingle,
    });
  });

  // ─── validateActivityInput ────────────────────────────────────────────────

  describe('validateActivityInput', () => {
    it('requires vehicleId', () => {
      const result = validateActivityInput({ type: 'journal_entry' });
      expect(result.valid).toBe(false);
      expect(result.errors.vehicleId).toBe('Vehicle ID is required.');
    });

    it('requires type', () => {
      const result = validateActivityInput({ vehicleId: 'veh-1' });
      expect(result.valid).toBe(false);
      expect(result.errors.type).toBe('Activity type is required.');
    });

    it('rejects an unknown activity type', () => {
      const result = validateActivityInput({ vehicleId: 'veh-1', type: 'unknown_type' as never });
      expect(result.valid).toBe(false);
      expect(result.errors.type).toMatch(/Activity type must be one of/);
    });

    it('accepts all valid activity types', () => {
      for (const type of ACTIVITY_TYPES) {
        const input: Record<string, unknown> = { vehicleId: 'veh-1', type };
        if (type === 'purchased_part') input.metadata = { partName: 'Oil Filter' };
        if (type === 'installed_part') input.metadata = { partName: 'Oil Filter' };
        if (type === 'maintenance') input.metadata = { serviceType: 'Oil Change' };
        if (type === 'record_upload') input.metadata = { fileUrl: 'https://example.com/file.pdf', fileName: 'file.pdf' };
        const result = validateActivityInput(input as never);
        expect(result.valid).toBe(true);
      }
    });

    it('requires partName in metadata for purchased_part', () => {
      const result = validateActivityInput({ vehicleId: 'veh-1', type: 'purchased_part', metadata: {} });
      expect(result.valid).toBe(false);
      expect(result.errors.metadata).toMatch(/Part name is required/);
    });

    it('requires partName in metadata for installed_part', () => {
      const result = validateActivityInput({ vehicleId: 'veh-1', type: 'installed_part', metadata: {} });
      expect(result.valid).toBe(false);
      expect(result.errors.metadata).toMatch(/Part name is required/);
    });

    it('requires serviceType in metadata for maintenance', () => {
      const result = validateActivityInput({ vehicleId: 'veh-1', type: 'maintenance', metadata: {} });
      expect(result.valid).toBe(false);
      expect(result.errors.metadata).toMatch(/Service type is required/);
    });

    it('requires fileUrl and fileName in metadata for record_upload', () => {
      const result = validateActivityInput({ vehicleId: 'veh-1', type: 'record_upload', metadata: {} });
      expect(result.valid).toBe(false);
      expect(result.errors.metadata).toMatch(/File URL is required/);
    });

    it('accepts a valid record_upload with fileUrl and fileName', () => {
      const result = validateActivityInput({
        vehicleId: 'veh-1',
        type: 'record_upload',
        metadata: { fileUrl: 'https://example.com/file.pdf', fileName: 'file.pdf' },
      });
      expect(result.valid).toBe(true);
    });

    it('accepts progress_update and journal_entry without metadata requirements', () => {
      expect(validateActivityInput({ vehicleId: 'veh-1', type: 'progress_update' }).valid).toBe(true);
      expect(validateActivityInput({ vehicleId: 'veh-1', type: 'journal_entry' }).valid).toBe(true);
    });
  });

  // ─── listActivities ───────────────────────────────────────────────────────

  it('listActivities returns mapped activities, excluding archived by default', async () => {
    mockIs.mockResolvedValue({ data: [makeRow({ notes: 'First entry' })], error: null });

    const activities = await listActivities('veh-1');

    expect(activities).toHaveLength(1);
    expect(activities[0].id).toBe('act-1');
    expect(activities[0].notes).toBe('First entry');
    expect(mockIs).toHaveBeenCalledWith('archived_at', null);
  });

  it('listActivities includes archived activities when includeArchived is true', async () => {
    mockOrder.mockResolvedValue({
      data: [makeRow(), makeRow({ id: 'act-2', archived_at: '2026-01-01T00:00:00.000Z' })],
      error: null,
    });

    const activities = await listActivities('veh-1', { includeArchived: true });

    expect(activities).toHaveLength(2);
    expect(mockIs).not.toHaveBeenCalled();
  });

  it('listActivities returns an empty array when the vehicle has no activities', async () => {
    mockIs.mockResolvedValue({ data: [], error: null });

    const activities = await listActivities('veh-1');

    expect(activities).toEqual([]);
  });

  it('listActivities throws when Supabase returns an error', async () => {
    mockIs.mockResolvedValue({ data: null, error: { message: 'list failed' } });

    await expect(listActivities('veh-1')).rejects.toMatchObject({ message: 'list failed' });
  });

  // ─── getActivity ──────────────────────────────────────────────────────────

  it('getActivity returns a mapped activity by id', async () => {
    mockSingle.mockResolvedValue({
      data: makeRow({ type: 'maintenance', metadata: { serviceType: 'Oil Change' } }),
      error: null,
    });

    const activity = await getActivity('act-1');

    expect(activity.id).toBe('act-1');
    expect(activity.type).toBe('maintenance');
    expect(activity.metadata).toEqual({ serviceType: 'Oil Change' });
  });

  it('getActivity throws when Supabase returns an error', async () => {
    mockSingle.mockResolvedValue({ data: null, error: { message: 'not found' } });

    await expect(getActivity('act-99')).rejects.toMatchObject({ message: 'not found' });
  });

  // ─── createActivity ───────────────────────────────────────────────────────

  it('creates a journal_entry activity and maps the row', async () => {
    mockSingle.mockResolvedValue({
      data: makeRow({ notes: 'Today I installed a cold air intake.' }),
      error: null,
    });

    const activity = await createActivity({
      vehicleId: 'veh-1',
      type: 'journal_entry',
      notes: 'Today I installed a cold air intake.',
    });

    expect(activity.id).toBe('act-1');
    expect(activity.vehicleId).toBe('veh-1');
    expect(activity.type).toBe('journal_entry');
    expect(activity.notes).toBe('Today I installed a cold air intake.');
  });

  it('creates a purchased_part activity with metadata', async () => {
    const meta = { partName: 'K&N Air Filter', vendor: 'Amazon', cost: 49.99 };
    mockSingle.mockResolvedValue({
      data: makeRow({ type: 'purchased_part', metadata: meta }),
      error: null,
    });

    const activity = await createActivity({
      vehicleId: 'veh-1',
      type: 'purchased_part',
      metadata: meta,
    });

    expect(activity.type).toBe('purchased_part');
    expect(activity.metadata).toEqual(meta);
  });

  it('createActivity throws on validation failure (missing vehicleId)', async () => {
    await expect(
      createActivity({ vehicleId: '', type: 'journal_entry' })
    ).rejects.toThrow('Vehicle ID is required.');
  });

  it('createActivity throws on validation failure (missing required metadata)', async () => {
    await expect(
      createActivity({ vehicleId: 'veh-1', type: 'purchased_part', metadata: {} })
    ).rejects.toThrow('Part name is required for Purchased Part activities.');
  });

  it('createActivity throws when Supabase returns an error', async () => {
    mockSingle.mockResolvedValue({ data: null, error: { message: 'insert failed' } });

    await expect(
      createActivity({ vehicleId: 'veh-1', type: 'journal_entry' })
    ).rejects.toMatchObject({ message: 'insert failed' });
  });

  // ─── updateActivity ───────────────────────────────────────────────────────

  it('updateActivity allows partial updates', async () => {
    mockSingle.mockResolvedValue({
      data: makeRow({ notes: 'Updated note' }),
      error: null,
    });

    await expect(
      updateActivity('act-1', { notes: 'Updated note' })
    ).resolves.toMatchObject({ notes: 'Updated note' });
  });

  it('updateActivity throws when Supabase returns an error', async () => {
    mockSingle.mockResolvedValue({ data: null, error: { message: 'update failed' } });

    await expect(
      updateActivity('act-1', { notes: 'New note' })
    ).rejects.toMatchObject({ message: 'update failed' });
  });

  // ─── archiveActivity / restoreActivity ───────────────────────────────────

  it('archives and restores activities by toggling archived_at', async () => {
    mockSingle.mockResolvedValueOnce({
      data: makeRow({ archived_at: '2026-08-03T00:00:00.000Z' }),
      error: null,
    });
    mockSingle.mockResolvedValueOnce({
      data: makeRow({ archived_at: null }),
      error: null,
    });

    const archived = await archiveActivity('act-1');
    const restored = await restoreActivity('act-1');

    expect(archived.archivedAt).not.toBeNull();
    expect(restored.archivedAt).toBeNull();
  });

  it('archiveActivity throws when Supabase returns an error', async () => {
    mockSingle.mockResolvedValue({ data: null, error: { message: 'archive failed' } });

    await expect(archiveActivity('act-1')).rejects.toMatchObject({ message: 'archive failed' });
  });

  it('restoreActivity throws when Supabase returns an error', async () => {
    mockSingle.mockResolvedValue({ data: null, error: { message: 'restore failed' } });

    await expect(restoreActivity('act-1')).rejects.toMatchObject({ message: 'restore failed' });
  });

  // ─── toActivity mapper ────────────────────────────────────────────────────

  it('toActivity maps snake_case row fields to camelCase domain model', async () => {
    mockSingle.mockResolvedValue({
      data: makeRow({
        title: 'Oil Change',
        notes: 'Changed synthetic oil',
        type: 'maintenance',
        metadata: { serviceType: 'Oil Change', mileageAtService: 45000 },
        occurred_at: '2026-07-01T00:00:00.000Z',
      }),
      error: null,
    });

    const activity = await getActivity('act-1');

    expect(activity.vehicleId).toBe('veh-1');
    expect(activity.title).toBe('Oil Change');
    expect(activity.notes).toBe('Changed synthetic oil');
    expect(activity.type).toBe('maintenance');
    expect(activity.metadata).toEqual({ serviceType: 'Oil Change', mileageAtService: 45000 });
    expect(activity.occurredAt).toBe('2026-07-01T00:00:00.000Z');
    expect(activity.archivedAt).toBeNull();
  });
});
