# Quickstart: Goal Drag-and-Drop Reordering

**Branch**: `002-goal-drag-reorder` | **Date**: 2026-05-12

## Prerequisites

- Node.js installed, `npm install` already run
- Existing feature 001 (goal tracker UI) code in place

## Install New Dependencies

```bash
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
```

Expected additions to `package.json` dependencies:
- `@dnd-kit/core` — 6.3.1
- `@dnd-kit/sortable` — 10.0.0
- `@dnd-kit/utilities` — 3.2.2

## Files to Create

| File | Purpose |
|---|---|
| `components/SortableGoalList.tsx` | DnD context + sortable list for active goals |
| `components/DragHandle.tsx` | Reusable grip icon affordance |

## Files to Modify

| File | Change Summary |
|---|---|
| `lib/types.ts` | Add `sortOrder: number` to `Goal` |
| `lib/storage.ts` | Add `migrateGoals()` helper to back-fill `sortOrder` on load |
| `lib/useGoals.ts` | Add `reorderGoals(orderedIds: string[])` action; set `sortOrder` on `addGoal` |
| `components/GoalCard.tsx` | Accept optional `dragHandleProps` to attach drag handle listeners |
| `components/GoalColumn.tsx` | Accept optional `onReorder` prop; delegate to `SortableGoalList` when provided |
| `app/page.tsx` | Pass `onReorder={reorderGoals}` to the active goals column |

## Dev Server

```bash
npm run dev
```

Open `http://localhost:3000`. Active goals should have a grip handle on the left. Drag to reorder.

## Verifying the Feature

1. Add 3+ goals via "Add Goal"
2. Drag a goal by its grip handle to a new position — list updates immediately
3. Reload the page — confirm order is preserved
4. On a touch device (or DevTools mobile emulation), drag by touch — confirm it works
5. Begin a drag, press Escape — confirm list reverts to pre-drag order
6. Drag and release outside the list — confirm list reverts to pre-drag order
