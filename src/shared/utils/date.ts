/**
 * Format date into Indonesian short date format (e.g. 28 Mei 2026)
 */
export function formatTanggal(dateInput: string | Date | number): string {
  const date = new Date(dateInput);
  if (Number.isNaN(date.getTime())) return '-';
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

/**
 * Format date into 24-hour time format (e.g. 17:45)
 */
export function formatJam(dateInput: string | Date | number): string {
  const date = new Date(dateInput);
  if (Number.isNaN(date.getTime())) return '-';
  return new Intl.DateTimeFormat('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(date);
}
