"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AddGoalModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (title: string, endDate: string) => void;
}

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

export function AddGoalModal({ open, onOpenChange, onSave }: AddGoalModalProps) {
  const [title, setTitle] = useState("");
  const [endDate, setEndDate] = useState("");
  const [titleError, setTitleError] = useState("");
  const [dateError, setDateError] = useState("");

  function resetForm() {
    setTitle("");
    setEndDate("");
    setTitleError("");
    setDateError("");
  }

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) resetForm();
    onOpenChange(nextOpen);
  }

  function handleSave() {
    let valid = true;

    if (!title.trim()) {
      setTitleError("Title is required.");
      valid = false;
    } else {
      setTitleError("");
    }

    if (!endDate) {
      setDateError("End date is required.");
      valid = false;
    } else if (endDate < todayISO()) {
      setDateError("End date must be today or a future date.");
      valid = false;
    } else {
      setDateError("");
    }

    if (!valid) return;

    onSave(title.trim(), endDate);
    handleOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add a new goal</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 pt-2">
          <div className="flex flex-col gap-1">
            <Label htmlFor="goal-title">Title</Label>
            <Input
              id="goal-title"
              type="text"
              placeholder="What do you want to achieve?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              aria-describedby={titleError ? "title-error" : undefined}
            />
            {titleError && (
              <p id="title-error" className="text-xs text-danger">
                {titleError}
              </p>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <Label htmlFor="goal-end-date">End Date</Label>
            <Input
              id="goal-end-date"
              type="date"
              min={todayISO()}
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              aria-describedby={dateError ? "date-error" : undefined}
            />
            {dateError && (
              <p id="date-error" className="text-xs text-danger">
                {dateError}
              </p>
            )}
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => handleOpenChange(false)}>
              Cancel
            </Button>
            <Button
              className="bg-accent hover:bg-accent-hover text-white"
              onClick={handleSave}
            >
              Save
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
