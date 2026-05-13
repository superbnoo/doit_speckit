"use client";

import { useEffect, useState } from "react";
import type { Goal } from "./types";
import { loadGoals, saveGoals } from "./storage";

export function useGoals() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [storageError, setStorageError] = useState<string | null>(null);

  useEffect(() => {
    // SSR-safe localStorage initialization — intentional setState in effect
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setGoals(loadGoals());
  }, []);

  function clearStorageError(): void {
    setStorageError(null);
  }

  function nextSortOrder(current: Goal[]): number {
    const active = current.filter((g) => g.status === "active");
    if (active.length === 0) return 0;
    return Math.max(...active.map((g) => g.sortOrder)) + 1;
  }

  function addGoal(title: string, endDate: string): void {
    const next: Goal = {
      id: crypto.randomUUID(),
      title: title.trim(),
      endDate,
      status: "active",
      createdAt: new Date().toISOString(),
      sortOrder: nextSortOrder(goals),
    };
    const updated = [...goals, next];
    try {
      saveGoals(updated);
    } catch {
      setStorageError("Could not save goal — storage is full.");
    }
    setGoals(updated);
  }

  function completeGoal(id: string): void {
    const updated = goals.map((g) =>
      g.id === id ? { ...g, status: "completed" as const } : g
    );
    try {
      saveGoals(updated);
    } catch {
      setStorageError("Could not save changes — storage is full.");
    }
    setGoals(updated);
  }

  function deleteGoal(id: string): void {
    const updated = goals.filter((g) => g.id !== id);
    try {
      saveGoals(updated);
    } catch {
      setStorageError("Could not save changes — storage is full.");
    }
    setGoals(updated);
  }

  function reorderGoals(orderedIds: string[]): void {
    const activeMap = new Map(
      goals.filter((g) => g.status === "active").map((g) => [g.id, g])
    );
    const reordered = orderedIds
      .map((id, i) => {
        const g = activeMap.get(id);
        return g ? { ...g, sortOrder: i } : null;
      })
      .filter((g): g is Goal => g !== null);

    const completed = goals.filter((g) => g.status === "completed");
    const updated = [...reordered, ...completed];

    try {
      saveGoals(updated);
    } catch {
      setStorageError("Could not save order — storage is full.");
    }
    setGoals(updated);
  }

  return {
    goals,
    storageError,
    clearStorageError,
    addGoal,
    completeGoal,
    deleteGoal,
    reorderGoals,
  };
}
