"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ConfirmDeleteDialog } from "./ConfirmDeleteDialog";
import { DragHandle } from "./DragHandle";
import type { Goal } from "@/lib/types";
import { daysRemaining, isDueSoon, isOverdue } from "@/lib/date-utils";
import { cn } from "@/lib/utils";

interface GoalCardProps {
  goal: Goal;
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
  dragHandleProps?: React.HTMLAttributes<HTMLButtonElement>;
  isDragging?: boolean;
  isOver?: boolean;
}

function badgeText(goal: Goal): string {
  if (goal.status === "completed") return "Done";
  const days = daysRemaining(goal.endDate);
  if (days < 0) return "Overdue";
  if (days === 0) return "Due today";
  if (days === 1) return "1 day left";
  return `${days} days left`;
}

export function GoalCard({
  goal,
  onComplete,
  onDelete,
  dragHandleProps,
  isDragging,
  isOver,
}: GoalCardProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const dueSoon = goal.status === "active" && isDueSoon(goal.endDate);
  const overdue = goal.status === "active" && isOverdue(goal.endDate);
  const highlight = dueSoon || overdue;

  return (
    <>
      <Card
        className={cn(
          "transition-colors",
          highlight && "bg-due-soon-bg border-due-soon-border",
          isDragging && "opacity-40 pointer-events-none",
          isOver && "border-t-2 border-accent"
        )}
      >
        <CardContent className="flex items-start gap-3 p-4">
          {dragHandleProps && <DragHandle {...dragHandleProps} />}
          <Checkbox
            id={`goal-${goal.id}`}
            checked={goal.status === "completed"}
            disabled={goal.status === "completed"}
            onCheckedChange={(checked) => {
              if (checked) onComplete(goal.id);
            }}
            aria-label={`Mark "${goal.title}" as complete`}
          />
          <div className="flex flex-1 flex-col gap-1 min-w-0">
            <label
              htmlFor={`goal-${goal.id}`}
              className={cn(
                "text-sm font-medium leading-snug cursor-pointer",
                goal.status === "completed" &&
                  "line-through text-muted-foreground"
              )}
            >
              {goal.title}
            </label>
            <Badge variant="outline" className="w-fit text-xs">
              {badgeText(goal)}
            </Badge>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0 text-muted-foreground hover:text-danger"
            onClick={() => setDeleteDialogOpen(true)}
            aria-label={`Delete goal "${goal.title}"`}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </CardContent>
      </Card>

      <ConfirmDeleteDialog
        open={deleteDialogOpen}
        goalTitle={goal.title}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={() => {
          onDelete(goal.id);
          setDeleteDialogOpen(false);
        }}
      />
    </>
  );
}
