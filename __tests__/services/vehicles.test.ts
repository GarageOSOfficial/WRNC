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
import { createVehicle, updateVehicle, archiveVehicle, restoreVehicle } from '../../services/api/vehicles';
import { validateVehicleInput } from '../../utils/validators';

const mockFrom = supabase.from as jest.Mock;

describe('vehicle CRUD service', () => {
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
      limit: jest.fn().mockReturnValue({ single: mockSingle }),
    });
    mockIs.mockReturnValue({
      single: mockSingle,
    });
  });

  it('validates creation requirements for year, make, and model', () => {
    const result = validateVehicleInput({ year: undefined as unknown as number, make: '', model: '' });

    expect(result.valid).toBe(false);
    expect(result.errors.year).toBe('Year is required.');
    expect(result.errors.make).toBe('Make is required.');
    expect(result.errors.model).toBe('Model is required.');
  });

  it('creates a vehicle and maps the Supabase row to the app shape', async () => {
    mockSingle.mockResolvedValue({
      data: {
        id: 'veh-1',
        workspace_id: 'ws-1',
        vin: '12345678901234567',
        year: 1998,
        make: 'Honda',
        model: 'Civic',
        trim: 'EX',
        nickname: 'Bluebird',
        engine: '2.0L',
        transmission: 'Manual',
        mileage: 120000,
        cover_photo_url: null,
        archived_at: null,
        created_at: '2024-01-01T00:00:00.000Z',
        updated_at: '2024-01-01T00:00:00.000Z',
      },
      error: null,
    });

    const vehicle = await createVehicle({
      workspaceId: 'ws-1',
      year: 1998,
      make: 'Honda',
      model: 'Civic',
      vin: '12345678901234567',
      nickname: 'Bluebird',
    });

    expect(vehicle.id).toBe('veh-1');
    expect(vehicle.workspaceId).toBe('ws-1');
    expect(vehicle.nickname).toBe('Bluebird');
  });

  it('allows partial updates without requiring all required fields', async () => {
    mockSingle.mockResolvedValue({
      data: {
        id: 'veh-1',
        workspace_id: 'ws-1',
        vin: null,
        year: 1998,
        make: 'Honda',
        model: 'Civic',
        trim: null,
        nickname: 'Weekend Runner',
        engine: null,
        transmission: null,
        mileage: null,
        cover_photo_url: null,
        archived_at: null,
        created_at: '2024-01-01T00:00:00.000Z',
        updated_at: '2024-01-01T00:00:00.000Z',
      },
      error: null,
    });

    await expect(
      updateVehicle('veh-1', { nickname: 'Weekend Runner' })
    ).resolves.toMatchObject({ nickname: 'Weekend Runner' });
  });

  it('archives and restores vehicles by toggling archived_at', async () => {
    mockSingle.mockResolvedValueOnce({
      data: {
        id: 'veh-1',
        workspace_id: 'ws-1',
        vin: null,
        year: 1998,
        make: 'Honda',
        model: 'Civic',
        trim: null,
        nickname: null,
        engine: null,
        transmission: null,
        mileage: null,
        cover_photo_url: null,
        archived_at: '2026-08-02T00:00:00.000Z',
        created_at: '2024-01-01T00:00:00.000Z',
        updated_at: '2024-01-01T00:00:00.000Z',
      },
      error: null,
    });
    mockSingle.mockResolvedValueOnce({
      data: {
        id: 'veh-1',
        workspace_id: 'ws-1',
        vin: null,
        year: 1998,
        make: 'Honda',
        model: 'Civic',
        trim: null,
        nickname: null,
        engine: null,
        transmission: null,
        mileage: null,
        cover_photo_url: null,
        archived_at: null,
        created_at: '2024-01-01T00:00:00.000Z',
        updated_at: '2024-01-01T00:00:00.000Z',
      },
      error: null,
    });

    const archived = await archiveVehicle('veh-1');
    const restored = await restoreVehicle('veh-1');

    expect(archived.archivedAt).not.toBeNull();
    expect(restored.archivedAt).toBeNull();
  });
});
