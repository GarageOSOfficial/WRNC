import { supabase } from '../../lib/supabase';
import {
  createDocument,
  updateDocument,
  archiveDocument,
  restoreDocument,
  listDocuments,
  replaceDocumentFile,
  uploadDocument,
  validateDocumentFile,
} from '../../services/api/documents';
import * as attachmentStorage from '../../services/api/attachmentStorage';

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

jest.mock('../../services/api/attachmentStorage', () => {
  const actual = jest.requireActual('../../services/api/attachmentStorage');
  return {
    ...actual,
    uploadAttachmentObject: jest.fn(),
    removeAttachmentObjects: jest.fn(),
  };
});

const mockFrom = supabase.from as jest.Mock;
const mockUploadObject = attachmentStorage.uploadAttachmentObject as jest.Mock;
const mockRemoveObjects = attachmentStorage.removeAttachmentObjects as jest.Mock;

const makeRow = (overrides: Record<string, unknown> = {}) => ({
  id: 'doc-1',
  workspace_id: 'ws-1',
  vehicle_id: null,
  activity_id: null,
  document_type: 'manual',
  title: 'Service Manual',
  description: null,
  file_url: 'https://cdn.example.com/manual.pdf',
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
  });

  it('creates a document and maps the Supabase row', async () => {
    mockSingle.mockResolvedValue({ data: makeRow({ title: 'Invoice', document_type: 'invoice' }), error: null });

    const document = await createDocument({
      workspaceId: 'ws-1',
      title: 'Invoice',
      documentType: 'invoice',
      fileUrl: 'https://cdn.example.com/invoice.pdf',
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
        fileUrl: '',
        mimeType: 'application/pdf',
        fileSize: 100,
        uploadedBy: 'user-1',
      })
    ).rejects.toThrow(/Title is required/);
  });
});

describe('uploadDocument', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUploadObject.mockResolvedValue(undefined);
    mockRemoveObjects.mockResolvedValue(true);
    mockFrom.mockReturnValue({ insert: mockInsert });
    mockInsert.mockReturnValue({ select: mockSelect });
    mockSelect.mockReturnValue({ single: mockSingle });
  });

  it('uploads the file then inserts the document metadata row', async () => {
    mockSingle.mockResolvedValue({
      data: makeRow({ storage_path: 'user-1/veh-1/receipt/x-r.pdf', original_file_name: 'r.pdf', document_type: 'receipt' }),
      error: null,
    });

    const document = await uploadDocument({
      workspaceId: 'ws-1',
      vehicleId: 'veh-1',
      userId: 'user-1',
      title: 'Brake receipt',
      category: 'receipt',
      file: { name: 'r.pdf', mimeType: 'application/pdf', size: 1024, webFile: new Blob(['x']) },
    });

    expect(mockUploadObject).toHaveBeenCalled();
    expect(mockInsert).toHaveBeenCalled();
    expect(document.storagePath).toBe('user-1/veh-1/receipt/x-r.pdf');
  });

  it('associates an uploaded document with its activity', async () => {
    mockSingle.mockResolvedValue({
      data: makeRow({
        activity_id: 'act-1',
        vehicle_id: 'veh-1',
        storage_path: 'user-1/veh-1/diagram/x-wiring.pdf',
        original_file_name: 'wiring.pdf',
        document_type: 'diagram',
      }),
      error: null,
    });

    await uploadDocument({
      workspaceId: 'ws-1',
      vehicleId: 'veh-1',
      activityId: 'act-1',
      userId: 'user-1',
      title: 'Wiring diagram',
      category: 'diagram',
      file: { name: 'wiring.pdf', mimeType: 'application/pdf', size: 1024, webFile: new Blob(['x']) },
    });

    expect(mockInsert).toHaveBeenCalledWith(expect.objectContaining({
      activity_id: 'act-1',
      vehicle_id: 'veh-1',
      workspace_id: 'ws-1',
    }));
  });

  it('rolls back the uploaded object when the database insert fails', async () => {
    mockSingle.mockResolvedValue({ data: null, error: { message: 'insert failed' } });

    await expect(
      uploadDocument({
        workspaceId: 'ws-1',
        vehicleId: 'veh-1',
        userId: 'user-1',
        title: 'Brake receipt',
        category: 'receipt',
        file: { name: 'r.pdf', mimeType: 'application/pdf', size: 1024, webFile: new Blob(['x']) },
      })
    ).rejects.toThrow(/unable to save this document/i);

    expect(mockRemoveObjects).toHaveBeenCalledWith('vehicle-documents', [expect.stringContaining('user-1/veh-1/receipt/')]);
  });

  it('rejects an unsupported file type before uploading', async () => {
    await expect(
      uploadDocument({
        workspaceId: 'ws-1',
        vehicleId: 'veh-1',
        userId: 'user-1',
        title: 'Bad file',
        category: 'other',
        file: { name: 'x.exe', mimeType: 'application/octet-stream', size: 1024 },
      })
    ).rejects.toThrow();

    expect(mockUploadObject).not.toHaveBeenCalled();
  });

  it('accepts Office, spreadsheet, HEIC, and bounded video records', () => {
    const files = [
      { name: 'manual.docx', mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', size: 1024 },
      { name: 'parts.xlsx', mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', size: 1024 },
      { name: 'wiring.csv', mimeType: 'text/csv', size: 1024 },
      { name: 'progress.heic', mimeType: 'image/heic', size: 1024 },
      { name: 'walkaround.mov', mimeType: 'video/quicktime', size: 50 * 1024 * 1024 },
    ];
    files.forEach((file) => expect(validateDocumentFile(file).valid).toBe(true));
  });

  it('rejects video over the 50 MB limit', () => {
    expect(validateDocumentFile({
      name: 'huge.mov',
      mimeType: 'video/quicktime',
      size: 51 * 1024 * 1024,
    }).valid).toBe(false);
  });
});

