export function formatTime(
  isoString: string | number | Date | undefined,
): string {
  const date = new Date(isoString || 0);

  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");

  const ampm = hours >= 12 ? "PM" : "AM";

  hours = hours % 12;
  hours = hours === 0 ? 12 : hours;

  return `${hours}:${minutes} ${ampm}`;
}
