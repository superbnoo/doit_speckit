import { GripVertical } from "lucide-react";

export function DragHandle(props: React.HTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      aria-label="Drag to reorder"
      className="flex items-center justify-center shrink-0 min-h-[44px] min-w-[44px] cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground transition-colors"
      {...props}
    >
      <GripVertical className="h-4 w-4" />
    </button>
  );
}
