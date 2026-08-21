import {
  getVehiclePhotoSignedUrl,
  removeVehiclePhoto,
  replaceVehiclePhoto,
  uploadVehiclePhoto,
  validateVehiclePhotoFile,
  MAX_PHOTO_SIZE_BYTES,
} from '../../services/api/vehiclePhotos';
import * as attachmentStorage from '../../services/api/attachmentStorage';
import { supabase } from '../../lib/supabase';
import { getVehicle } from '../../services/api/vehicles';

jest.mock('../../lib/supabase', () => ({
  __esModule: true,
  supabase: {
    from: jest.fn(),
  },
}));

jest.mock('../../services/api/vehicles', () => ({
  getVehicle: jest.fn(),
}));

jest.mock('../../services/api/attachmentStorage', () => {
  const actual = jest.requireActual('../../services/api/attachmentStorage');
  return {
    ...actual,
    uploadAttachmentObject: jest.fn(),
    removeAttachmentObjects: jest.fn(),
    getAttachmentSignedUrl: jest.fn(),
  };
});

const mockDbFrom = supabase.from as jest.Mock;
const mockedGetVehicle = getVehicle as jest.Mock;
const mockUpload = attachmentStorage.uploadAttachmentObject as jest.Mock;
const mockRemove = attachmentStorage.removeAttachmentObjects as jest.Mock;
const mockSignedUrl = attachmentStorage.getAttachmentSignedUrl as jest.Mock;

function mockUpdateChain(result: { data: unknown; error: unknown }) {
  const single = jest.fn().mockResolvedValue(result);
  const select = jest.fn().mockReturnValue({ single });
  const eq = jest.fn().mockReturnValue({ select });
  const update = jest.fn().mockReturnValue({ eq });
  mockDbFrom.mockReturnValue({ update });
  return update;
}

describe('vehicle photo validation', () => {
  it('accepts a valid jpeg under the limit', () => {
    const result = validateVehiclePhotoFile({ name: 'cover.jpg', mimeType: 'image/jpeg', size: 1024 });
    expect(result.valid).toBe(true);
  });

  it('rejects an oversized file', () => {
    const result = validateVehiclePhotoFile({
      name: 'cover.jpg',
      mimeType: 'image/jpeg',
      size: MAX_PHOTO_SIZE_BYTES + 1,
    });
    expect(result.valid).toBe(false);
  });

  it('rejects a non-image MIME type', () => {
    const result = validateVehiclePhotoFile({ name: 'cover.pdf', mimeType: 'application/pdf', size: 1024 });
    expect(result.valid).toBe(false);
  });
});

describe('uploadVehiclePhoto', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUpload.mockResolvedValue(undefined);
    mockRemove.mockResolvedValue(true);
  });

  it('uploads and persists only the cover_photo_path', async () => {
    mockUpdateChain({
      data: { id: 'veh-1', workspace_id: 'ws-1', cover_photo_path: 'user-1/veh-1/cover/x-cover.jpg' },
      error: null,
    });

    const result = await uploadVehiclePhoto(
      'veh-1',
      { name: 'cover.jpg', mimeType: 'image/jpeg', size: 1024, webFile: new Blob(['x']) },
      'user-1'
    );

    expect(mockUpload).toHaveBeenCalled();
    expect(result.vehicle.coverPhotoPath).toBe('user-1/veh-1/cover/x-cover.jpg');
  });

  it('rolls back the uploaded object when the database update fails', async () => {
    mockUpdateChain({ data: null, error: { message: 'db failed' } });

    await expect(
      uploadVehiclePhoto(
        'veh-1',
        { name: 'cover.jpg', mimeType: 'image/jpeg', size: 1024, webFile: new Blob(['x']) },
        'user-1'
      )
    ).rejects.toThrow(/unable to save the vehicle photo/i);

    expect(mockRemove).toHaveBeenCalledWith('vehicle-photos', [expect.stringContaining('user-1/veh-1/cover/')]);
  });

  it('rejects invalid files before attempting an upload', async () => {
    await expect(
      uploadVehiclePhoto('veh-1', { name: 'x.pdf', mimeType: 'application/pdf', size: 1024 }, 'user-1')
    ).rejects.toThrow();

    expect(mockUpload).not.toHaveBeenCalled();
  });
});

