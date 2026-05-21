export function formatDateTime(
  isoString: string | number | Date | undefined
): string {
  const date = new Date(isoString || 0);

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
}