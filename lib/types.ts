export type GoalStatus = "active" | "completed";

export interface Goal {
  /** Unique identifier — crypto.randomUUID() at creation time */
  id: string;
  /** User-provided title. Non-empty string. */
  title: string;
  /**
   * End date as ISO-8601 date string (YYYY-MM-DD).
   * Must be >= today at creation time.
   */
  endDate: string;
  /** Lifecycle status. Toggled by checkbox. Never goes back to 'active' once 'completed'. */
  status: GoalStatus;
  /**
   * Creation timestamp as ISO-8601 string.
   * Set once at creation; never mutated.
   * Used for stable insertion-order sorting within a column.
   */
  createdAt: string;
  /**
   * Manual sort position within the active goals list.
   * Normalized to 0, 1, 2, … after each reorder.
   * Legacy goals without this field are migrated in loadGoals().
   */
  sortOrder: number;
}
