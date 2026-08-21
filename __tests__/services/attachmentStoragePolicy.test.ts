import fs from 'fs';
import path from 'path';

describe('corrective vehicle attachment Storage migration', () => {
  const sql = fs.readFileSync(
    path.join(
      process.cwd(),
      'supabase/migrations/20260814062159_correct_vehicle_attachment_storage_policies.sql'
    ),
    'utf8'
  );

  it('rebuilds all four operations for both private attachment buckets', () => {
    expect(sql).toContain("array['vehicle-photos', 'vehicle-documents']");
    expect(sql).toContain("array['select', 'insert', 'update', 'delete']");
    expect(sql).toContain('to authenticated');
  });

  it('qualifies every object-path lookup with storage.objects.name', () => {
    const qualifiedLookups = sql.match(/storage\.foldername\(objects\.name\)/g) ?? [];
    expect(qualifiedLookups).toHaveLength(8);
    expect(sql).not.toMatch(/storage\.foldername\(name\)/);
  });

  it('keeps ownership tied to both the user path and owned vehicle', () => {
    expect(sql).toContain("[1] = ((select auth.uid())::text)");
    expect(sql).toContain("v.id::text = (storage.foldername(objects.name))[2]");
    expect(sql).toContain('w.owner_id = (select auth.uid())');
  });
});
