import { randomUUID } from 'node:crypto';
import { createClient } from '@supabase/supabase-js';

const required = [
  'EXPO_PUBLIC_SUPABASE_URL',
  'EXPO_PUBLIC_SUPABASE_ANON_KEY',
  'WRNC_QA_ACCOUNT_A_EMAIL',
  'WRNC_QA_ACCOUNT_A_PASSWORD',
  'WRNC_QA_ACCOUNT_B_EMAIL',
  'WRNC_QA_ACCOUNT_B_PASSWORD',
];

const missing = required.filter((name) => !process.env[name]);
if (missing.length > 0) {
  console.error(`Missing required QA environment variables: ${missing.join(', ')}`);
  process.exit(2);
}

const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
const anonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
const runId = randomUUID();
const photoPaths = [];
const documentPaths = [];
const accountBPaths = [];
let vehicleId;
let documentId;

const makeClient = () => createClient(url, anonKey, {
  auth: { autoRefreshToken: false, detectSessionInUrl: false, persistSession: false },
});

const accountA = makeClient();
const accountB = makeClient();
const anonymous = makeClient();
const results = [];

function record(check, pass, detail) {
  results.push({ check, pass, detail });
  console.log(`${pass ? 'PASS' : 'FAIL'}  ${check}${detail ? ` — ${detail}` : ''}`);
}

function expectNoRows(result, operation) {
  if (result.error) throw new Error(`${operation} returned an unexpected API error.`);
  if ((result.data ?? []).length !== 0) throw new Error(`${operation} affected or exposed an owner row.`);
}

async function signIn(client, email, password) {
  const { data, error } = await client.auth.signInWithPassword({ email, password });
  if (error || !data.user) throw new Error('QA account sign-in failed.');
  return data.user;
}

async function ownedWorkspace(client) {
  const { data, error } = await client.from('workspaces').select('id').limit(1).single();
  if (error || !data) throw new Error('Unable to resolve the QA workspace.');
  return data.id;
}

async function objectExists(client, bucket, path) {
  const { data, error } = await client.storage.from(bucket).download(path);
  return !error && Boolean(data);
}

async function removeKnown(client, bucket, paths) {
  if (paths.length === 0) return;
  await client.storage.from(bucket).remove([...new Set(paths)]);
}

async function cleanup() {
  await removeKnown(accountA, 'vehicle-photos', photoPaths);
  await removeKnown(accountA, 'vehicle-documents', documentPaths);
  await removeKnown(accountB, 'vehicle-photos', accountBPaths);

  if (documentId) {
    await accountA.from('documents').update({ archived_at: new Date().toISOString() }).eq('id', documentId);
  }
  if (vehicleId) {
    await accountA.from('vehicles').update({ archived_at: new Date().toISOString(), cover_photo_path: null }).eq('id', vehicleId);
  }

  await Promise.allSettled([accountA.auth.signOut(), accountB.auth.signOut()]);
}

