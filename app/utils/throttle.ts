/**
 * Leading-edge throttle: run `func` at most once per `timeFrame` ms.
 */
export function throttle<Args extends unknown[]>(
  func: (...args: Args) => void,
  timeFrame: number
): (...args: Args) => void {
  let lastTime = 0;

  return (...args: Args) => {
    const now = Date.now();

    if (now - lastTime >= timeFrame) {
      func(...args);
      lastTime = now;
    }
  };
}
