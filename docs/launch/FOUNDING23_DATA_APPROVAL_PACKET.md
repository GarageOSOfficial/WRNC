# Founding 23 data approval packet

## Status

Prepared only. Nothing in this packet has been applied to Supabase, merged,
deployed, or connected to the public application form.

## Recommended decision

Require an authenticated WRNC account before final Founding 23 submission.

This creates a stable `auth.uid()` ownership boundary, prevents anonymous table
writes, and gives applicants direct access to view or delete their own
application. Business can review the twenty-person intake manually through a
trusted administrative surface. No applicant-management product is proposed.

## Data separation

### `public.founding23_applications`

Purpose: private application intake.

- One application per authenticated user
- Applicant can insert, view, or delete only their own row
- Applicant cannot update selection state
- Anonymous clients receive no privileges
- No build-photo storage in this migration
- Default retention deadline is 180 days after submission

### `public.founding_builder_numbers`

Purpose: permanent association between an approved account and number 001-023.

- Exactly twenty-three pre-seeded number rows
- Numbers 001, 002, and 007 marked reserved
- Number range and user uniqueness enforced by PostgreSQL
- Authenticated users can read only their own assignment
- Ordinary users receive no assignment, update, or deletion privilege
- Once assigned, a number cannot be assigned to a different user
- Account deletion retires the number and removes the user association

The membership table is not a subscription, application status, or public
directory.

## Proposed consent copy

Checkbox label:

> I agree that WRNC may store and review this application to select the Founding 23. I understand that my application is private, is not a guarantee of selection, and may be deleted according to the Founding 23 retention policy.

Required participation checkbox remains separate:

> I am willing to actively use WRNC on this build and provide structured product feedback.

Consent version proposed for the first activation: `founding23-intake-2026-08-26`.

## Proposed retention and deletion rules

1. Applications receive a maximum initial retention window of 180 days.
2. After a decision, unselected applications are deleted within 90 days.
3. Selected application content is deleted within 90 days after membership
   assignment unless a narrower business need is documented.
4. An applicant can delete their own application at any time.
5. Account deletion cascades to the application and removes the account link
   from the permanent number record. The number is retired and never recycled.
6. Until automated retention exists, Business owns a weekly manual deletion
   review using `retention_expires_at`.

## Reviewer access

No reviewer UI, reviewer JWT role, or public admin API is proposed for V1.

Business review should use an approved trusted Supabase administrative surface.
The application client receives no cross-applicant read permission. Service-role
credentials must never enter the web or native application.

## Migration files

- Forward migration:
  `supabase/migrations/20260826020000_founding23_private_intake_and_membership.sql`
- Transactional dry-run:
  `supabase/dry-runs/founding23_private_intake_and_membership.sql`
- Pre-data rollback:
  `supabase/rollbacks/20260826020000_founding23_private_intake_and_membership.rollback.sql`

## Dry-run status

Static policy tests are included and runnable with Jest.

The local Supabase CLI could not start on this machine. Version `2.115.0`
terminated with exit code 132 before it could create or run a local migration.
Docker is not available. Therefore this packet does not claim a database-executed
dry-run.

The transactional dry-run script is exact and ends with `rollback`. It must be
executed only against an approved disposable or staging database before remote
production application.

## Decisions required before implementation

1. Approve authenticated submission as the V1 intake boundary.
2. Approve the consent copy and consent version.
3. Approve the 180-day maximum initial retention and 90-day post-decision rule.
4. Name the people allowed to review applications in Supabase.
5. Approve an exact disposable or staging project reference for the
   transactional dry-run.
6. After successful dry-run evidence, separately approve production migration.
7. After production verification, separately approve form transmission and the
   public Apply CTA.

## Explicitly excluded

- Build-photo uploads
- Anonymous submission
- Applicant scoring
- Automated selection
- Public Founding Builder directory
- Membership pricing or subscription behavior
- Production migration
- Submission activation
