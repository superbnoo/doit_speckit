# Tasks: Goal Drag-and-Drop Reordering

**Input**: Design documents from `specs/002-goal-drag-reorder/`  
**Prerequisites**: plan.md ✅ spec.md ✅ research.md ✅ data-model.md ✅ quickstart.md ✅

**No Testing**: Constitution prohibits all forms of automated testing. No test tasks included.

**Organization**: Tasks grouped by user story to enable independent implementation and validation of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no shared dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3)
- Exact file paths included in every description

---

## Phase 1: Setup

**Purpose**: Install the new drag-and-drop library. All other phases depend on this.

- [ ] T001 Install `@dnd-kit/core`, `@dnd-kit/sortable`, and `@dnd-kit/utilities` via npm in the project root

**Checkpoint**: `package.json` shows `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities` in dependencies; `node_modules/@dnd-kit/` exists.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Type, storage, and state changes that every user story depends on. No user story work can begin until all three tasks in this phase are complete.

**⚠️ CRITICAL**: US1, US2, and US3 all depend on this phase completing first.

- [ ] T002 Add `sortOrder: number` field to the `Goal` interface in `lib/types.ts`
- [ ] T003 [P] Add `migrateGoals(goals: Goal[]): Goal[]` helper to `lib/storage.ts` that back-fills `sortOrder` (value = `index * 1000`) on any goal missing the field; call `migrateGoals` inside `loadGoals()` before returning the array
- [ ] T004 Update `lib/useGoals.ts`: (a) set `sortOrder` on new goals in `addGoal` as `max(existing sortOrders) + 1` (or `0` if list is empty); (b) add `reorderGoals(orderedIds: string[]) => void` action that re-maps active goals into the given order with normalized `sortOrder` values `0, 1, 2, …`, merges with completed goals, and calls `saveGoals`

**Checkpoint**: Foundation ready. The `Goal` type has `sortOrder`, `loadGoals` migrates legacy data, and `useGoals` exposes `reorderGoals`.

---

## Phase 3: User Story 1 — Reorder Goals by Dragging (Priority: P1) 🎯 MVP

**Goal**: Active goals have a visible grip handle; users can drag a goal and drop it above or below any other active goal; the list updates immediately in the correct new order.

**Independent Validation**: Add 3+ goals → drag one by its grip handle to a new position → list re-renders in the correct new order without a page reload.

### Implementation