describe('replaceDocumentFile', () => {
  const replacement = {
    name: 'new-manual.pdf',
    mimeType: 'application/pdf',
    size: 2048,
    webFile: new Blob(['new']),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUploadObject.mockResolvedValue(undefined);
    mockRemoveObjects.mockResolvedValue(true);
    mockFrom.mockReturnValue({ select: mockSelect, update: mockUpdate });
    mockSelect.mockReturnValue({ eq: mockEq, single: mockSingle });
    mockEq.mockReturnValue({ single: mockSingle, select: mockSelect });
    mockUpdate.mockReturnValue({ eq: mockEq });
  });

  it('persists the replacement before removing the previous object', async () => {
    mockSingle
      .mockResolvedValueOnce({
        data: makeRow({ vehicle_id: 'veh-1', storage_path: 'user-1/veh-1/manual/old.pdf' }),
        error: null,
      })
      .mockResolvedValueOnce({
        data: makeRow({ vehicle_id: 'veh-1', storage_path: 'user-1/veh-1/manual/new.pdf' }),
        error: null,
      });

    const document = await replaceDocumentFile('doc-1', replacement, 'user-1');

    expect(document.storagePath).toBe('user-1/veh-1/manual/new.pdf');
    expect(mockRemoveObjects).toHaveBeenCalledWith('vehicle-documents', ['user-1/veh-1/manual/old.pdf']);
  });

  it('rolls back the new object when replacement metadata is not persisted', async () => {
    mockSingle
      .mockResolvedValueOnce({
        data: makeRow({ vehicle_id: 'veh-1', storage_path: 'user-1/veh-1/manual/old.pdf' }),
        error: null,
      })
      .mockResolvedValueOnce({ data: null, error: { message: 'zero rows' } });

    await expect(replaceDocumentFile('doc-1', replacement, 'user-1')).rejects.toBeTruthy();

    expect(mockRemoveObjects).toHaveBeenCalledTimes(1);
    expect(mockRemoveObjects).toHaveBeenCalledWith(
      'vehicle-documents',
      [expect.stringMatching(/^user-1\/veh-1\/manual\//)]
    );
  });

  it('surfaces previous-object cleanup failure without rolling back the persisted replacement', async () => {
    mockSingle
      .mockResolvedValueOnce({
        data: makeRow({ vehicle_id: 'veh-1', storage_path: 'user-1/veh-1/manual/old.pdf' }),
        error: null,
      })
      .mockResolvedValueOnce({
        data: makeRow({ vehicle_id: 'veh-1', storage_path: 'user-1/veh-1/manual/new.pdf' }),
        error: null,
      });
    mockRemoveObjects.mockResolvedValue(false);

    await expect(replaceDocumentFile('doc-1', replacement, 'user-1')).rejects.toThrow(
      /previous file still needs cleanup/i
    );

    expect(mockRemoveObjects).toHaveBeenCalledTimes(1);
    expect(mockRemoveObjects).toHaveBeenCalledWith('vehicle-documents', ['user-1/veh-1/manual/old.pdf']);
  });
});
