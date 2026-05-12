# UI Contracts: DoIt — Initial Page Setup

These contracts define the public interface of each component — their props, emitted events, and observable behaviours. They serve as the authoritative agreement between components and their consumers.

---

## `<GoalCard>`

**File**: `components/GoalCard.tsx`

**Purpose**: Renders a single goal as a card with its title, days-remaining badge, completion checkbox, and delete trigger.

### Props

```typescript
interface GoalCardProps {
  goal: Goal;
  /** Called when the checkbox is toggled to checked state */
  onComplete: (id: string) => void;
  /** Called after the user confirms deletion */
  onDelete: (id: string) => void;
}
```

### Visual States

| Condition | Appearance |
|-----------|------------|
| `isDueSoon(goal.endDate) === true` | Card background `bg-due-soon`, amber border |
| `isOverdue(goal.endDate) === true` | Same due-soon highlight (overdue but not yet completed) |
| `goal.status === 'completed'` | Title has line-through; badge shows "Done"; checkbox disabled/checked |

### Days-Remaining Badge Copy

| `daysRemaining` value | Badge text |
|-----------------------|-----------|
| < 0 | `Overdue` |
| 0 | `Due today` |
| 1 | `1 day left` |
| 2–3 | `N days left` |
| > 3 | `N days left` |

### Behaviour

- Checking the checkbox calls `onComplete(goal.id)` immediately.
- Delete button opens the `<ConfirmDeleteDialog>` inline; on confirmation calls `onDelete(goal.id)`.
- No direct mutation of goal state — all mutations delegated upward.

---

## `<GoalColumn>`

**File**: `components/GoalColumn.tsx`

### Props

```typescript
interface GoalColumnProps {
  title: string;            // Column heading e.g. "Active Goals", "Completed Goals"
  goals: Goal[];
  emptyMessage: string;     // Shown when goals array is empty
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
}
```

### Behaviour

- Renders a list of `<GoalCard>` components.
- When `goals.length === 0`, renders `emptyMessage` centred in the column body.
- Column heading is always visible regardless of empty state.

---

## `<AddGoalModal>`

**File**: `components/AddGoalModal.tsx`

### Props

```typescript
interface AddGoalModalProps {
  /** Controls modal open/closed state */
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Called with validated form data on save */
  onSave: (title: string, endDate: string) => void;
}
```

### Form Fields

| Field | Input type | Validation |
|-------|-----------|------------|
| Title | `<Input type="text">` | Required; non-empty after trim |
| End Date | `<Input type="date">` | Required; value must be >= today (enforced via `min` attribute + runtime check) |

### Behaviour

- On save: validates both fields; if invalid shows inline error text below the offending field; does NOT call `onSave` or close modal.
- On valid save: calls `onSave(title.trim(), endDate)` then `onOpenChange(false)`.
- On cancel / close (X button or outside click): calls `onOpenChange(false)`; form resets to empty.
- Form state is local to the component; resets on every open.

---

## `<ConfirmDeleteDialog>`

**File**: `components/ConfirmDeleteDialog.tsx`

### Props

```typescript
interface ConfirmDeleteDialogProps {
  open: boolean;
  goalTitle: string;        // Shown in dialog body for context
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}
```

### Behaviour

- Uses shadcn `<AlertDialog>` — keyboard-accessible, focus-trapped.
- Body text: `"Are you sure you want to delete '{goalTitle}'? This cannot be undone."`
- "Delete" button: calls `onConfirm()` then `onOpenChange(false)`.
- "Cancel" button: calls `onOpenChange(false)` only.

---

## `useGoals` Hook

**File**: `lib/hooks/useGoals.ts` *(or colocated in `lib/`)*

### Interface

```typescript
interface UseGoalsReturn {
  goals: Goal[];
  addGoal: (title: string, endDate: string) => void;
  completeGoal: (id: string) => void;
  deleteGoal: (id: string) => void;
}

function useGoals(): UseGoalsReturn
```

### Contract

- `goals` is initialised from `localStorage` on first render (via `useEffect`); default is `[]` on server.
- Every mutation immediately persists the updated array to `localStorage`.
- `addGoal` creates a new `Goal` with `status: 'active'`, `id: crypto.randomUUID()`, `createdAt: new Date().toISOString()`.
- `completeGoal` sets `status: 'completed'` on the matching goal by `id`.
- `deleteGoal` removes the goal with the matching `id` permanently.
- Hook is the single source of truth; components never write to storage directly.

---

## Theme Token Contract (`app/globals.css`)

The following `@theme` tokens MUST be defined and MUST NOT be removed without updating all consuming components:

| Token | Role |
|-------|------|
| `--color-brand-bg` | Page background |
| `--color-col-active-bg` | Active column background |
| `--color-col-active-border` | Active column border |
| `--color-col-completed-bg` | Completed column background |
| `--color-col-completed-border` | Completed column border |
| `--color-due-soon-bg` | Due-soon card background |
| `--color-due-soon-border` | Due-soon card border |
| `--color-accent` | Primary action colour |
| `--color-accent-hover` | Primary action hover colour |
| `--color-danger` | Destructive action colour |
