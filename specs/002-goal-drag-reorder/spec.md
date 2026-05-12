# Feature Specification: Goal Drag-and-Drop Reordering

**Feature Branch**: `002-goal-drag-reorder`  
**Created**: 2026-05-12  
**Status**: Draft  
**Input**: User description: "drag and drop - let's make it so that users can reorder goals by dragging and dropping them above and below other goals in the list"

## User Scenarios *(mandatory)*

### User Story 1 - Reorder Goals by Dragging (Priority: P1)

A user looks at their goal list and decides a goal belongs in a different position. They grab the goal, drag it up or down the list, and drop it in the desired spot — either above or below an existing goal. The list immediately reflects the new order.

**Why this priority**: This is the core feature. Without the ability to actually drag and pick a drop position, the feature has no value.

**Independent Value**: Can be fully demonstrated by dragging one goal above another in the list and confirming the new order is shown immediately. Delivers the primary user need of manual ordering.

**Acceptance Scenarios**:

1. **Given** a list of two or more goals, **When** the user drags a goal and drops it above a different goal, **Then** the dragged goal appears directly above that target goal in the updated list.
2. **Given** a list of two or more goals, **When** the user drags a goal and drops it below a different goal, **Then** the dragged goal appears directly below that target goal in the updated list.
3. **Given** a user is dragging a goal, **When** they drop it in its current position (no change), **Then** the list remains unchanged and no unnecessary update is triggered.

---

### User Story 2 - Visual Drop Indicator During Drag (Priority: P2)

As the user drags a goal across the list, a clear visual indicator shows exactly where the goal will land if released — either a highlighted line or zone above or below each target goal. This removes uncertainty about the drop outcome.

**Why this priority**: Without a drop indicator, users cannot confidently predict where the goal will land. This is essential for usability but the basic reordering (P1) still works without it.

**Independent Value**: Can be demonstrated by dragging a goal and observing a visible insertion line or highlight that moves between goals as the drag position changes.

**Acceptance Scenarios**:

1. **Given** a user is actively dragging a goal, **When** they hover it over a position between two existing goals, **Then** a visual indicator (e.g., an insertion line or highlighted drop zone) appears to show where the goal will be placed.
2. **Given** a user is actively dragging a goal, **When** they move the drag position, **Then** the visual indicator updates in real time to reflect the new target drop position.
3. **Given** a user cancels the drag (e.g., presses Escape or releases outside the list), **Then** all visual indicators disappear and the list returns to its original order.

---

### User Story 3 - Persist Reordered Goal List (Priority: P3)

After the user reorders their goals, the new order is saved. When they navigate away and return to the goal list, the goals appear in the order the user set — not back in the original order.

**Why this priority**: Without persistence, users would lose their custom order on every page refresh or navigation, making the feature feel broken. However, the drag interaction itself (P1) still works and delivers immediate in-session value without this.

**Independent Value**: Can be demonstrated by reordering goals, navigating to another page, returning to the goal list, and confirming the custom order is maintained.

**Acceptance Scenarios**:

1. **Given** the user has reordered goals by drag and drop, **When** they reload the page, **Then** the goals appear in the new order they set.
2. **Given** the user has reordered goals, **When** they navigate away to another view and return, **Then** the goal order is preserved.
3. **Given** the persistence operation fails (e.g., network/storage error), **When** the user drops a goal into a new position, **Then** the UI still reflects the intended order locally and the user is informed that saving failed.

---

### Edge Cases

- What happens when there is only one goal in the list? Drag handles should be visible but dragging a single item should have no effect on order.
- What happens if the user drops the goal outside the valid list area? The drag is cancelled and the list reverts to its pre-drag order.
- What happens when local storage write fails (e.g., storage quota exceeded)? The UI retains the user's intended in-session order and displays an error message indicating the order could not be saved.
- What happens on touch devices where drag events differ from mouse events? The interaction must work with touch-based drag equivalents.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Users MUST be able to initiate a drag on any goal item to begin reordering.
- **FR-002**: Users MUST be able to drop a dragged goal above or below any other goal in the list to set its new position.
- **FR-003**: System MUST display a real-time visual indicator during drag that clearly shows the intended insertion point above or below target goals.
- **FR-004**: System MUST update the displayed goal order immediately upon a successful drop, without requiring a page reload.
- **FR-005**: System MUST persist the new goal order to browser local storage immediately after each drop so it survives page refresh and navigation away and back on the same device.
- **FR-006**: System MUST cancel the drag and restore the original order if the user releases outside the valid drop area or presses Escape.
- **FR-007**: System MUST support drag-and-drop reordering on touch devices in addition to mouse-driven interaction.
- **FR-008**: System MUST show an error message to the user if writing to local storage fails (e.g., storage quota exceeded), while retaining the user's intended in-session order.
- **FR-009**: Drag handles or draggable affordances MUST be visually present on each goal item so users can discover the reorder capability.

### Key Entities

- **Goal**: A user-created item with a display label and a sort order position that determines its place in the list.
- **Goal List**: The ordered collection of all goals for the user, sorted by each goal's position value and re-indexed after any reorder operation.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can move any goal to any position in the list in a single drag-and-drop interaction.
- **SC-002**: The goal list reflects the new order within the same interaction — no additional user action (e.g., clicking Save) is required.
- **SC-003**: The custom goal order is preserved correctly after a page reload or navigation within the same browser on the same device, with no regression to the original order.
- **SC-004**: Drag-and-drop reordering works correctly on both mouse-driven and touch-driven interfaces without separate mode switching.
- **SC-005**: Users receive clear feedback when a reorder cannot be saved, with no silent failure.

## Clarifications

### Session 2026-05-12

- Q: Should keyboard-based reordering be supported alongside drag-and-drop? → A: Out of scope for now — drag (mouse) and touch only; keyboard accessibility deferred to a future iteration.
- Q: Where is the goal order persisted? → A: Browser local storage only — no network/backend call; order is device-specific.
- Q: Should saves be immediate after each drop or debounced across rapid reorders? → A: Immediate — each drop triggers a local storage write right away; no debouncing.

## Assumptions

- The goal list already exists and displays multiple goals; this feature adds reorder capability to the existing list UI.
- Goal order is stored in browser local storage on the current device; the order is not synced to a server or shared across devices or browsers.
- Reordering is within a single flat list; nested goals, categories, or groupings are out of scope.
- Native browser drag-and-drop APIs are used as the primary mechanism, in keeping with the Minimal Dependencies principle; no additional drag-and-drop library is introduced unless native APIs are insufficient for the touch requirement.
- All goals are rendered in the visible list; virtual scrolling or infinite scroll for extremely long lists is out of scope.
- Only the currently authenticated user's goals are displayed and reordered; multi-user shared lists are out of scope.
- Keyboard-based reordering is out of scope; the feature supports mouse drag and touch interactions only. Keyboard accessibility for reordering is deferred to a future iteration.
