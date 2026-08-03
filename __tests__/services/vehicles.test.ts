import { supabase } from '../../lib/supabase';
import { createVehicle, updateVehicle, archiveVehicle, restoreVehicle } from '../../services/api/vehicles';
import { validateVehicleInput } from '../../utils/validators';

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
  ...overrides,
});

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

  // ─── Validation ──────────────────────────────────────────────────────────────

  it('validates creation requirements for year, make, and model', () => {
    const result = validateVehicleInput({ year: undefined as unknown as number, make: '', model: '' });

    expect(result.valid).toBe(false);
    expect(result.errors.year).toBe('Year is required.');
    expect(result.errors.make).toBe('Make is required.');
    expect(result.errors.model).toBe('Model is required.');
  });

  it('rejects a year beyond the next model year', () => {
    const futureYear = new Date().getFullYear() + 2;
    const result = validateVehicleInput({ year: futureYear, make: 'Honda', model: 'Civic' });

    expect(result.valid).toBe(false);
    expect(result.errors.year).toMatch(/Year must be a whole number/);
  });

  it('rejects a VIN that is not 17 characters', () => {
    const result = validateVehicleInput({ year: 2000, make: 'Honda', model: 'Civic', vin: 'TOOSHORT' });

    expect(result.valid).toBe(false);
    expect(result.errors.vin).toBe('VIN must be 17 characters.');
  });

  it('rejects a VIN with invalid characters (I, O, Q)', () => {
    const result = validateVehicleInput({ year: 2000, make: 'Honda', model: 'Civic', vin: 'IOQIOQIOQIOQIOQIO' });

    expect(result.valid).toBe(false);
    expect(result.errors.vin).toBe('VIN contains invalid characters.');
  });

  it('rejects negative mileage', () => {
    const result = validateVehicleInput({ year: 2000, make: 'Honda', model: 'Civic', mileage: -1 });

    expect(result.valid).toBe(false);
    expect(result.errors.mileage).toBe('Mileage cannot be negative.');
  });

  it('rejects whitespace-only make and model', () => {
    const result = validateVehicleInput({ year: 2000, make: '   ', model: '\t' });

    expect(result.valid).toBe(false);
    expect(result.errors.make).toBe('Make is required.');
    expect(result.errors.model).toBe('Model is required.');
  });

  // ─── Happy-path CRUD ─────────────────────────────────────────────────────────

  it('creates a vehicle and maps the Supabase row to the app shape', async () => {
    mockSingle.mockResolvedValue({
      data: makeRow({ vin: '12345678901234567', trim: 'EX', nickname: 'Bluebird', engine: '2.0L', transmission: 'Manual', mileage: 120000 }),
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
      data: makeRow({ nickname: 'Weekend Runner' }),
      error: null,
    });

    await expect(
      updateVehicle('veh-1', { nickname: 'Weekend Runner' })
    ).resolves.toMatchObject({ nickname: 'Weekend Runner' });
  });

  it('archives and restores vehicles by toggling archived_at', async () => {
    mockSingle.mockResolvedValueOnce({
      data: makeRow({ archived_at: '2026-08-02T00:00:00.000Z' }),
      error: null,
    });
    mockSingle.mockResolvedValueOnce({
      data: makeRow({ archived_at: null }),
      error: null,
    });

    const archived = await archiveVehicle('veh-1');
    const restored = await restoreVehicle('veh-1');

    expect(archived.archivedAt).not.toBeNull();
    expect(restored.archivedAt).toBeNull();
  });

  // ─── Supabase failure paths ───────────────────────────────────────────────────

  it('createVehicle throws when Supabase returns an error', async () => {
    mockSingle.mockResolvedValue({ data: null, error: { message: 'insert failed' } });

    await expect(
      createVehicle({ workspaceId: 'ws-1', year: 2000, make: 'Honda', model: 'Civic' })
    ).rejects.toMatchObject({ message: 'insert failed' });
  });

  it('updateVehicle throws when Supabase returns an error', async () => {
    mockSingle.mockResolvedValue({ data: null, error: { message: 'update failed' } });

    await expect(
      updateVehicle('veh-1', { make: 'Toyota' })
    ).rejects.toMatchObject({ message: 'update failed' });
  });

  it('archiveVehicle throws when Supabase returns an error', async () => {
    mockSingle.mockResolvedValue({ data: null, error: { message: 'archive failed' } });

    await expect(archiveVehicle('veh-1')).rejects.toMatchObject({ message: 'archive failed' });
  });

  it('restoreVehicle throws when Supabase returns an error', async () => {
    mockSingle.mockResolvedValue({ data: null, error: { message: 'restore failed' } });

    await expect(restoreVehicle('veh-1')).rejects.toMatchObject({ message: 'restore failed' });
  });
});
