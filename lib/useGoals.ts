"use client";

import { useEffect, useState } from "react";
import type { Goal } from "./types";
import { loadGoals, saveGoals } from "./storage";

export function useGoals() {
  const [goals, setGoals] = useState<Goal[]>([]);

  useEffect(() => {
    // SSR-safe localStorage initialization — intentional setState in effect
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setGoals(loadGoals());
  }, []);

  function addGoal(title: string, endDate: string): void {
    const next: Goal = {
      id: crypto.randomUUID(),
      title: title.trim(),
      endDate,
      status: "active",
      createdAt: new Date().toISOString(),
    };
    const updated = [...goals, next];
    saveGoals(updated);
    setGoals(updated);
  }

  function completeGoal(id: string): void {
    const updated = goals.map((g) =>
      g.id === id ? { ...g, status: "completed" as const } : g
    );
    saveGoals(updated);
    setGoals(updated);
  }

  function deleteGoal(id: string): void {
    const updated = goals.filter((g) => g.id !== id);
    saveGoals(updated);
    setGoals(updated);
  }

  return { goals, addGoal, completeGoal, deleteGoal };
}
