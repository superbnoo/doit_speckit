# Research: DoIt — Initial Page Setup

## Tailwind CSS v4 `@theme` Token Pattern

**Decision**: Define all pastel brand colours as `@theme` CSS custom properties in `app/globals.css`. Tailwind v4 reads `@theme` tokens at build time and generates utility classes from them (e.g. `bg-goal-active`, `text-due-soon-fg`). No `tailwind.config.js` needed.

**Rationale**: Tailwind v4 replaces the `theme.extend` config object with in-CSS `@theme` declarations. Using `@theme inline` (as already present in the project's `globals.css`) means generated utilities reference the CSS variable directly, enabling clean colour tokens that remain editable without a config file rebuild.

**Alternatives considered**: Hardcoding colours as arbitrary Tailwind values (`bg-[#f3e8ff]`). Rejected because it scatters design tokens across files and makes palette changes error-prone.

**Pastel palette chosen**:

| Token | Hex | Usage |
|-------|-----|-------|
| `--color-brand-bg` | `#faf7ff` | Page background |
| `--color-col-active-bg` | `#f0ebff` | Active goals column background |
| `--color-col-active-border` | `#c4b5fd` | Active column border |
| `--color-col-completed-bg` | `#ecfdf5` | Completed goals column background |
| `--color-col-completed-border` | `#6ee7b7` | Completed column border |
| `--color-due-soon-bg` | `#fff7ed` | Due-soon goal card background |
| `--color-due-soon-border` | `#fdba74` | Due-soon goal card border |
| `--color-accent` | `#a78bfa` | Primary button / interactive accent |
| `--color-accent-hover` | `#7c3aed` | Hover state for accent |
| `--color-danger` | `#f87171` | Delete / destructive actions |

---

## shadcn/ui with Tailwind v4 and React 19

**Decision**: Use shadcn/ui CLI (`npx shadcn@latest init`) configured for Next.js App Router, Tailwind v4, and React 19. Install only the components actually needed: `button`, `dialog`, `alert-dialog`, `input`, `label`, `checkbox`, `badge`, `card`.

**Rationale**: shadcn/ui v2+ (released mid-2025) has first-class Tailwind v4 support. Components are copied into the project as editable source — zero runtime overhead, fully tree-shaken. The `--style default` option uses CSS variable tokens that integrate cleanly with `@theme`. React 19 compatibility was added in the same release cycle.

**Alternatives considered**:
- Radix UI primitives directly: More control but significantly more boilerplate; contradicts Simple UX principle.
- Headless UI: Tailwind v4 support still experimental at time of writing.

**shadcn components mapping**:

| Component | Used for |
|-----------|----------|
| `Button` | Add Goal button, Save/Cancel in modal, Confirm/Cancel in delete dialog |
| `Dialog` + `DialogContent` | Add Goal modal |
| `AlertDialog` | Inline delete confirmation |
| `Input` | Goal title field in modal |
| `Label` | Form labels in modal |
| `Checkbox` | Mark goal complete |
| `Badge` | Days-remaining pill on each goal card |
| `Card` + `CardContent` | Individual goal card container |

---

## date-fns for Date Arithmetic

**Decision**: Use `date-fns` v4 modular imports (`differenceInCalendarDays`, `format`, `parseISO`, `startOfDay`, `isToday`). Store dates as ISO-8601 strings in localStorage.

**Rationale**: `date-fns` is modular (only imported functions are bundled), well-maintained, has zero dependencies, and works with the user's local timezone without configuration. `differenceInCalendarDays` correctly handles partial-day boundaries (e.g. a goal ending "today" shows 0 days, not negative).

**Alternatives considered**:
- Native `Date` arithmetic: Viable but verbose; day-boundary edge cases require careful handling.
- `dayjs`: Similar size; less widely used in the Next.js/shadcn ecosystem.
- `luxon`: Larger bundle; unnecessary for this use case.

**Key utility functions planned**:

```
daysRemaining(endDateISO: string): number
  → differenceInCalendarDays(parseISO(endDateISO), startOfDay(new Date()))

isDueSoon(endDateISO: string): boolean
  → daysRemaining(endDateISO) <= 3 && daysRemaining(endDateISO) >= 0

formatEndDate(endDateISO: string): string
  → format(parseISO(endDateISO), 'MMM d, yyyy')
```

---

## localStorage Strategy

**Decision**: Single key `doit:goals` stores a JSON array of serialised `Goal` objects. Read on mount via `useEffect`; write synchronously on every mutation (add, toggle complete, delete). No debouncing required at this scale.

**Rationale**: Synchronous writes ensure storage always reflects UI state. The spec requires immediate persistence (FR-008). At up to ~200 small goal objects, serialisation overhead is imperceptible.

**SSR safety**: Next.js App Router renders on the server — `localStorage` is not available server-side. All storage reads MUST be wrapped in `useEffect` or behind a `typeof window !== 'undefined'` guard to prevent hydration errors. A custom `useGoals` hook encapsulates this pattern.

**Alternatives considered**:
- `IndexedDB`: Async, more complex; unjustified for this scale.
- `sessionStorage`: Does not persist across sessions; ruled out by FR-008.
- Cookie-based: Unnecessary complexity; not required for single-user client app.

---

## Responsive Two-Column Layout

**Decision**: Tailwind responsive grid — `grid grid-cols-1 md:grid-cols-2 gap-6` on the main container. On mobile the columns stack vertically (Active on top, Completed below). On tablet/desktop they sit side-by-side.

**Rationale**: Matches Simple UX and Responsive Design principles. No custom CSS required.
