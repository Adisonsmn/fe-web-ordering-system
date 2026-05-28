/**
 * Format number into Indonesian Rupiah (e.g. Rp 50.000)
 */
export function formatRupiah(amount: number): string {
  const formatted = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);

  return formatted
    .replace('IDR', 'Rp')
    .replace(/\u00a0/g, ' ')
    .trim();
}
