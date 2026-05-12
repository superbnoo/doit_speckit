# Research: Goal Drag-and-Drop Reordering

**Branch**: `002-goal-drag-reorder` | **Date**: 2026-05-12

## Decision Log

### D-001: Drag-and-Drop Library

**Decision**: `@dnd-kit/core@6.3.1` + `@dnd-kit/sortable@10.0.0` + `@dnd-kit/utilities@3.2.2`

**Rationale**:
- User specified "the sortable library" — `@dnd-kit/sortable` is the standard React sortable library
- v10.0.0 peer-deps: `@dnd-kit/core ^6.3.0` and `react >=16.8.0` — both satisfied by the existing project
- React 19 compatibility confirmed: GitHub issue #1511 closed Feb 2026 by maintainer; v10.0.0 released Dec 2024 resolves JSX type errors
- Pointer Events sensor handles both mouse and touch natively — satisfies FR-007 without additional packages

**Alternatives considered**:
- Native HTML5 drag-and-drop API: no touch support without significant extra code; ruled out (spec assumption was revisited by user direction to use the sortable library)
- `react-beautiful-dnd`: officially deprecated, not maintained for React 18+; ruled out
- `@hello-pangea/dnd`: fork of RBD, active but heavier API surface; ruled out in favour of dnd-kit

---

### D-002: Drag Scope

**Decision**: Drag-and-drop reordering applies to **active goals only**. Completed goals are not draggable.

**Rationale**:
- Completed goals are shown in reverse completion-time order (most recently completed first), which is a meaningful and expected display order. Allowing manual reorder of completed goals would conflict with this convention and add no user value.
- The spec describes reordering "goals in the list" — interpreted as the active goal list, the primary user workspace.
- Simplifies the implementation significantly (one DnD context, one sortable list).

**Alternatives considered**:
- Drag in both columns: more complex, no clear user need for completed column; ruled out

---

### D-003: sortOrder Field Strategy

**Decision**: Add `sortOrder: number` to the `Goal` type. Use a **sparse integer** (index × 1000 at creation time). Normalize back to sequential on each reorder.

**Rationale**:
- Sparse values allow future insertion without renumbering all goals
- Normalizing on reorder (0, 1, 2, …) keeps values predictable and small in storage
- Backward-compatible: existing stored goals without `sortOrder` are assigned values at load time based on their current array position

**Migration strategy**: In `loadGoals()` (or a dedicated `migrateGoals()` helper), any goal missing `sortOrder` receives `index * 1000` based on its current position in the stored array (which currently reflects `createdAt` order).

---

### D-004: Drag Handle Affordance

**Decision**: Use `GripVertical` icon from `lucide-react` (already installed) as the drag handle. Handle is always visible on each active goal card.

**Rationale**:
- FR-009 requires visible drag affordance for discoverability
- `lucide-react` is already a project dependency — zero additional cost
- Always-visible handle is more discoverable than hover-only
- `useSortable`'s `attributes` + `listeners` are bound to the handle element, not the whole card, to avoid interfering with the checkbox and delete button interactions

---

### D-005: Visual Drop Indicator

**Decision**: Use a combination of `DragOverlay` (ghost of the dragged card) and a CSS-based insertion line on the target card using `isOver` state from `useSortable`.

**Rationale**:
- `DragOverlay` renders the dragged card at pointer position (ghost), confirming what is being moved
- Insertion line (a coloured top or bottom border) on the over-target card shows exactly where the drop will land
- Both are achievable with Tailwind utility classes and dnd-kit built-in state — no extra library needed

---

### D-006: Save Timing

**Decision**: Write to localStorage immediately in the `onDragEnd` handler, synchronously after computing the new array order.

**Rationale**: Clarification Q3 resolved this — immediate save after each drop. localStorage writes are synchronous and fast (<1ms); no debounce needed.

---

### D-007: Error Handling for Storage Write

**Decision**: Wrap `localStorage.setItem` in a try/catch. On failure, keep the in-memory reordered state and show a toast-style error message.

**Rationale**: FR-008 requires user notification on save failure. No existing toast component — a simple inline error banner is sufficient and avoids a new dependency.
