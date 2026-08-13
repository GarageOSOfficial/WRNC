import fs from 'fs';
import path from 'path';

describe('vehicle document storage migration', () => {
  const sql = fs.readFileSync(
    path.join(process.cwd(), 'supabase/migrations/20260812150000_secure_vehicle_documents.sql'),
    'utf8'
  );

  it('keeps the bucket private and restricts content at the server', () => {
    expect(sql).toContain("values ('vehicle-documents', 'vehicle-documents', false, 26214400");
    expect(sql).toContain("array['application/pdf','image/jpeg','image/png','image/webp']");
  });

  it('ties object access to both the authenticated owner and owned vehicle', () => {
    expect(sql).toContain("(storage.foldername(name))[1] = (select auth.uid())::text");
    expect(sql).toContain("v.id::text = (storage.foldername(name))[2]");
    expect(sql).toContain('w.owner_id = (select auth.uid())');
  });

  it('prevents metadata from pointing outside the owner and vehicle path', () => {
    expect(sql).toContain('uploaded_by = (select auth.uid())');
    expect(sql).toContain("(storage.foldername(file_path))[2] = vehicle_id::text");
    expect(sql).toContain('v.workspace_id = documents.workspace_id');
  });
});
