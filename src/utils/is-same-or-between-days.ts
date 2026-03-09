export function isSameOrBetweenDays(date: Date, from: Date, to: Date) {
  const d = [date.getFullYear(), date.getMonth(), date.getDate()];
  const f = [from.getFullYear(), from.getMonth(), from.getDate()];
  const t = [to.getFullYear(), to.getMonth(), to.getDate()];

  const dNum = d[0] * 10_000 + d[1] * 100 + d[2];
  const fNum = f[0] * 10_000 + f[1] * 100 + f[2];
  const tNum = t[0] * 10_000 + t[1] * 100 + t[2];

  return dNum >= fNum && dNum <= tNum;
}
