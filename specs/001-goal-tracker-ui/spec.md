# Feature Specification: Initial Page Setup

**Feature Branch**: `001-goal-tracker-ui`
**Created**: 2026-05-11
**Status**: Draft
**Input**: User description: "initial page setup - this application should be a goal tracking web app called 'doit'. There should be two columns - a left one where current goals are shown, along with how many days left the user has to achieve the goal, and a right one where completed goals are. Each goal can be 'checked' using a checkbox, and then either move to the completed column or permanently deleted. To add new goals, a user can click on a button to open a new goal form in a modal (title and end date fields). Goals reaching their end date (within 3 days) are highlighted. Let's use a modern light theme with fun pastel colours."

## Clarifications

### Session 2026-05-12

- Q: What persistence approach should goals use? → A: Browser local storage with client-side hydration.
- Q: Goal deletion confirmation approach? → A: Inline confirmation dialog before deletion.

## User Scenarios *(mandatory)*

### User Story 1 - View Active Goals (Priority: P1)

Users see all current goals in the left column with remaining days displayed, and any goal due within three days is visually highlighted.

**Why this priority**: Provides immediate visibility of active commitments and urgency, enabling users to act before deadlines.

**Independent Value**: Users can understand what is due soon without taking any other action.

**Acceptance Scenarios**:

1. **Given** multiple active goals with varying end dates, **When** the user opens the page, **Then** the left column lists each goal with the number of days remaining.
2. **Given** a goal whose end date is within three days, **When** the page renders, **Then** that goal is highlighted as due soon.

---

### User Story 2 - Add New Goal (Priority: P1)

Users add a new goal by clicking an "Add goal" button that opens a modal with Title and End Date fields; on save, the goal appears in the left column with correct days remaining.

**Why this priority**: Enables creation of new goals, the core action that makes the tracker useful.

**Independent Value**: Users can populate their goal list without completing or deleting any goals.

**Acceptance Scenarios**:

1. **Given** the user clicks "Add goal", **When** the modal opens and they enter a title and end date, **Then** saving closes the modal and the new goal appears in the left column.
2. **Given** the user submits the form without a title or end date, **When** they attempt to save, **Then** they see validation feedback and the goal is not created.

---

### User Story 3 - Complete or Delete Goal (Priority: P2)

Users can check a goal to mark it complete, which moves it to the right column, or choose to permanently delete a goal.

**Why this priority**: Lets users resolve goals and keep the tracker organized.

**Independent Value**: Users can manage lifecycle of goals without needing to add new ones.

**Acceptance Scenarios**:

1. **Given** a goal in the left column, **When** the user checks its box, **Then** it moves to the right column with a completed state.
2. **Given** a goal in either column, **When** the user chooses to delete it, **Then** a confirmation dialog appears asking "Are you sure?"; on confirmation the goal is removed permanently.

---

### Edge Cases

- Goal end date is in the past when created.
- End date earlier than today should be prevented with inline feedback.
- Duplicate goal titles are allowed but should still show distinct entries.
- Long titles should wrap without breaking the layout.
- When all goals are completed, the left column should indicate there are no active goals.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Display current goals in the left column with calculated days remaining, updating daily.
- **FR-002**: Highlight any goal whose end date is within three days with a clear visual cue.
- **FR-003**: Provide an "Add goal" button that opens a modal containing required fields: Title and End Date.
- **FR-004**: Prevent saving a goal without both Title and End Date; End Date must not be earlier than the current date.
- **FR-005**: Provide a checkbox on each goal to mark it complete; completed goals move to the right column.
- **FR-006**: Allow a user to permanently delete a goal from either column with inline confirmation dialog ("Are you sure?") to prevent accidental deletion.
- **FR-007**: Apply a modern light theme using fun pastel colors across both columns, modal, and controls.
- **FR-008**: Persist goals in browser local storage and hydrate on load; updates (add, complete, delete) must immediately sync storage.

### Key Entities *(include if feature involves data)*

- **Goal**: title, end date, status (active/completed), created date, days remaining (derived), due-soon flag (derived).
- **Goal Status View**: two logical collections — Active Goals (left column) and Completed Goals (right column).

## Success Criteria *(mandatory)*

- **SC-001**: 90% of first-time users can add a goal and see it in the left column within 10 seconds.
- **SC-002**: 100% of goals with end dates within three days display a due-soon highlight on page load or refresh.
- **SC-003**: Marking a goal complete updates both columns in under 1 second from user action.
- **SC-004**: Deleting a goal removes it immediately with confirmation feedb ack and no lingering entries.
- **SC-005**: Users can distinguish active vs completed goals at a glance, with no more than 1 user-reported confusion per usability session.

## Assumptions

- Single-user experience; multi-user collaboration is out of scope.
- Dates use the user's local timezone; no cross-timezone adjustment required.
- Goals persist between sessions via browser local storage; no server storage is used.
- Accessibility baseline: keyboard navigation and visible focus states for buttons, checkboxes, and modal controls.
- Past due goals remain visible unless completed or deleted.
