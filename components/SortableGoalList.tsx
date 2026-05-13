"use client";

import { useState } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GoalCard } from "./GoalCard";
import type { Goal } from "@/lib/types";

interface SortableGoalListProps {
  goals: Goal[];
  onReorder: (orderedIds: string[]) => void;
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
  storageError: string | null;
  onClearError: () => void;
}

interface SortableGoalCardProps {
  goal: Goal;
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
}

function SortableGoalCard({ goal, onComplete, onDelete }: SortableGoalCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
    isOver,
  } = useSortable({ id: goal.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <GoalCard
        goal={goal}
        onComplete={onComplete}
        onDelete={onDelete}
        dragHandleProps={{ ...attributes, ...listeners }}
        isDragging={isDragging}
        isOver={isOver}
      />
    </div>
  );
}

export function SortableGoalList({
  goals,
  onReorder,
  onComplete,
  onDelete,
  storageError,
  onClearError,
}: SortableGoalListProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  const activeGoal = activeId ? goals.find((g) => g.id === activeId) : null;

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as string);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveId(null);
    if (!over || active.id === over.id) return;
    const oldIndex = goals.findIndex((g) => g.id === active.id);
    const newIndex = goals.findIndex((g) => g.id === over.id);
    const reordered = arrayMove(goals, oldIndex, newIndex);
    onReorder(reordered.map((g) => g.id));
  }

  function handleDragCancel() {
    setActiveId(null);
  }

  return (
    <div>
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <SortableContext
          items={goals.map((g) => g.id)}
          strategy={verticalListSortingStrategy}
        >
          <div
            className="flex flex-col gap-3"
            aria-label="Active goals — drag to reorder"
            aria-live="polite"
          >
            {goals.map((goal) => (
              <SortableGoalCard
                key={goal.id}
                goal={goal}
                onComplete={onComplete}
                onDelete={onDelete}
              />
            ))}
          </div>
        </SortableContext>

        <DragOverlay>
          {activeGoal ? (
            <div aria-hidden="true" className="opacity-90 shadow-lg">
              <GoalCard
                goal={activeGoal}
                onComplete={onComplete}
                onDelete={onDelete}
              />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {storageError && (
        <div
          role="alert"
          className="mt-3 flex items-center justify-between gap-2 rounded border border-destructive bg-destructive/10 p-3 text-sm text-destructive"
        >
          <span>{storageError}</span>
          <button
            type="button"
            onClick={onClearError}
            className="shrink-0 font-medium underline-offset-2 hover:underline"
            aria-label="Dismiss error"
          >
            Dismiss
          </button>
        </div>
      )}
    </div>
  );
}
