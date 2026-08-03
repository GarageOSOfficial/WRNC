process.env.EXPO_PUBLIC_SUPABASE_URL = 'https://example.supabase.co';
process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY = 'anon-key';

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