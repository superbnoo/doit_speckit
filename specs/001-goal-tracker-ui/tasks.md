---
description: "Task list for DoIt — Initial Page Setup"
---

# Tasks: DoIt — Initial Page Setup

**Input**: Design documents from `specs/001-goal-tracker-ui/`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/ui-contracts.md ✅

**No Testing**: Per constitution Principle V, no test tasks are included.

**Organization**: Tasks are grouped by user story to enable independent implementation of each story.

## Format: `[ID] [P?] [Story?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: User story this task belongs to (US1, US2, US3)
- Exact file paths are included in each description

## Path Conventions

- All paths are relative to repository root
- `app/` — Next.js App Router pages and global styles
- `components/` — Shared React components
- `lib/` — Domain logic, types, storage, utilities
- `components/ui/` — shadcn generated files (do not manually edit)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Install dependencies and generate shadcn component scaffolding

- [ ] T001 Install date-fns dependency: `npm install date-fns`
- [ ] T002 Initialise shadcn/ui: run `npx shadcn@latest init`, selecting Next.js App Router and Tailwind v4 style when prompted
- [ ] T003 Add required shadcn components: run `npx shadcn@latest add button dialog alert-dialog input label checkbox badge card`

**Checkpoint**: `node_modules/date-fns` exists; `components/ui/` contains button.tsx, dialog.tsx, alert-dialog.tsx, input.tsx, label.tsx, checkbox.tsx, badge.tsx, card.tsx

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core types, storage, date utilities, and global styles that every user story depends on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T004 [P] Define `GoalStatus` union type and `Goal` interface per data-model.md in `lib/types.ts`
- [ ] T005 [P] Implement `loadGoals` and `saveGoals` localStorage helpers with SSR guard (`typeof window === 'undefined'`) and `doit:goals` key in `lib/storage.ts`
- [ ] T006 [P] Implement `daysRemaining`, `isDueSoon`, `isOverdue`, and `formatEndDate` using date-fns (`differenceInCalendarDays`, `parseISO`, `startOfDay`, `format`) in `lib/date-utils.ts`
- [ ] T007 Replace `app/globals.css` with Tailwind v4 `@theme inline` block containing all 10 pastel brand tokens (`--color-brand-bg`, `--color-col-active-bg`, `--color-col-active-border`, `--color-col-completed-bg`, `--color-col-completed-border`, `--color-due-soon-bg`, `--color-due-soon-border`, `--color-accent`, `--color-accent-hover`, `--color-danger`) per quickstart.md Step 2
- [ ] T008 [P] Update `app/layout.tsx` metadata: set `title` to `"DoIt"` and `description` to `"Track your goals"`

**Checkpoint**: Foundation ready — all lib/ files exist and TypeScript compiles cleanly (`npx tsc --noEmit`)

---

## Phase 3: User Story 1 — View Active Goals (Priority: P1) 🎯 MVP

**Goal**: Render the two-column page shell with active goals displayed, days-remaining badges, and due-soon highlighting — all hydrated from localStorage on load.

**Independent Validation**: Seed `localStorage.setItem('doit:goals', JSON.stringify([...]))` in browser DevTools with one due-soon goal and one normal goal; reload the page and verify left column shows both with correct badges and amber highlight on the due-soon entry.

### Implementation for User Story 1

- [ ] T009 [US1] Implement `useGoals` hook: initialise `goals` state from `loadGoals()` inside `useEffect`; expose `addGoal`, `completeGoal`, `deleteGoal` mutations that each call `saveGoals` after updating state; in `lib/useGoals.ts` (depends on T004, T005)
- [ ] T010 [P] [US1] Implement `GoalCard` component: render shadcn `Card` containing a `Checkbox`, goal title, days-remaining `Badge` (copy per contracts/ui-contracts.md badge table), delete icon button, and `ConfirmDeleteDialog` (stub props for now); apply `bg-due-soon` + amber border when `isDueSoon` or `isOverdue`; apply line-through title when `status === 'completed'`; in `components/GoalCard.tsx` (depends on T004, T006)
- [ ] T011 [P] [US1] Implement `GoalColumn` component: render a labelled section with column heading, a mapped list of `GoalCard` items, and a centred `emptyMessage` when the goals array is empty; in `components/GoalColumn.tsx` (depends on T004)
- [ ] T012 [US1] Update `app/page.tsx`: mark as `'use client'`; call `useGoals`; derive `activeGoals` (status `'active'`, sorted by `createdAt` ascending) and `completedGoals` (status `'completed'`, sorted by `createdAt` descending); render two `GoalColumn` components inside a `grid grid-cols-1 md:grid-cols-2 gap-6` container with `bg-brand-bg` page background; wire stub `onComplete` and `onDelete` as no-ops for now (depends on T007, T008, T009, T010, T011)

**Checkpoint**: Running `npm run dev` shows two columns; seeded goals appear in the left column with correct badges and due-soon amber highlight

---

## Phase 4: User Story 2 — Add New Goal (Priority: P1)

**Goal**: "Add goal" button opens a modal with Title + End Date fields; saving a valid goal appends it to the left column immediately.

**Independent Validation**: Click "Add goal", enter a title and a future date, click Save — goal appears in the Active column with correct days remaining and modal closes. Attempt to save with blank title — inline error appears, modal stays open.

### Implementation for User Story 2

- [ ] T013 [US2] Implement `AddGoalModal` component: use shadcn `Dialog` with `DialogContent`; include `Label` + `Input` for Title and `Label` + `Input type="date" min={today}` for End Date; implement local form state, trim validation, inline error messages below each field, call `onSave(title, endDate)` + `onOpenChange(false)` on valid submit, reset form on close; in `components/AddGoalModal.tsx`
- [ ] T014 [US2] Wire `AddGoalModal` into `app/page.tsx`: add `modalOpen` boolean state; render shadcn `Button` labelled "Add Goal" (styled with `bg-accent` + `hover:bg-accent-hover`) that sets `modalOpen(true)`; render `<AddGoalModal open={modalOpen} onOpenChange={setModalOpen} onSave={(title, endDate) => addGoal(title, endDate)} />`; (depends on T012, T013)

