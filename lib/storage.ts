import type { Goal } from "./types";

export const STORAGE_KEY = "doit:goals";

/** Back-fills `sortOrder` on goals loaded from storage before the field existed. */
function migrateGoals(goals: Goal[]): Goal[] {
  return goals.map((g, i) =>
    g.sortOrder === undefined ? { ...g, sortOrder: i * 1000 } : g
  );
}

export function loadGoals(): Goal[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const goals = raw ? (JSON.parse(raw) as Goal[]) : [];
    return migrateGoals(goals);
  } catch {
    return [];
  }
}

/** Throws if localStorage write fails (e.g. QuotaExceededError). */
export function saveGoals(goals: Goal[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(goals));
}
