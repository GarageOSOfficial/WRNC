import { supabase } from '../../lib/supabase';
import {
  createDocument,
  updateDocument,
  archiveDocument,
  restoreDocument,
  listDocuments,
  uploadVehicleDocument,
  replaceDocumentFile,
} from '../../services/api/documents';
import {
  createDocumentObjectPath,
  createDocumentSignedUrl,
  removeDocumentObject,
  uploadDocumentObject,
} from '../../services/documentStorage';

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

jest.mock('../../services/documentStorage', () => ({
  createDocumentObjectPath: jest.fn(() => 'user-1/vehicle-1/new.pdf'),
  createDocumentSignedUrl: jest.fn(() => Promise.resolve('https://signed.example/file')),
  removeDocumentObject: jest.fn(() => Promise.resolve()),
  uploadDocumentObject: jest.fn(() => Promise.resolve()),
}));

const mockFrom = supabase.from as jest.Mock;

const makeRow = (overrides: Record<string, unknown> = {}) => ({
  id: 'doc-1',
  workspace_id: 'ws-1',
  vehicle_id: null,
  activity_id: null,
  document_type: 'manual',
  title: 'Service Manual',
  description: null,
  file_path: 'user-1/vehicle-1/manual.pdf',
  thumbnail_url: null,
  mime_type: 'application/pdf',
  file_size: 1024,
  uploaded_by: 'user-1',
  uploaded_at: '2024-01-01T00:00:00.000Z',
  created_at: '2024-01-01T00:00:00.000Z',
  updated_at: '2024-01-01T00:00:00.000Z',
  archived_at: null,
  ...overrides,
});

describe('document CRUD service', () => {
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

  it('lists documents for a workspace excluding archived by default', async () => {
    mockIs.mockResolvedValue({ data: [makeRow()], error: null });

    const documents = await listDocuments('ws-1');

    expect(documents).toHaveLength(1);
    expect(documents[0].title).toBe('Service Manual');
    expect(mockIs).toHaveBeenCalledWith('archived_at', null);
    expect(createDocumentSignedUrl).toHaveBeenCalledWith('user-1/vehicle-1/manual.pdf');
    expect(documents[0].signedUrl).toBe('https://signed.example/file');
  });

  it('creates a document and maps the Supabase row', async () => {
    mockSingle.mockResolvedValue({ data: makeRow({ title: 'Invoice', document_type: 'invoice' }), error: null });

    const document = await createDocument({
      workspaceId: 'ws-1',
      title: 'Invoice',
      documentType: 'invoice',
      filePath: 'user-1/vehicle-1/invoice.pdf',
      mimeType: 'application/pdf',
      fileSize: 200,
      uploadedBy: 'user-1',
    });

    expect(document.title).toBe('Invoice');
    expect(document.documentType).toBe('invoice');
  });

  it('updates a document', async () => {
    mockSingle.mockResolvedValue({ data: makeRow({ title: 'Updated' }), error: null });

    const document = await updateDocument('doc-1', { title: 'Updated' });

    expect(document.title).toBe('Updated');
  });

  it('archives and restores a document', async () => {
    mockSingle.mockResolvedValueOnce({ data: makeRow({ archived_at: '2024-01-02T00:00:00.000Z' }), error: null });
    mockSingle.mockResolvedValueOnce({ data: makeRow({ archived_at: null }), error: null });

    const archived = await archiveDocument('doc-1');
    const restored = await restoreDocument('doc-1');

    expect(archived.archivedAt).toBeTruthy();
    expect(restored.archivedAt).toBeNull();
  });

  it('throws on validation failure', async () => {
    await expect(
      createDocument({
        workspaceId: 'ws-1',
        title: '   ',
        documentType: 'manual',
        filePath: '',
        mimeType: 'application/pdf',
        fileSize: 100,
        uploadedBy: 'user-1',
      })
    ).rejects.toThrow(/Title is required/);
  });

  it('removes an uploaded object when metadata creation fails', async () => {
    mockSingle.mockResolvedValue({ data: null, error: new Error('metadata failed') });
    const file = { uri: 'file:///manual.pdf', name: 'manual.pdf', mimeType: 'application/pdf', size: 100 };
    await expect(uploadVehicleDocument({
      workspaceId: 'ws-1', vehicleId: 'vehicle-1', userId: 'user-1', title: 'Manual', documentType: 'Manual', file,
    })).rejects.toThrow('metadata failed');
    expect(uploadDocumentObject).toHaveBeenCalledWith('user-1/vehicle-1/new.pdf', file);
    expect(removeDocumentObject).toHaveBeenCalledWith('user-1/vehicle-1/new.pdf');
  });

  it('removes the replacement object when the metadata update fails', async () => {
    mockSingle
      .mockResolvedValueOnce({ data: makeRow({ vehicle_id: 'vehicle-1' }), error: null })
      .mockResolvedValueOnce({ data: null, error: new Error('update failed') });
    const file = { uri: 'file:///new.pdf', name: 'new.pdf', mimeType: 'application/pdf', size: 200 };
    await expect(replaceDocumentFile('doc-1', file, 'user-1')).rejects.toThrow('update failed');
    expect(createDocumentObjectPath).toHaveBeenCalled();
    expect(removeDocumentObject).toHaveBeenCalledWith('user-1/vehicle-1/new.pdf');
  });
});