- [ ] T005 [P] [US1] Create `components/DragHandle.tsx`: render a `<button>` element containing the `GripVertical` icon from `lucide-react`; the component accepts and spreads arbitrary HTML button props (for dnd-kit's `attributes` and `listeners`); apply `cursor-grab active:cursor-grabbing` and a `44px` minimum touch-target size with Tailwind classes; include `aria-label="Drag to reorder"`
- [ ] T006 [US1] Modify `components/GoalCard.tsx`: add an optional `dragHandleProps?: React.HTMLAttributes<HTMLButtonElement>` prop; when present, render `<DragHandle {...dragHandleProps} />` as the first child inside `CardContent` before the existing checkbox; import `DragHandle` from `./DragHandle`
- [ ] T007 [US1] Create `components/SortableGoalList.tsx`: (a) define an internal `SortableGoalCard` component that calls `useSortable(goal.id)` and passes `{ ...attributes, ...listeners }` as `dragHandleProps` to `GoalCard`; (b) export `SortableGoalList` which wraps the list in `DndContext` with a `PointerSensor` configured with an activation constraint of `{ distance: 8 }` (prevents accidental drag on touch scroll), wraps items in `SortableContext` with `verticalListSortingStrategy`, maps goals to `SortableGoalCard`, and calls `onReorder` with the result of `arrayMove` inside `onDragEnd`; import all dnd-kit primitives from `@dnd-kit/core`, `@dnd-kit/sortable`
- [ ] T008 [US1] Modify `components/GoalColumn.tsx`: add optional `onReorder?: (orderedIds: string[]) => void` prop; when `onReorder` is provided and `goals.length > 0`, render `SortableGoalList` instead of the plain `goals.map(...)` block, passing `goals`, `onReorder`, `onComplete`, and `onDelete`; keep the empty-state message unchanged
- [ ] T009 [US1] Modify `app/page.tsx`: change the `activeGoals` sort to use `sortOrder` ascending (`a.sortOrder - b.sortOrder`); pass `onReorder={reorderGoals}` to the active `GoalColumn`; leave the completed column unchanged

**Checkpoint**: Drag a goal by its grip handle to a different position in the active list → list reorders immediately. Completed column is unaffected. Single-goal list shows a handle but dragging has no effect.

---

## Phase 4: User Story 2 — Visual Drop Indicator During Drag (Priority: P2)

**Goal**: While dragging, a ghost of the card follows the pointer; the target position is marked with a visible insertion line above the goal it will land before. Cancelling (Escape or out-of-bounds drop) removes all indicators and restores the original order.

**Independent Validation**: Drag a goal → observe a full-opacity ghost at the pointer and a coloured top-border insertion line on the target card updating in real time → cancel by pressing Escape → all indicators disappear, list is unchanged.

### Implementation

- [ ] T010 [US2] Extend `components/SortableGoalList.tsx`: add `activeId: string | null` state; wire `onDragStart` to set `activeId` and `onDragEnd`/`onDragCancel` to clear it; add a `DragOverlay` (imported from `@dnd-kit/core`) after `SortableContext` that renders a plain `GoalCard` (no handle props, full opacity) for the active goal when `activeId` is set
- [ ] T011 [US2] Extend the `SortableGoalCard` wrapper inside `SortableGoalList.tsx`: read `isOver` and `isDragging` from `useSortable`; pass both as optional props down to `GoalCard` (`isOver?: boolean`, `isDragging?: boolean`)
- [ ] T012 [US2] Update `components/GoalCard.tsx`: add `isDragging?: boolean` and `isOver?: boolean` to `GoalCardProps`; apply `opacity-40 pointer-events-none` to the `Card` when `isDragging` is true; apply `border-t-2 border-accent` to the `Card` when `isOver` is true (insertion line above the target)

**Checkpoint**: During drag — ghost follows pointer at full opacity; target card shows a top accent border. On Escape or outside drop — all indicators disappear; list order is unchanged.

---

## Phase 5: User Story 3 — Persist Reordered Goal List (Priority: P3)

**Goal**: The new goal order survives page reload and navigation. If localStorage is full, the UI retains the reordered state and shows an inline error banner.

**Independent Validation**: Reorder goals → reload the page → goals appear in the custom order. Fill browser storage quota → reorder → observe inline error message while list shows the intended order.

### Implementation

- [ ] T013 [P] [US3] Update `lib/storage.ts` `saveGoals()`: wrap `localStorage.setItem` in a try/catch; rethrow the caught error so callers can handle it; add a named export `STORAGE_KEY` constant (already used internally — extract it so other modules can reference it if needed)
- [ ] T014 [US3] Update `lib/useGoals.ts`: add `storageError: string | null` state (default `null`); in `reorderGoals`, wrap the `saveGoals` call in try/catch — on failure set `storageError` to a user-facing message (e.g. `"Could not save order — storage is full."`) while keeping the in-memory reordered state; add `clearStorageError: () => void` to the return value; also apply the same try/catch pattern to `addGoal`, `completeGoal`, and `deleteGoal` for consistency
- [ ] T015 [US3] Render an inline error banner in `components/SortableGoalList.tsx`: accept `storageError: string | null` and `onClearError: () => void` props; when `storageError` is non-null, render a dismissible `<div role="alert">` with the error message below the sortable list using Tailwind `bg-destructive/10 border border-destructive text-destructive text-sm rounded p-3`; update `app/page.tsx` and `GoalColumn.tsx` to thread `storageError` and `clearStorageError` from `useGoals` through to `SortableGoalList`

**Checkpoint**: Reload after reorder → correct order is restored from localStorage. Storage-full scenario → inline error visible; list shows intended order; dismissing banner clears error.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Touch-scroll conflict prevention and accessibility improvements across all stories.

- [ ] T016 [P] Verify that the `PointerSensor` activation constraint (`distance: 8`) set in T007 is correctly configured in `components/SortableGoalList.tsx`; on a touch device (or DevTools mobile emulation), confirm vertical page scroll still works when not touching the drag handle — adjust the constraint or add `TouchSensor` from `@dnd-kit/core` if scrolling is blocked
- [ ] T017 [P] Add `aria-live="polite"` and `aria-label="Active goals — drag to reorder"` to the sortable list container in `components/SortableGoalList.tsx`; confirm `DragHandle` has `aria-label="Drag to reorder"` (set in T005); confirm the `DragOverlay` card has `aria-hidden="true"` to avoid duplicate announcements

**Checkpoint**: On a touch device, scrolling the goal list without touching a handle works normally. Screen reader announces "Active goals — drag to reorder" on focus.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies — start immediately
- **Phase 2 (Foundational)**: Depends on Phase 1 — **BLOCKS all user story phases**
- **Phase 3 (US1 — P1)**: Depends on Phase 2 completion
- **Phase 4 (US2 — P2)**: Depends on Phase 3 completion (extends SortableGoalList and GoalCard)
- **Phase 5 (US3 — P3)**: Depends on Phase 2 completion; can overlap with Phase 4
- **Phase 6 (Polish)**: Depends on Phases 3–5 being complete

### User Story Dependencies

- **US1 (P1)**: Depends on Foundational (Phase 2) only — no other story dependency
- **US2 (P2)**: Depends on US1 (extends components created in US1)
- **US3 (P3)**: Depends on Foundational (Phase 2); can be implemented in parallel with US2 (different files)

### Within Each Phase

- T002 → T003 [P can start alongside T002] → T004 (depends on T002 + T003)
- T005 [P] → T006 → T007 → T008 → T009
- T010 → T011 → T012
- T013 [P] → T014 → T015
- T016 [P], T017 [P] — fully independent polish tasks

### Parallel Opportunities

| Parallel Group | Tasks |
|---|---|
| Foundational | T002 + T003 (different files) |
| US1 entry point | T005 (DragHandle, independent new file) |
| US3 + US2 Phase overlap | T013 (storage) while T010/T011 work on SortableGoalList |
| Polish | T016 + T017 (independent files and concerns) |

---

## Parallel Example: Phase 3 (US1)

```text
# Step 1 — can start together:
Task T005: "Create components/DragHandle.tsx with GripVertical icon and drag props"

# Step 2 — after T005:
Task T006: "Modify components/GoalCard.tsx to accept and render DragHandle"

# Step 3 — after T005 + T006:
Task T007: "Create components/SortableGoalList.tsx with full DnD wiring"

# Step 4 — after T007:
Task T008: "Modify components/GoalColumn.tsx to support onReorder"

# Step 5 — after T004 + T008:
Task T009: "Modify app/page.tsx to sort by sortOrder and wire onReorder"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Install packages (T001)
2. Complete Phase 2: Foundational type + storage + hook changes (T002–T004)
3. Complete Phase 3: Drag to reorder — core interaction (T005–T009)
4. **STOP and VALIDATE**: Drag goals to new positions; confirm list reorders correctly
5. Demo / ship if ready

### Incremental Delivery

1. Phase 1 + Phase 2 → Foundation ready
2. Phase 3 (US1) → Drag reorder works → **MVP**
3. Phase 4 (US2) → Visual drop indicator added
4. Phase 5 (US3) → Persist + error handling added
5. Phase 6 (Polish) → Touch scroll safety + accessibility

---

## Notes

- No test tasks — constitution principle V prohibits all automated testing
- [P] = can run in parallel with other [P] tasks in the same phase (different files, no blocking dependency)
- [Story] label maps each task to its user story for traceability
- `arrayMove` from `@dnd-kit/sortable` handles the index swap in `onDragEnd` — no manual splice needed
- `DragOverlay` must be rendered inside `DndContext` but outside `SortableContext`
- Commit after each phase checkpoint before moving to the next phase
