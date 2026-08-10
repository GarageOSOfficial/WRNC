import { supabase } from '../../lib/supabase';
import { createVehicle, updateVehicle, archiveVehicle, restoreVehicle, listVehicles, getVehicle } from '../../services/api/vehicles';
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

  it('accepts year 1900 (lower boundary)', () => {
    const result = validateVehicleInput({ year: 1900, make: 'Honda', model: 'Civic' });

    expect(result.valid).toBe(true);
    expect(result.errors.year).toBeUndefined();
  });

  it('rejects year 1899 (below lower boundary)', () => {
    const result = validateVehicleInput({ year: 1899, make: 'Honda', model: 'Civic' });

    expect(result.valid).toBe(false);
    expect(result.errors.year).toMatch(/Year must be a whole number/);
  });

  it('accepts the next model year (upper boundary)', () => {
    const nextYear = new Date().getFullYear() + 1;
    const result = validateVehicleInput({ year: nextYear, make: 'Honda', model: 'Civic' });

    expect(result.valid).toBe(true);
    expect(result.errors.year).toBeUndefined();
  });

  it('rejects a year beyond the next model year', () => {
    const futureYear = new Date().getFullYear() + 2;
    const result = validateVehicleInput({ year: futureYear, make: 'Honda', model: 'Civic' });

    expect(result.valid).toBe(false);
    expect(result.errors.year).toMatch(/Year must be a whole number/);
  });

  it('rejects a non-integer year', () => {
    const result = validateVehicleInput({ year: 2000.5, make: 'Honda', model: 'Civic' });

    expect(result.valid).toBe(false);
    expect(result.errors.year).toMatch(/Year must be a whole number/);
  });

  it('rejects a VIN that is not 17 characters', () => {
    const result = validateVehicleInput({ year: 2000, make: 'Honda', model: 'Civic', vin: 'TOOSHORT' });

    expect(result.valid).toBe(false);
    expect(result.errors.vin).toBe('VIN must be 17 characters.');
  });

  it('rejects a 16-character VIN', () => {
    const result = validateVehicleInput({ year: 2000, make: 'Honda', model: 'Civic', vin: '1234567890123456' });

    expect(result.valid).toBe(false);
    expect(result.errors.vin).toBe('VIN must be 17 characters.');
  });

  it('rejects an 18-character VIN', () => {
    const result = validateVehicleInput({ year: 2000, make: 'Honda', model: 'Civic', vin: '123456789012345678' });

    expect(result.valid).toBe(false);
    expect(result.errors.vin).toBe('VIN must be 17 characters.');
  });

  it('rejects a VIN with invalid characters (I, O, Q)', () => {
    const result = validateVehicleInput({ year: 2000, make: 'Honda', model: 'Civic', vin: 'IOQIOQIOQIOQIOQIO' });

    expect(result.valid).toBe(false);
    expect(result.errors.vin).toBe('VIN contains invalid characters.');
  });

  it('accepts a valid 17-character VIN', () => {
    const result = validateVehicleInput({ year: 2000, make: 'Honda', model: 'Civic', vin: '1HGCM82633A004352' });

    expect(result.valid).toBe(true);
    expect(result.errors.vin).toBeUndefined();
  });

  it('accepts a valid lowercase VIN by normalizing before validation', () => {
    const result = validateVehicleInput({ year: 2000, make: 'Honda', model: 'Civic', vin: '1hgcm82633a004352' });

    expect(result.valid).toBe(true);
    expect(result.errors.vin).toBeUndefined();
  });

  it('accepts a 17-digit numeric VIN value', () => {
    const result = validateVehicleInput({ year: 2000, make: 'Honda', model: 'Civic', vin: '12345678901234567' });

    expect(result.valid).toBe(true);
    expect(result.errors.vin).toBeUndefined();
  });

  it('accepts a null VIN (VIN is optional)', () => {
    const result = validateVehicleInput({ year: 2000, make: 'Honda', model: 'Civic', vin: null });

    expect(result.valid).toBe(true);
    expect(result.errors.vin).toBeUndefined();
  });

  it('treats whitespace-only VIN as optional blank input', () => {
    const result = validateVehicleInput({ year: 2000, make: 'Honda', model: 'Civic', vin: '   ' });

    expect(result.valid).toBe(true);
    expect(result.errors.vin).toBeUndefined();
  });

  it('rejects negative mileage', () => {
    const result = validateVehicleInput({ year: 2000, make: 'Honda', model: 'Civic', mileage: -1 });

    expect(result.valid).toBe(false);
    expect(result.errors.mileage).toBe('Mileage cannot be negative.');
  });

  it('accepts zero mileage', () => {
    const result = validateVehicleInput({ year: 2000, make: 'Honda', model: 'Civic', mileage: 0 });

    expect(result.valid).toBe(true);
    expect(result.errors.mileage).toBeUndefined();
  });

  it('accepts extremely large mileage (no upper bound)', () => {
    const result = validateVehicleInput({ year: 2000, make: 'Honda', model: 'Civic', mileage: 1_000_000_000 });

    expect(result.valid).toBe(true);
    expect(result.errors.mileage).toBeUndefined();
  });

  it('rejects whitespace-only make and model', () => {
    const result = validateVehicleInput({ year: 2000, make: '   ', model: '\t' });

    expect(result.valid).toBe(false);
    expect(result.errors.make).toBe('Make is required.');
    expect(result.errors.model).toBe('Model is required.');
  });

  it('accepts make and model with surrounding whitespace (trimmed to non-empty)', () => {
    const result = validateVehicleInput({ year: 2000, make: '  Honda  ', model: '  Civic  ' });

    expect(result.valid).toBe(true);
    expect(result.errors.make).toBeUndefined();
    expect(result.errors.model).toBeUndefined();
  });

  // ─── listVehicles ─────────────────────────────────────────────────────────────

  it('listVehicles returns mapped vehicles, excluding archived by default', async () => {
    mockIs.mockResolvedValue({ data: [makeRow({ nickname: 'Bluebird' })], error: null });

    const vehicles = await listVehicles('ws-1');

    expect(vehicles).toHaveLength(1);
    expect(vehicles[0].id).toBe('veh-1');
    expect(vehicles[0].nickname).toBe('Bluebird');
    expect(mockIs).toHaveBeenCalledWith('archived_at', null);
  });

  it('listVehicles includes archived vehicles when includeArchived is true', async () => {
    mockOrder.mockResolvedValue({
      data: [makeRow(), makeRow({ id: 'veh-2', archived_at: '2026-01-01T00:00:00.000Z' })],
      error: null,
    });

    const vehicles = await listVehicles('ws-1', { includeArchived: true });

    expect(vehicles).toHaveLength(2);
    expect(mockIs).not.toHaveBeenCalled();
  });

  it('listVehicles returns an empty array when the workspace has no vehicles', async () => {
    mockIs.mockResolvedValue({ data: [], error: null });

    const vehicles = await listVehicles('ws-1');

    expect(vehicles).toEqual([]);
  });

  it('listVehicles throws when Supabase returns an error', async () => {
    mockIs.mockResolvedValue({ data: null, error: { message: 'list failed' } });

    await expect(listVehicles('ws-1')).rejects.toMatchObject({ message: 'list failed' });
  });

  // ─── getVehicle ───────────────────────────────────────────────────────────────

  it('getVehicle returns a mapped vehicle by id', async () => {
    mockSingle.mockResolvedValue({ data: makeRow({ year: 2005, make: 'Toyota', model: 'Supra' }), error: null });

    const vehicle = await getVehicle('veh-1');

    expect(vehicle.id).toBe('veh-1');
    expect(vehicle.year).toBe(2005);
    expect(vehicle.make).toBe('Toyota');
  });

  it('getVehicle throws when Supabase returns an error', async () => {
    mockSingle.mockResolvedValue({ data: null, error: { message: 'not found' } });

    await expect(getVehicle('veh-99')).rejects.toMatchObject({ message: 'not found' });
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

  // ─── updateVehicle validation (bug fix coverage) ──────────────────────────────

  it('updateVehicle throws when VIN has invalid length', async () => {
    await expect(
      updateVehicle('veh-1', { vin: 'TOOSHORT' })
    ).rejects.toThrow('VIN must be 17 characters.');
  });

  it('updateVehicle throws when VIN has invalid characters', async () => {
    await expect(
      updateVehicle('veh-1', { vin: 'IOQIOQIOQIOQIOQIO' })
    ).rejects.toThrow('VIN contains invalid characters.');
  });

  it('updateVehicle normalizes VIN before saving', async () => {
    mockSingle.mockResolvedValue({ data: makeRow({ vin: '1HGCM82633A004352' }), error: null });

    await updateVehicle('veh-1', { vin: ' 1hgcm82633a004352 ' });

    expect(mockUpdate).toHaveBeenCalledWith(expect.objectContaining({ vin: '1HGCM82633A004352' }));
  });

  it('updateVehicle throws when mileage is negative', async () => {
    await expect(
      updateVehicle('veh-1', { mileage: -500 })
    ).rejects.toThrow('Mileage cannot be negative.');
  });

  it('updateVehicle accepts null VIN (clearing the field)', async () => {
    mockSingle.mockResolvedValue({ data: makeRow({ vin: null }), error: null });

    await expect(
      updateVehicle('veh-1', { vin: null })
    ).resolves.toMatchObject({ vin: null });
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
