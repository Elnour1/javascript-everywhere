export function countBy<T, K extends string | number>(
  items: T[],
  keySelector: (item: T) => K
): Record<K, number> {
  const tally = {} as Record<K, number>;
  for (const item of items) {
    const key = keySelector(item);
    tally[key] = (tally[key] ?? 0) + 1;
  }
  return tally;
}