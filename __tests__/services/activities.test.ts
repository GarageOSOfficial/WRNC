import { supabase } from '../../lib/supabase';
import {
  listActivities,
  getActivity,
  createActivity,
  archiveActivity,
  restoreActivity,
} from '../../services/api/activities';

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

const mockFrom = supabase.from as jest.Mock;

const makeRow = (overrides: Record<string, unknown> = {}) => ({
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
  ...overrides,
});

describe('activity service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockOrder.mockReturnValue({
      order: mockOrder,
      is: mockIs,
      single: mockSingle,
    });
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
    mockIs.mockReturnValue({
      single: mockSingle,
    });
  });

  it('lists activities newest first and excludes archived rows by default', async () => {
    mockIs.mockResolvedValue({ data: [makeRow()], error: null });

    const activities = await listActivities('veh-1');

    expect(activities).toHaveLength(1);
    expect(activities[0]).toMatchObject({ id: 'act-1', vehicleId: 'veh-1' });
    expect(mockIs).toHaveBeenCalledWith('archived_at', null);
  });

  it('gets an activity by id', async () => {
    mockSingle.mockResolvedValue({ data: makeRow(), error: null });

    const activity = await getActivity('act-1');

    expect(activity.id).toBe('act-1');
    expect(activity.activityType).toBe('Maintenance');
  });

  it('creates an activity and trims string fields', async () => {
    mockSingle.mockResolvedValue({
      data: makeRow({ title: 'Brake Service', description: 'Changed pads' }),
      error: null,
    });

    const activity = await createActivity({
      vehicleId: 'veh-1',
      userId: 'user-1',
      activityType: 'Maintenance',
      title: '  Brake Service  ',
      description: '  Changed pads  ',
      activityDate: '2026-08-01',
      metadata: { odometer: 125000 },
    });

    expect(mockInsert).toHaveBeenCalledWith(
      expect.objectContaining({
        vehicle_id: 'veh-1',
        user_id: 'user-1',
        title: 'Brake Service',
        description: 'Changed pads',
      })
    );
    expect(activity.title).toBe('Brake Service');
  });

  it('submits Journal Entry payloads successfully', async () => {
    mockSingle.mockResolvedValue({
      data: makeRow({
        activity_type: 'Journal Entry',
        title: 'D/S Removal',
        description: 'drained fuel tank to Volvo, prepping for D/S removal tomorrow',
        metadata: { odometer: 120020, cost: 0 },
      }),
      error: null,
    });

    const activity = await createActivity({
      vehicleId: 'veh-1',
      userId: 'user-1',
      activityType: 'Journal Entry',
      title: 'D/S Removal',
      description: 'drained fuel tank to Volvo, prepping for D/S removal tomorrow',
      activityDate: '2026-08-11',
      metadata: { odometer: 120020, cost: 0 },
    });

    expect(mockInsert).toHaveBeenCalledWith(
      expect.objectContaining({
        activity_type: 'Journal Entry',
        title: 'D/S Removal',
        metadata: { odometer: 120020, cost: 0 },
      })
    );
    expect(activity.activityType).toBe('Journal Entry');
  });

  it('extracts Supabase-style object errors instead of collapsing to a generic message', async () => {
    mockSingle.mockResolvedValue({
      data: null,
      error: {
        code: '23502',
        message: 'null value in column "type" violates not-null constraint',
      },
    });

    await expect(
      createActivity({
        vehicleId: 'veh-1',
        userId: 'user-1',
        activityType: 'Journal Entry',
        title: 'D/S Removal',
        description: 'desc',
        activityDate: '2026-08-11',
      })
    ).rejects.toThrow('null value in column "type" violates not-null constraint');
  });

  it('archives and restores activities', async () => {
    mockSingle.mockResolvedValueOnce({ data: makeRow({ archived_at: '2026-08-02T00:00:00.000Z' }), error: null });
    mockSingle.mockResolvedValueOnce({ data: makeRow({ archived_at: null }), error: null });

    const archived = await archiveActivity('act-1');
    const restored = await restoreActivity('act-1');

    expect(archived.archivedAt).toBeTruthy();
    expect(restored.archivedAt).toBeNull();
  });
});
