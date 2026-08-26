import fs from 'fs';
import path from 'path';

const migrationPath = path.join(
  process.cwd(),
  'supabase/migrations/20260826020000_founding23_private_intake_and_membership.sql'
);

describe('Founding 23 private intake and membership migration', () => {
  const sql = fs.readFileSync(migrationPath, 'utf8');

  it('is explicitly gated from remote application', () => {
    expect(sql).toContain('DO NOT APPLY WITHOUT FOUNDER APPROVAL');
  });

  it('requires authenticated ownership for applicant access', () => {
    expect(sql).toContain('to authenticated');
    expect(sql).toContain('(select auth.uid()) = applicant_user_id');
    expect(sql).toContain('revoke all on table public.founding23_applications from anon');
  });

  it('does not grant applicants update access to review state', () => {
    expect(sql).toContain('grant select, delete on table public.founding23_applications to authenticated');
    expect(sql).toContain('grant insert (');
    expect(sql).not.toContain(
      'grant select, insert, update, delete on table public.founding23_applications to authenticated'
    );
    expect(sql).not.toContain('status,\n  submitted_at');
  });

  it('enforces the permanent number range and uniqueness', () => {
    expect(sql).toContain('founding_number smallint primary key');
    expect(sql).toContain('founding_number between 1 and 23');
    expect(sql).toContain('user_id uuid unique');
    expect(sql).toContain('Founding Builder number % cannot be reassigned');
  });

  it('keeps membership assignment unavailable to ordinary users', () => {
    expect(sql).toContain('revoke all on table public.founding_builder_numbers from authenticated');
    expect(sql).toContain('grant select on table public.founding_builder_numbers to authenticated');
    expect(sql).not.toContain('grant update on table public.founding_builder_numbers to authenticated');
  });

  it('seeds exactly the approved number range and reserved numbers', () => {
    expect(sql).toContain('from generate_series(1, 23) as n');
    expect(sql).toContain('n in (1, 2, 7)');
  });
});
