export function formatDate(date: string | number | Date): string {
  return new Date(date).toLocaleDateString('default', {
    year: 'numeric',
    month: 'long',
    day: '2-digit',
  });
}