describe('replaceVehiclePhoto', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUpload.mockResolvedValue(undefined);
    mockRemove.mockResolvedValue(true);
  });

  it('removes the previous object only after the new path saves successfully', async () => {
    mockedGetVehicle.mockResolvedValue({ id: 'veh-1', workspaceId: 'ws-1', coverPhotoPath: 'user-1/veh-1/cover/old.jpg' });
    mockUpdateChain({
      data: { id: 'veh-1', workspace_id: 'ws-1', cover_photo_path: 'user-1/veh-1/cover/new.jpg' },
      error: null,
    });

    const result = await replaceVehiclePhoto(
      'veh-1',
      { name: 'new.jpg', mimeType: 'image/jpeg', size: 1024, webFile: new Blob(['x']) },
      'user-1'
    );

    expect(result.vehicle.coverPhotoPath).toBe('user-1/veh-1/cover/new.jpg');
    expect(mockRemove).toHaveBeenCalledWith('vehicle-photos', ['user-1/veh-1/cover/old.jpg']);
  });

  it('preserves the old photo path when the database update fails', async () => {
    mockedGetVehicle.mockResolvedValue({ id: 'veh-1', workspaceId: 'ws-1', coverPhotoPath: 'user-1/veh-1/cover/old.jpg' });
    mockUpdateChain({ data: null, error: { message: 'db failed' } });

    await expect(
      replaceVehiclePhoto(
        'veh-1',
        { name: 'new.jpg', mimeType: 'image/jpeg', size: 1024, webFile: new Blob(['x']) },
        'user-1'
      )
    ).rejects.toThrow(/unable to save the replacement/i);

    // Only the failed new upload is cleaned up; the old path was never touched.
    expect(mockRemove).toHaveBeenCalledTimes(1);
    expect(mockRemove).toHaveBeenCalledWith('vehicle-photos', [expect.stringContaining('user-1/veh-1/cover/')]);
    expect(mockRemove).not.toHaveBeenCalledWith('vehicle-photos', ['user-1/veh-1/cover/old.jpg']);
  });

  it('surfaces old-object cleanup failure without deleting the persisted replacement', async () => {
    mockedGetVehicle.mockResolvedValue({ id: 'veh-1', workspaceId: 'ws-1', coverPhotoPath: 'user-1/veh-1/cover/old.jpg' });
    mockUpdateChain({
      data: { id: 'veh-1', workspace_id: 'ws-1', cover_photo_path: 'user-1/veh-1/cover/new.jpg' },
      error: null,
    });
    mockRemove.mockResolvedValue(false);

    await expect(
      replaceVehiclePhoto(
        'veh-1',
        { name: 'new.jpg', mimeType: 'image/jpeg', size: 1024, webFile: new Blob(['x']) },
        'user-1'
      )
    ).rejects.toThrow(/previous file still needs cleanup/i);

    expect(mockRemove).toHaveBeenCalledTimes(1);
    expect(mockRemove).toHaveBeenCalledWith('vehicle-photos', ['user-1/veh-1/cover/old.jpg']);
  });
});

describe('removeVehiclePhoto', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockRemove.mockResolvedValue(true);
  });

  it('clears the database path and removes the object', async () => {
    mockedGetVehicle.mockResolvedValue({ id: 'veh-1', workspaceId: 'ws-1', coverPhotoPath: 'user-1/veh-1/cover/x.jpg' });
    mockUpdateChain({ data: { id: 'veh-1', workspace_id: 'ws-1', cover_photo_path: null }, error: null });

    const result = await removeVehiclePhoto('veh-1');

    expect(result.vehicle.coverPhotoPath).toBeNull();
    expect(mockRemove).toHaveBeenCalledWith('vehicle-photos', ['user-1/veh-1/cover/x.jpg']);
  });

  it('is a no-op when there is no existing photo', async () => {
    mockedGetVehicle.mockResolvedValue({ id: 'veh-1', workspaceId: 'ws-1', coverPhotoPath: null });

    const result = await removeVehiclePhoto('veh-1');

    expect(result.path).toBe('');
    expect(mockRemove).not.toHaveBeenCalled();
  });

  it('surfaces stored-object cleanup failure after detaching the photo', async () => {
    mockedGetVehicle.mockResolvedValue({ id: 'veh-1', workspaceId: 'ws-1', coverPhotoPath: 'user-1/veh-1/cover/x.jpg' });
    mockUpdateChain({ data: { id: 'veh-1', workspace_id: 'ws-1', cover_photo_path: null }, error: null });
    mockRemove.mockResolvedValue(false);

    await expect(removeVehiclePhoto('veh-1')).rejects.toThrow(/stored file still needs cleanup/i);
  });
});

describe('getVehiclePhotoSignedUrl', () => {
  it('delegates to the shared signed-url helper for the vehicle-photos bucket', async () => {
    mockSignedUrl.mockResolvedValue('https://cdn.example.com/signed.jpg');

    const url = await getVehiclePhotoSignedUrl('user-1/veh-1/cover/x.jpg');

    expect(url).toBe('https://cdn.example.com/signed.jpg');
    expect(mockSignedUrl).toHaveBeenCalledWith('vehicle-photos', 'user-1/veh-1/cover/x.jpg', 60);
  });
});
