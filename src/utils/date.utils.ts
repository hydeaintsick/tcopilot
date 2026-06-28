import { TaskPeriod } from "@prisma/client";
import type { TaskSummary } from "../types/intent";

const PERIOD_HOURS: Record<TaskPeriod, string> = {
  MORNING: "09:00",
  NOON: "12:00",
  AFTERNOON: "14:00",
  EVENING: "18:00",
  NIGHT: "21:00",
};

const PERIOD_LABELS: Record<TaskPeriod, string> = {
  MORNING: "matin",
  NOON: "midi",
  AFTERNOON: "après-midi",
  EVENING: "soirée",
  NIGHT: "nuit",
};

const DEFAULT_DAY_HOUR = "09:00";

export function getPeriodHour(period: TaskPeriod): string {
  return PERIOD_HOURS[period];
}

export function getPeriodLabel(period: TaskPeriod): string {
  return PERIOD_LABELS[period];
}

export function getTodayInTimezone(timezone: string): string {
  return formatDateInTimezone(new Date(), timezone);
}

export function formatDateInTimezone(date: Date, timezone: string): string {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  return formatter.format(date);
}

export function formatTimeInTimezone(date: Date, timezone: string): string {
  const formatter = new Intl.DateTimeFormat("fr-FR", {
    timeZone: timezone,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const parts = formatter.formatToParts(date);
  const hour = parts.find((p) => p.type === "hour")?.value ?? "00";
  const minute = parts.find((p) => p.type === "minute")?.value ?? "00";
  return `${hour.padStart(2, "0")}:${minute.padStart(2, "0")}`;
}

export function parseDateString(dateStr: string): Date {
  const [year, month, day] = dateStr.split("-").map(Number);
  // Noon UTC avoids calendar-day shifts across timezones when formatting.
  return new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
}

export function formatDateForDisplay(dateStr: string): string {
  const date = parseDateString(dateStr);
  return new Intl.DateTimeFormat("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: "UTC",
  }).format(date);
}

export function isValidTimezone(timezone: string): boolean {
  try {
    Intl.DateTimeFormat(undefined, { timeZone: timezone });
    return true;
  } catch {
    return false;
  }
}

/**
 * Converts a local date + time in a given IANA timezone to a UTC Date.
 */
export function localDateTimeToUtc(
  dateStr: string,
  timeStr: string,
  timezone: string
): Date {
  const [year, month, day] = dateStr.split("-").map(Number);
  const [hour, minute] = timeStr.split(":").map(Number);

  const utcGuess = new Date(Date.UTC(year, month - 1, day, hour, minute, 0));

  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  const parts = formatter.formatToParts(utcGuess);
  const get = (type: Intl.DateTimeFormatPartTypes): number => {
    const val = parts.find((p) => p.type === type)?.value ?? "0";
    return parseInt(val, 10);
  };

  const tzYear = get("year");
  const tzMonth = get("month");
  const tzDay = get("day");
  const tzHour = get("hour") % 24;
  const tzMinute = get("minute");

  const intendedMs = Date.UTC(year, month - 1, day, hour, minute, 0);
  const actualMs = Date.UTC(tzYear, tzMonth - 1, tzDay, tzHour, tzMinute, 0);
  const offsetMs = actualMs - intendedMs;

  return new Date(utcGuess.getTime() - offsetMs);
}

const REMINDER_OFFSET_MS = 30 * 60 * 1000; // 30 minutes early

export function computeReminderAt(params: {
  date: string | null;
  time: string | null;
  period: TaskPeriod | null;
  timezone: string;
}): Date | null {
  const { date, time, period, timezone } = params;

  if (!date) {
    return null;
  }

  let scheduled: Date;

  if (time) {
    scheduled = localDateTimeToUtc(date, time, timezone);
  } else if (period) {
    scheduled = localDateTimeToUtc(date, getPeriodHour(period), timezone);
  } else {
    scheduled = localDateTimeToUtc(date, DEFAULT_DAY_HOUR, timezone);
  }

  return new Date(scheduled.getTime() - REMINDER_OFFSET_MS);
}

export function getDateRangeInTimezone(
  dateStr: string,
  timezone: string
): { start: Date; end: Date } {
  const startLocal = localDateTimeToUtc(dateStr, "00:00", timezone);
  const nextDay = addDaysToDateString(dateStr, 1);
  const endLocal = localDateTimeToUtc(nextDay, "00:00", timezone);
  return { start: startLocal, end: endLocal };
}

export function addDaysToDateString(dateStr: string, days: number): string {
  const date = parseDateString(dateStr);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

export function taskToSummary(task: {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  date: Date | null;
  time: string | null;
  period: TaskPeriod | null;
}): TaskSummary {
  return {
    id: task.id,
    title: task.title,
    description: task.description,
    status: task.status,
    priority: task.priority,
    date: task.date ? task.date.toISOString().slice(0, 10) : null,
    time: task.time,
    period: task.period,
  };
}
