import { supabase } from '../../lib/supabase';
import {
  createDocument,
  updateDocument,
  archiveDocument,
  restoreDocument,
  listDocuments,
  getDocument,
} from '../../services/api/documents';

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
    mockSingle.mockResolvedValue({ data: makeRow({ title: 'Invoice' }), error: null });

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
