# Quickstart: DoIt — Initial Page Setup

A step-by-step guide to get the DoIt goal tracker running locally from scratch.

## Prerequisites

- Node.js 20.9+ installed
- npm 10+ installed
- Repository cloned and dependencies installed (`npm install`)

---

## Step 1 — Install New Dependencies

```bash
# date-fns for date arithmetic
npm install date-fns

# shadcn/ui — initialise (choose "Default" style, confirm Tailwind v4, App Router)
npx shadcn@latest init

# Add required shadcn components
npx shadcn@latest add button dialog alert-dialog input label checkbox badge card
```

> shadcn copies component source into `components/ui/`. These are editable project files, not a runtime library.

---

## Step 2 — Add Pastel Theme Tokens

In `app/globals.css`, replace the existing `:root` and `@theme` block with:

```css
@import "tailwindcss";

@theme inline {
  --color-background: #faf7ff;
  --color-foreground: #1e1b2e;
  --color-brand-bg: #faf7ff;
  --color-col-active-bg: #f0ebff;
  --color-col-active-border: #c4b5fd;
  --color-col-completed-bg: #ecfdf5;
  --color-col-completed-border: #6ee7b7;
  --color-due-soon-bg: #fff7ed;
  --color-due-soon-border: #fdba74;
  --color-accent: #a78bfa;
  --color-accent-hover: #7c3aed;
  --color-danger: #f87171;
  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);
}

body {
  background: var(--color-brand-bg);
  color: var(--color-foreground);
  font-family: var(--font-sans, Arial, sans-serif);
}
```

---

## Step 3 — Start the Dev Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000). You should see a light lavender page (initially blank until components are implemented).

---

## Step 4 — Validate Layout

After implementation, manually verify:

- [ ] Two columns render side-by-side on a ≥768px viewport
- [ ] Columns stack vertically on a <768px viewport (resize browser or use DevTools)
- [ ] "Add goal" button is visible and opens a modal
- [ ] Adding a goal with title + future end date shows it in the Active column with days remaining
- [ ] A goal with end date within 3 days shows the amber highlight
- [ ] Checking a goal's checkbox moves it to the Completed column
- [ ] Deleting a goal shows "Are you sure?" before removing it
- [ ] Refreshing the page retains all goals (localStorage persistence)
- [ ] The Active column shows an empty-state message when no active goals exist

---

## File Map

| File | Purpose |
|------|---------|
| `app/globals.css` | Tailwind `@theme` pastel tokens |
| `app/layout.tsx` | Root layout — title updated to "DoIt" |
| `app/page.tsx` | Main page shell — two-column layout |
| `components/GoalCard.tsx` | Single goal card |
| `components/GoalColumn.tsx` | Column wrapper |
| `components/AddGoalModal.tsx` | Add goal Dialog |
| `components/ConfirmDeleteDialog.tsx` | Delete AlertDialog |
| `lib/types.ts` | `Goal` type |
| `lib/storage.ts` | localStorage helpers |
| `lib/date-utils.ts` | date-fns wrappers |
| `components/ui/` | shadcn generated components (do not edit) |
