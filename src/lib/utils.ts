import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function getRelativeTime(value: string | null): string {
  if (!value) return "just now"
  
  const timeOnlyPattern = /^(\d{2}):(\d{2}):(\d{2})(?:\.(\d+))?$/
  const timeMatch = value.match(timeOnlyPattern)
  let date: Date

  if (timeMatch) {
    // Create date in UTC then convert to local
    const now = new Date()
    const datePart = now.toISOString().slice(0, 10)
    date = new Date(`${datePart}T${timeMatch[0]}Z`) // Add Z for UTC parsing
  } else {
    date = new Date(value)
  }

  if (isNaN(date.getTime())) return "just now"

  let diffMs = Date.now() - date.getTime()
  
  // If time appears in future, it's from yesterday
  if (diffMs < 0 && timeMatch) {
    date = new Date(date.getTime() - 24 * 60 * 60 * 1000)
    diffMs = Date.now() - date.getTime()
  }

  if (diffMs < 0) return "just now"

  const minute = 60 * 1000
  const hour = 60 * minute
  const day = 24 * hour

  if (diffMs >= day) return `${Math.floor(diffMs / day)}d ago`
  if (diffMs >= hour) return `${Math.floor(diffMs / hour)}h ago`
  if (diffMs >= minute) return `${Math.floor(diffMs / minute)}m ago`
  return "just now"
}

export function formatCreatedAt(value: string | null): string {
  if (!value) return "Unknown";

  let date: Date;

  // 1. If it's ONLY time (e.g., "14:30:00"), we must tell JS it's UTC 
  // so it can calculate the offset to your local time.
  if (/^\d{2}:\d{2}/.test(value)) {
    const today = new Date().toISOString().split('T')[0]; // "2024-05-20"
    // We combine Today + Time + 'Z' to force UTC parsing
    date = new Date(`${today}T${value}${value.includes('Z') ? '' : 'Z'}`);
  } else {
    // 2. For full strings, ensure there is a 'Z' at the end if it's missing
    const utcValue = value.endsWith('Z') ? value : `${value}Z`;
    date = new Date(utcValue);
  }

  if (isNaN(date.getTime())) return "Unknown";

  // 3. This tells the browser: "Take that UTC time and show it in the user's system timezone"
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
    // hourCycle: 'h12' // Uncomment if you specifically want AM/PM
  }).format(date);
}