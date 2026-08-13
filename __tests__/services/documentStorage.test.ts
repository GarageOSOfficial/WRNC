import { createDocumentObjectPath, validatePickedDocument } from '../../services/documentStorage';

describe('secure document storage', () => {
  const file = { uri: 'file:///manual.pdf', name: 'manual.pdf', mimeType: 'application/pdf', size: 1024 };
  it('creates an owner and vehicle scoped collision-safe path', () => {
    const first = createDocumentObjectPath('user-1', 'vehicle-1', file);
    const second = createDocumentObjectPath('user-1', 'vehicle-1', file);
    expect(first).toMatch(/^user-1\/vehicle-1\/.+\.pdf$/);
    expect(second).not.toBe(first);
  });
  it('accepts supported PDFs and images', () => expect(() => validatePickedDocument(file)).not.toThrow());
  it('rejects unsupported types', () => expect(() => validatePickedDocument({ ...file, mimeType: 'text/html' })).toThrow(/PDF/));
  it('rejects oversized files', () => expect(() => validatePickedDocument({ ...file, size: 26 * 1024 * 1024 })).toThrow(/25 MB/));
});
