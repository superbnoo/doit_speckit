"use client";

import { useState } from "react";
import { useGoals } from "@/lib/useGoals";
import { GoalColumn } from "@/components/GoalColumn";
import { AddGoalModal } from "@/components/AddGoalModal";
import { Button } from "@/components/ui/button";

export default function Home() {
  const { goals, addGoal, completeGoal, deleteGoal } = useGoals();
  const [modalOpen, setModalOpen] = useState(false);

  const activeGoals = goals
    .filter((g) => g.status === "active")
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt));

  const completedGoals = goals
    .filter((g) => g.status === "completed")
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  return (
    <main className="min-h-screen bg-brand-bg p-6 md:p-10">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold tracking-tight">DoIt</h1>
          <Button
            className="bg-accent hover:bg-accent-hover text-white"
            onClick={() => setModalOpen(true)}
          >
            Add Goal
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-xl border border-col-active-border bg-col-active-bg p-5">
            <GoalColumn
              title="Active Goals"
              goals={activeGoals}
              emptyMessage="No active goals yet. Add one to get started!"
              onComplete={completeGoal}
              onDelete={deleteGoal}
            />
          </div>
          <div className="rounded-xl border border-col-completed-border bg-col-completed-bg p-5">
            <GoalColumn
              title="Completed Goals"
              goals={completedGoals}
              emptyMessage="No completed goals yet. Keep going!"
              onComplete={completeGoal}
              onDelete={deleteGoal}
            />
          </div>
        </div>
      </div>

      <AddGoalModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onSave={(title, endDate) => addGoal(title, endDate)}
      />
    </main>
  );
}
