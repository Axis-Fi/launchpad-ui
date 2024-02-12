export function getTimestamp(date: Date): number {
  return Math.floor(date.getTime() / 1000);
}

export function getDuration(daysDuration: number): number {
  return daysDuration * 24 * 60 * 60;
}
