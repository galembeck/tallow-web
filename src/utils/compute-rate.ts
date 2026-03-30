export function computeRate(current: number, previous: number) {
  if (previous === 0) return null;
  const pct = Math.abs(((current - previous) / previous) * 100);
  return {
    percentage: `${pct.toFixed(0)}%`,
    type: (current >= previous ? "increase" : "decrease") as
      | "increase"
      | "decrease",
  };
}
