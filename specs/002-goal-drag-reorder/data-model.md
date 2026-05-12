# Data Model: Goal Drag-and-Drop Reordering

**Branch**: `002-goal-drag-reorder` | **Date**: 2026-05-12

## Entities

### Goal (updated)

The existing `Goal` type gains one new field:

| Field | Type | Description | Changed |
|---|---|---|---|
| `id` | `string` (UUID) | Unique identifier | No |
| `title` | `string` | User-provided label | No |
| `endDate` | `string` (ISO-8601 date) | Target completion date | No |
| `status` | `"active" \| "completed"` | Lifecycle state | No |
| `createdAt` | `string` (ISO-8601 datetime) | Creation timestamp; immutable | No |
| `sortOrder` | `number` | Manual sort position within the active list | **New** |

#### Constraints

- `sortOrder` is only meaningful for active goals. Completed goals are sorted by `createdAt` descending (existing behaviour unchanged).
- `sortOrder` values are non-negative integers.
- After each reorder, values are normalized to `0, 1, 2, …` (sequential).
- `sortOrder` is set at goal creation time to `max(existing sortOrders) + 1` so new goals always appear at the bottom of the active list.

#### Backward Compatibility (Migration)

Goals loaded from localStorage that lack `sortOrder` are migrated in `loadGoals()`:

```
sortOrder = arrayIndex * 1000
```

This preserves the existing creation-time order and produces a stable migration without overwriting the stored data until the next user action (reorder or new goal creation).

---

## Storage

### Key: `doit:goals`

- **Location**: `localStorage` (browser, device-specific)
- **Format**: JSON array of `Goal` objects
- **Serialized shape example**:

```json
[
  {
    "id": "abc-123",
    "title": "Learn TypeScript",
    "endDate": "2026-06-01",
    "status": "active",
    "createdAt": "2026-05-01T09:00:00.000Z",
    "sortOrder": 0
  },
  {
    "id": "def-456",
    "title": "Ship feature 002",
    "endDate": "2026-05-20",
    "status": "active",
    "createdAt": "2026-05-02T10:00:00.000Z",
    "sortOrder": 1
  }
]
```

- **Read**: On component mount via `loadGoals()` → migrates missing `sortOrder` fields.
- **Write**: On every mutation (add, complete, delete, reorder) via `saveGoals(goals)`.
- **Failure mode**: `localStorage.setItem` throws `DOMException` (QuotaExceededError) on storage full. Caught and surfaced to the user; in-memory state is preserved.

---

## State Shape (in-memory)

`useGoals` hook manages the canonical in-memory array. After this feature:

```typescript
// In useGoals, existing + new
{
  goals: Goal[],           // full list, both active and completed
  addGoal: (title: string, endDate: string) => void,
  completeGoal: (id: string) => void,
  deleteGoal: (id: string) => void,
  reorderGoals: (orderedIds: string[]) => void   // NEW
}
```

`reorderGoals` receives the new ordered array of active goal IDs from `onDragEnd`, re-sorts the active goals in that order (assigning normalized `sortOrder` values 0, 1, 2, …), merges back with completed goals, and calls `saveGoals`.

---

## Sorting Rules

| Column | Sort By | Direction | Draggable |
|---|---|---|---|
| Active Goals | `sortOrder` | Ascending | Yes |
| Completed Goals | `createdAt` | Descending | No |
