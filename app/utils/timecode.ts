/** Format a duration in ms as hours:minutes:seconds:centiseconds. */
export function formatTimecode(time: number): string {
  const hours = time / 1000 / 60 / 60;

  const h = Math.floor(hours);
  const m = Math.floor((hours - h) * 60);
  const s = Math.floor(((hours - h) * 60 - m) * 60);
  const c = Math.floor(((((hours - h) * 60 - m) * 60 - s) * 1000) / 10);

  return `${zeroPrefix(h)}:${zeroPrefix(m)}:${zeroPrefix(s)}:${zeroPrefix(c)}`;
}

/** Left-pad a number below 10 with a zero. */
export function zeroPrefix(value: number): string {
  return value < 10 ? `0${value}` : `${value}`;
}

/** Rough reading time for a body of text, in milliseconds. */
export function readingTime(text: string): number {
  const wordsPerMinute = 225;
  const words = text.trim().split(/\s+/).length;

  return (words / wordsPerMinute) * 1000 * 60;
}
