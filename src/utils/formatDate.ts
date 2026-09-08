const formatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
  timeZone: 'UTC',
});

/** Formats an ISO date (YYYY-MM-DD) as e.g. "Jul 10, 2026". */
export function formatDate(isoDate: string): string {
  return formatter.format(new Date(isoDate));
}
