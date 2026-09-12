const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

const formatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
  timeZone: 'UTC',
});

/** True for an ISO date (YYYY-MM-DD), false for labels such as "TBA". */
export function isIsoDate(value: string): boolean {
  return ISO_DATE.test(value);
}

/** Formats an ISO date as e.g. "Jul 10, 2026"; any other value is shown as is. */
export function formatDate(value: string): string {
  return isIsoDate(value) ? formatter.format(new Date(value)) : value;
}
