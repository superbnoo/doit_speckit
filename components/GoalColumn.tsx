import type { Goal } from "@/lib/types";
import { GoalCard } from "./GoalCard";
import { SortableGoalList } from "./SortableGoalList";

interface GoalColumnProps {
  title: string;
  goals: Goal[];
  emptyMessage: string;
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onReorder?: (orderedIds: string[]) => void;
  storageError?: string | null;
  onClearError?: () => void;
}

export function GoalColumn({
  title,
  goals,
  emptyMessage,
  onComplete,
  onDelete,
  onReorder,
  storageError,
  onClearError,
}: GoalColumnProps) {
  const isEmpty = goals.length === 0;

  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold">{title}</h2>

      {isEmpty ? (
        <p className="text-center text-sm text-muted-foreground py-8">
          {emptyMessage}
        </p>
      ) : onReorder ? (
        <SortableGoalList
          goals={goals}
          onReorder={onReorder}
          onComplete={onComplete}
          onDelete={onDelete}
          storageError={storageError ?? null}
          onClearError={onClearError ?? (() => {})}
        />
      ) : (
        <div
          aria-live="polite"
          aria-label={title}
          className="flex flex-col gap-3"
        >
          {goals.map((goal) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              onComplete={onComplete}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </section>
  );
}