**Checkpoint**: Full add-goal flow works end-to-end; new goal persists after page refresh

---

## Phase 5: User Story 3 — Complete or Delete Goal (Priority: P2)

**Goal**: Checkbox marks a goal complete and moves it to the right column; delete button shows "Are you sure?" before permanently removing the goal.

**Independent Validation**: Check an active goal's checkbox — it moves to the Completed column immediately. Click the delete icon on any goal — confirmation dialog appears; confirm — goal is gone; cancel — goal remains.

### Implementation for User Story 3

- [ ] T015 [P] [US3] Implement `ConfirmDeleteDialog` component: use shadcn `AlertDialog` with `AlertDialogContent`, `AlertDialogHeader`, `AlertDialogTitle` ("Delete goal?"), `AlertDialogDescription` displaying `"Are you sure you want to delete '${goalTitle}'? This cannot be undone."`, `AlertDialogCancel` ("Cancel"), and `AlertDialogAction` ("Delete", styled danger red) calling `onConfirm()`; in `components/ConfirmDeleteDialog.tsx`
- [ ] T016 [US3] Update `GoalCard` in `components/GoalCard.tsx`: add local `deleteDialogOpen` boolean state; render `<ConfirmDeleteDialog>` with `goalTitle={goal.title}` and `onConfirm={() => { onDelete(goal.id); setDeleteDialogOpen(false); }}`; wire `Checkbox` `onCheckedChange` to call `onComplete(goal.id)` when checked; (depends on T010, T015)
- [ ] T017 [US3] Update `app/page.tsx`: replace no-op stubs with real `onComplete={completeGoal}` and `onDelete={deleteGoal}` passed into both `GoalColumn` instances; (depends on T012, T016)

**Checkpoint**: Complete and delete flows both work; completed goals show in right column; deleted goals disappear after confirmation; all changes survive page refresh

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Responsiveness, accessibility, and code quality across all user stories

- [ ] T018 [P] Verify responsive layout in `app/page.tsx`: confirm `grid-cols-1 md:grid-cols-2` produces stacked columns on mobile (< 768 px) and side-by-side on desktop; add `min-h-screen p-6 md:p-10` padding to page container for breathing room
- [ ] T019 [P] Add accessibility attributes across all components: `aria-label` on icon-only delete buttons in `components/GoalCard.tsx`; ensure all shadcn interactive elements retain visible focus rings; add `aria-live="polite"` region to each `GoalColumn` for screen-reader announcements on goal list changes in `components/GoalColumn.tsx`
- [ ] T020 Run `npm run lint` and `npx tsc --noEmit`; fix any ESLint errors and TypeScript strict-mode violations across `app/`, `components/`, and `lib/`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately
- **Foundational (Phase 2)**: Depends on Phase 1 completion (T001–T003)
- **User Story 1 (Phase 3)**: Depends on Phase 2 completion (T004–T008)
- **User Story 2 (Phase 4)**: Depends on Phase 3 completion (T009–T012)
- **User Story 3 (Phase 5)**: Depends on Phase 3 completion (T009–T012); can run alongside Phase 4
- **Polish (Phase 6)**: Depends on all user story phases complete

### Within-Story Dependencies

- T009 → depends on T004, T005
- T010 → depends on T004, T006
- T011 → depends on T004
- T012 → depends on T007, T008, T009, T010, T011
- T013 → no intra-story deps (standalone modal)
- T014 → depends on T012, T013
- T015 → no intra-story deps (standalone dialog)
- T016 → depends on T010, T015
- T017 → depends on T012, T016

### Parallel Opportunities

```bash
# Phase 2 — all four tasks touch different files, run in parallel:
T004: lib/types.ts
T005: lib/storage.ts
T006: lib/date-utils.ts
T008: app/layout.tsx
# T007 (globals.css) touches a shared file — run sequentially after T008 or independently

# Phase 3 — GoalCard and GoalColumn are independent:
T010: components/GoalCard.tsx
T011: components/GoalColumn.tsx
# T009 (useGoals hook) can also run in parallel with T010 and T011

# Phase 5 — ConfirmDeleteDialog is standalone:
T015: components/ConfirmDeleteDialog.tsx  ← can start as soon as Phase 3 is done

# Phase 6 — lint and a11y touches different concerns:
T018: app/page.tsx responsive check
T019: components/ aria attributes
```

---

## Implementation Strategy

### MVP First (User Stories 1 + 2 only)

1. Complete Phase 1: Setup (T001–T003)
2. Complete Phase 2: Foundational (T004–T008)
3. Complete Phase 3: User Story 1 — View Active Goals (T009–T012)
4. Complete Phase 4: User Story 2 — Add New Goal (T013–T014)
5. **STOP and VALIDATE**: seed goals, add a new goal, verify localStorage persistence and due-soon highlight
6. Ship MVP — fully usable goal tracker without complete/delete

### Full Delivery

Continue to Phase 5 (User Story 3) then Phase 6 (Polish) for the complete feature.

---

## Notes

- `[P]` tasks touch different files and have no outstanding dependencies — safe to run in parallel
- `[US#]` label maps each task to its user story for traceability
- No test tasks per constitution Principle V (No Testing supersedes all guidance)
- Commit after each phase or checkpoint for clean history
- shadcn files in `components/ui/` are generated source — do not manually edit; customise via Tailwind tokens in `globals.css` instead
