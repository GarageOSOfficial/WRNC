# Vehicle CRUD Architecture

> Engineering reference for the Vehicle CRUD implementation (WRNC-001).
> Updated after post-PR #6 engineering quality pass.

---

## Overview

The Vehicle CRUD stack follows a strict three-layer architecture:

```
Screen / Component
      ↓
React Query hook  (hooks/useVehicle.ts)
      ↓
Service function  (services/api/vehicles.ts)
      ↓
Supabase client   (lib/supabase.ts)
```

No component imports Supabase directly. No service function imports React Query. Each layer has a single responsibility.

---

## Data Flow

### Read

```
useVehicles(workspaceId)
  → useQuery({ queryKey: vehicleKeys.list(workspaceId) })
  → listVehicles(workspaceId)
  → supabase.from('vehicles').select('*').eq('workspace_id', ...).order(...).is('archived_at', null)
```

```
useVehicle(vehicleId)
  → useQuery({ queryKey: vehicleKeys.detail(vehicleId) })
  → getVehicle(vehicleId)
  → supabase.from('vehicles').select('*').eq('id', ...).single()
```

### Write

```
useCreateVehicle().mutate(input)
  → createVehicle(input)           ← validates input first
  → supabase.from('vehicles').insert(...)
  → onSuccess: invalidate vehicleKeys.list(workspaceId)

useUpdateVehicle().mutate({ id, input })
  → updateVehicle(id, input)       ← validates changed fields
  → supabase.from('vehicles').update(...).eq('id', ...)
  → onSuccess: invalidate vehicleKeys.detail(id) + vehicleKeys.list(workspaceId)

useArchiveVehicle().mutate(id)
  → archiveVehicle(id)             ← sets archived_at = now()
  → supabase.from('vehicles').update({ archived_at: ... }).eq('id', ...)
  → onSuccess: invalidate vehicleKeys.detail(id) + vehicleKeys.list(workspaceId)

useRestoreVehicle().mutate(id)
  → restoreVehicle(id)             ← sets archived_at = null
  → supabase.from('vehicles').update({ archived_at: null }).eq('id', ...)
  → onSuccess: invalidate vehicleKeys.detail(id) + vehicleKeys.list(workspaceId)
```

---

## React Query Cache Keys

Defined in `hooks/useVehicle.ts` as `vehicleKeys`:

| Key | Shape | Used by |
|---|---|---|
| `vehicleKeys.all` | `['vehicles']` | Broad invalidation |
| `vehicleKeys.lists()` | `['vehicles', 'list']` | Invalidate all lists |
| `vehicleKeys.list(workspaceId, opts?)` | `['vehicles', 'list', workspaceId, opts]` | Per-workspace list query |
| `vehicleKeys.details()` | `['vehicles', 'detail']` | Invalidate all details |
| `vehicleKeys.detail(vehicleId)` | `['vehicles', 'detail', vehicleId]` | Per-vehicle detail query |

**Invalidation policy:**
- `create` → invalidates `list` (new item appears)
- `update` → invalidates `detail` + `list` (item changes in both views)
- `archive` → invalidates `detail` + `list` (item disappears from default list)
- `restore` → invalidates `detail` + `list` (item reappears in default list)

---

## Validation Flow

Validation lives in `utils/validators.ts` and is called at the service layer, not only in UI components.

```
validateVehicleInput(input) → ValidationResult { valid, errors }
```

**Rules (WRNC-001 acceptance criteria):**

| Field | Rule |
|---|---|
| `year` | Required. Integer. Between 1900 and `currentYear + 1`. |
| `make` | Required. Non-empty after trim. |
| `model` | Required. Non-empty after trim. |
| `vin` | Optional. If provided: exactly 17 characters, chars `[A-HJ-NPR-Z0-9]` only (I, O, Q excluded per ISO 3779). |
| `mileage` | Optional. If provided: must be ≥ 0. No upper bound. |

`createVehicle` runs the full validator and throws on any error.  
`updateVehicle` validates only the fields present in the patch, using the same rules and error messages.

---

## Archival Model

Vehicles are never deleted. Archive is a soft-delete via `archived_at` timestamp.

| State | `archived_at` | Visible in default list |
|---|---|---|
| Active | `null` | Yes |
| Archived | ISO timestamp | No |

`listVehicles()` filters out archived vehicles by default. Pass `{ includeArchived: true }` to include them.

---

## Testing Approach

### Service layer (`__tests__/services/vehicles.test.ts`)
- Supabase client is mocked at the module boundary (`jest.mock('../../lib/supabase')`)
- Each Supabase chain method (`select`, `eq`, `order`, `is`, `single`) is a separate `jest.fn()` that returns the next link in the chain
- Happy path: assert the returned domain object (camelCase `Vehicle`) is correctly mapped from the DB row (snake_case)
- Failure path: mock `{ data: null, error: { message: '...' } }` and assert the service throws

### Validation (`__tests__/services/vehicles.test.ts`)
- Pure function tests — no mocks needed
- Cover: missing required fields, boundary years (1899, 1900, currentYear+1, currentYear+2), float years, VIN length, VIN characters, negative/zero/large mileage, whitespace-only strings

### Hooks (`__tests__/hooks/useVehicle.test.tsx`)
- Service functions are mocked at the module boundary (`jest.mock('../../services/api/vehicles')`)
- Each test creates a fresh `QueryClient` with retries disabled
- `renderHook` from `@testing-library/react-native` wraps the hook in `QueryClientProvider`
- `jest.spyOn(queryClient, 'invalidateQueries')` verifies the correct cache keys are invalidated on mutation success

### Component (`__tests__/components/VehicleDetailsForm.test.tsx`)
- Rendered via `@testing-library/react-native`
- `getByLabelText` verifies all inputs have `accessibilityLabel` (set by the shared `Input` primitive)
- Loading state: `isSubmitting=true` hides the Save label (replaced by `ActivityIndicator`) and disables Cancel
- Error state: mutating required fields to empty then pressing Save asserts inline error text appears
- Cancel: asserts `onCancel` is called; asserts `onCancel` is NOT called when `isSubmitting=true`
