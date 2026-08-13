import { validateDocumentInput } from '../../utils/validators';

describe('document validation', () => {
  it('requires a title, document type, and secure file path', () => {
    const result = validateDocumentInput({
      workspaceId: 'ws-1',
      title: '   ',
      documentType: '' as never,
      filePath: '',
      mimeType: 'application/pdf',
      fileSize: 100,
    });

    expect(result.valid).toBe(false);
    expect(result.errors.title).toBe('Title is required.');
    expect(result.errors.documentType).toBe('Document type is required.');
    expect(result.errors.filePath).toBe('File path is required.');
  });

  it('rejects unsupported MIME types', () => {
    const result = validateDocumentInput({
      workspaceId: 'ws-1',
      title: 'Invoice',
      documentType: 'invoice',
      filePath: 'user-1/vehicle-1/invoice.pdf',
      mimeType: 'application/octet-stream',
      fileSize: 100,
    });

    expect(result.valid).toBe(false);
    expect(result.errors.mimeType).toBe('Unsupported MIME type.');
  });

  it('rejects non-positive file sizes', () => {
    const result = validateDocumentInput({
      workspaceId: 'ws-1',
      title: 'Receipt',
      documentType: 'receipt',
      filePath: 'user-1/vehicle-1/receipt.pdf',
      mimeType: 'application/pdf',
      fileSize: 0,
    });

    expect(result.valid).toBe(false);
    expect(result.errors.fileSize).toBe('File size must be greater than 0.');
  });

  it('accepts a valid document payload', () => {
    const result = validateDocumentInput({
      workspaceId: 'ws-1',
      title: 'Service Record',
      documentType: 'manual',
      filePath: 'user-1/vehicle-1/service-record.pdf',
      mimeType: 'application/pdf',
      fileSize: 2048,
    });

    expect(result.valid).toBe(true);
    expect(result.errors).toEqual({});
  });
});
