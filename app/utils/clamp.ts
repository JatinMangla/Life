/**
 * Clamp `value` between two bounds. With a single bound, treat it as a floor.
 */
export const clamp = (value: number, boundOne: number, boundTwo?: number): number => {
  if (boundTwo === undefined) {
    return Math.max(value, boundOne) === boundOne ? value : boundOne;
  }

  if (Math.min(value, boundOne) === value) return boundOne;
  if (Math.max(value, boundTwo) === value) return boundTwo;

  return value;
};
