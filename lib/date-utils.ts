import {
  differenceInCalendarDays,
  parseISO,
  startOfDay,
  format,
} from "date-fns";

export function daysRemaining(endDate: string): number {
  return differenceInCalendarDays(parseISO(endDate), startOfDay(new Date()));
}

export function isDueSoon(endDate: string): boolean {
  const days = daysRemaining(endDate);
  return days >= 0 && days <= 3;
}

export function isOverdue(endDate: string): boolean {
  return daysRemaining(endDate) < 0;
}

export function formatEndDate(endDate: string): string {
  return format(parseISO(endDate), "MMM d, yyyy");
}