try {
  const [userA, userB] = await Promise.all([
    signIn(accountA, process.env.WRNC_QA_ACCOUNT_A_EMAIL, process.env.WRNC_QA_ACCOUNT_A_PASSWORD),
    signIn(accountB, process.env.WRNC_QA_ACCOUNT_B_EMAIL, process.env.WRNC_QA_ACCOUNT_B_PASSWORD),
  ]);
  const workspaceA = await ownedWorkspace(accountA);

  const vehicle = await accountA
    .from('vehicles')
    .insert({ workspace_id: workspaceA, year: 2026, make: 'WRNC QA', model: runId })
    .select('id')
    .single();
  if (vehicle.error || !vehicle.data) throw new Error('Unable to create the temporary QA vehicle.');
  vehicleId = vehicle.data.id;

  const firstPhoto = `${userA.id}/${vehicleId}/cover/${runId}-first.jpg`;
  const nextPhoto = `${userA.id}/${vehicleId}/cover/${runId}-next.jpg`;
  photoPaths.push(firstPhoto, nextPhoto);
  const photoBytes = new Uint8Array([255, 216, 255, 217]);

  const photoUpload = await accountA.storage.from('vehicle-photos').upload(firstPhoto, photoBytes, {
    contentType: 'image/jpeg', upsert: false,
  });
  if (photoUpload.error) throw new Error('Owner photo upload failed.');
  const photoPersist = await accountA.from('vehicles').update({ cover_photo_path: firstPhoto }).eq('id', vehicleId).select('id');
  if (photoPersist.error || photoPersist.data.length !== 1) throw new Error('Owner photo metadata persistence failed.');
  record('Owner photo upload/private view', await objectExists(accountA, 'vehicle-photos', firstPhoto));

  const replacementUpload = await accountA.storage.from('vehicle-photos').upload(nextPhoto, photoBytes, {
    contentType: 'image/jpeg', upsert: false,
  });
  if (replacementUpload.error) throw new Error('Replacement photo upload failed.');
  const replacementPersist = await accountA.from('vehicles').update({ cover_photo_path: nextPhoto }).eq('id', vehicleId).select('id');
  if (replacementPersist.error || replacementPersist.data.length !== 1) throw new Error('Replacement photo metadata persistence failed.');
  const oldPhotoRemoval = await accountA.storage.from('vehicle-photos').remove([firstPhoto]);
  if (oldPhotoRemoval.error) throw new Error('Previous photo removal returned an API error.');
  record('Photo replacement cleanup', !(await objectExists(accountA, 'vehicle-photos', firstPhoto)));

  const firstDocument = `${userA.id}/${vehicleId}/receipt/${runId}-first.pdf`;
  const nextDocument = `${userA.id}/${vehicleId}/receipt/${runId}-next.pdf`;
  documentPaths.push(firstDocument, nextDocument);
  const pdfBytes = new TextEncoder().encode('%PDF-1.4\n%%EOF');

  const documentUpload = await accountA.storage.from('vehicle-documents').upload(firstDocument, pdfBytes, {
    contentType: 'application/pdf', upsert: false,
  });
  if (documentUpload.error) throw new Error('Owner document upload failed.');
  const documentInsert = await accountA.from('documents').insert({
    workspace_id: workspaceA,
    vehicle_id: vehicleId,
    document_type: 'receipt',
    title: `WRNC QA ${runId}`,
    storage_path: firstDocument,
    original_file_name: 'first.pdf',
    mime_type: 'application/pdf',
    file_size: pdfBytes.byteLength,
    uploaded_by: userA.id,
  }).select('id').single();
  if (documentInsert.error || !documentInsert.data) throw new Error('Owner document metadata persistence failed.');
  documentId = documentInsert.data.id;
  record('Owner document upload/private view', await objectExists(accountA, 'vehicle-documents', firstDocument));

  const documentReplacementUpload = await accountA.storage.from('vehicle-documents').upload(nextDocument, pdfBytes, {
    contentType: 'application/pdf', upsert: false,
  });
  if (documentReplacementUpload.error) throw new Error('Replacement document upload failed.');
  const documentReplacementPersist = await accountA.from('documents').update({
    storage_path: nextDocument,
    original_file_name: 'next.pdf',
  }).eq('id', documentId).select('id');
  if (documentReplacementPersist.error || documentReplacementPersist.data.length !== 1) {
    await accountA.storage.from('vehicle-documents').remove([nextDocument]);
    throw new Error('Replacement document metadata was not persisted.');
  }
  const oldDocumentRemoval = await accountA.storage.from('vehicle-documents').remove([firstDocument]);
  if (oldDocumentRemoval.error) throw new Error('Previous document removal returned an API error.');
  record('Document replacement cleanup', !(await objectExists(accountA, 'vehicle-documents', firstDocument)));

  const crossRead = await accountB.from('vehicles').select('id').eq('id', vehicleId);
  expectNoRows(crossRead, 'Cross-user vehicle read');
  const crossUpdate = await accountB.from('vehicles').update({ cover_photo_path: null }).eq('id', vehicleId).select('id');
  expectNoRows(crossUpdate, 'Cross-user vehicle update');
  const crossDocumentUpdate = await accountB.from('documents').update({ title: 'forbidden' }).eq('id', documentId).select('id');
  expectNoRows(crossDocumentUpdate, 'Cross-user document update');
  const crossPhotoRead = await objectExists(accountB, 'vehicle-photos', nextPhoto);
  const crossDocumentRead = await objectExists(accountB, 'vehicle-documents', nextDocument);
  const forbiddenInsert = `${userB.id}/${vehicleId}/cover/${runId}-forbidden.jpg`;
  accountBPaths.push(forbiddenInsert);
  const crossInsert = await accountB.storage.from('vehicle-photos').upload(forbiddenInsert, photoBytes, {
    contentType: 'image/jpeg', upsert: false,
  });
  const crossOverwrite = await accountB.storage.from('vehicle-photos').update(nextPhoto, photoBytes, {
    contentType: 'image/jpeg', upsert: true,
  });
  await accountB.storage.from('vehicle-photos').remove([nextPhoto]);
  const ownerPhotoSurvived = await objectExists(accountA, 'vehicle-photos', nextPhoto);
  record(
    'Account B isolation',
    !crossPhotoRead
      && !crossDocumentRead
      && Boolean(crossInsert.error)
      && Boolean(crossOverwrite.error)
      && ownerPhotoSurvived
  );

  const anonymousPhoto = await objectExists(anonymous, 'vehicle-photos', nextPhoto);
  const anonymousDocument = await objectExists(anonymous, 'vehicle-documents', nextDocument);
  record('Anonymous/private bucket denial', !anonymousPhoto && !anonymousDocument);

  const rollbackPath = `${userA.id}/${vehicleId}/cover/${runId}-rollback.jpg`;
  photoPaths.push(rollbackPath);
  const rollbackUpload = await accountA.storage.from('vehicle-photos').upload(rollbackPath, photoBytes, {
    contentType: 'image/jpeg', upsert: false,
  });
  if (rollbackUpload.error) throw new Error('Rollback test upload failed.');
  const failedPersist = await accountA.from('vehicles').update({ cover_photo_path: rollbackPath })
    .eq('id', randomUUID()).select('id');
  expectNoRows(failedPersist, 'Expected failed replacement metadata persistence');
  await accountA.storage.from('vehicle-photos').remove([rollbackPath]);
  record('Failed-operation rollback/orphan cleanup', !(await objectExists(accountA, 'vehicle-photos', rollbackPath)));

  const detachPhoto = await accountA.from('vehicles').update({ cover_photo_path: null })
    .eq('id', vehicleId).select('cover_photo_path').single();
  if (detachPhoto.error || detachPhoto.data.cover_photo_path !== null) {
    throw new Error('Owner photo metadata cleanup failed.');
  }
  await accountA.storage.from('vehicle-photos').remove([nextPhoto]);
  record('Owner photo deletion/metadata cleanup', !(await objectExists(accountA, 'vehicle-photos', nextPhoto)));

  const archiveDocument = await accountA.from('documents').update({ archived_at: new Date().toISOString() })
    .eq('id', documentId).select('archived_at').single();
  if (archiveDocument.error || !archiveDocument.data.archived_at) {
    throw new Error('Owner document metadata cleanup failed.');
  }
  await accountA.storage.from('vehicle-documents').remove([nextDocument]);
  record('Owner document deletion/metadata cleanup', !(await objectExists(accountA, 'vehicle-documents', nextDocument)));
} catch (error) {
  record('Live QA flow', false, error instanceof Error ? error.message : 'Unknown failure');
} finally {
  await cleanup();
}

const failures = results.filter((result) => !result.pass);
if (failures.length > 0) process.exitCode = 1;
