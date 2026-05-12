# Implementation Plan: DoIt — Initial Page Setup

**Branch**: `001-goal-tracker-ui` | **Date**: 2026-05-12 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `specs/001-goal-tracker-ui/spec.md`

## Summary

Build the complete single-page goal tracking UI for the **DoIt** web app. The page presents two responsive columns — Active Goals (left) and Completed Goals (right) — backed entirely by browser `localStorage`. Users add goals via a shadcn Dialog modal, mark them complete via checkbox, and delete them via inline confirmation. Goals due within 3 days receive a pastel amber highlight. All styling uses Tailwind CSS v4 `@theme` tokens and shadcn/ui components; date arithmetic uses `date-fns`.

## Technical Context

**Language/Version**: TypeScript 5 (strict)
**Primary Dependencies**: Next.js 16.2.6, React 19.2.4, Tailwind CSS ^4, shadcn/ui (Dialog, Button, Checkbox, Input, Label, Badge, Card, AlertDialog), date-fns ^4
**Storage**: Browser `localStorage` — key `doit:goals`, JSON-serialised array of Goal objects
**Build System**: npm scripts (`next dev`, `next build`, `next start`, `eslint`)
**Target Platform**: Modern browsers (Chrome 111+, Edge 111+, Firefox 111+, Safari 16.4+); desktop + tablet + mobile
**Project Type**: Single-page Next.js App Router web application
**Performance Goals**: Interaction response < 100 ms; page hydration < 1 s on mid-range mobile
**Constraints**: Offline-capable (no network calls); no server-side data; no testing of any kind
**Scale/Scope**: Single user; up to ~200 goals in localStorage before UX degrades (adequate for personal tracker)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Clean Code | ✅ Pass | Small focused components; strict TypeScript; no logic in JSX |
| II. Simple UX | ✅ Pass | Minimal steps: one button → modal → save; one checkbox → complete |
| III. Responsive Design | ✅ Pass | Two-column desktop → stacked mobile via Tailwind responsive classes |
| IV. Minimal Dependencies | ✅ Pass | shadcn (headless, tree-shaken), date-fns (modular), no additional installs |
| V. No Testing | ✅ Pass | No test files, frameworks, or scripts planned |

All gates pass. Proceeding to Phase 0.

## Project Structure

### Documentation (this feature)

```text
specs/001-goal-tracker-ui/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/
│   └── ui-contracts.md  # Phase 1 output
└── tasks.md             # Phase 2 output (/speckit-tasks)
```

### Source Code (repository root)

```text
app/
├── globals.css          # Tailwind @theme pastel token definitions
├── layout.tsx           # Root layout — metadata, fonts
└── page.tsx             # Main page — two-column layout shell

components/
├── GoalCard.tsx         # Single goal row: title, days badge, checkbox, delete
├── GoalColumn.tsx       # Labelled column wrapper (active / completed)
├── AddGoalModal.tsx     # Dialog with Title + End Date form fields
└── ConfirmDeleteDialog.tsx  # AlertDialog inline confirmation

lib/
├── types.ts             # Goal type definition
├── storage.ts           # localStorage read/write helpers
└── date-utils.ts        # date-fns wrappers (daysRemaining, isDueSoon)
```

**Structure Decision**: Single Next.js App Router project at repo root. No `src/` wrapper — aligns with the scaffolded structure already present (`app/`, `components/` at root). All feature code lives in `components/` and `lib/`; no pages subdirectory needed for a single-route app.

## Complexity Tracking

> No constitution violations — table not required.
