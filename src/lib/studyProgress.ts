// The degree timeline's date maths, kept out of Education.tsx so it can be
// unit-tested. Fast Refresh needs a component file to export only components.
export const START = new Date(2024, 8, 1); // September 2024
export const END = new Date(2028, 4, 31); // May 2028
const SPAN = END.getTime() - START.getTime();
export const TOTAL_YEARS = 4;

export const at = (date: Date) =>
  Math.min(Math.max((date.getTime() - START.getTime()) / SPAN, 0), 1);

export function yearOfStudy(now: Date) {
  const months =
    (now.getFullYear() - START.getFullYear()) * 12 + (now.getMonth() - START.getMonth());
  return Math.min(Math.max(Math.floor(months / 12) + 1, 1), TOTAL_YEARS);
}
