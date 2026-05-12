import type { Goal } from "@/lib/types";
import { GoalCard } from "./GoalCard";

interface GoalColumnProps {
  title: string;
  goals: Goal[];
  emptyMessage: string;
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
}

export function GoalColumn({
  title,
  goals,
  emptyMessage,
  onComplete,
  onDelete,
}: GoalColumnProps) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold">{title}</h2>
      <div
        aria-live="polite"
        aria-label={title}
        className="flex flex-col gap-3"
      >
        {goals.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground py-8">
            {emptyMessage}
          </p>
        ) : (
          goals.map((goal) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              onComplete={onComplete}
              onDelete={onDelete}
            />
          ))
        )}
      </div>
    </section>
  );
}
