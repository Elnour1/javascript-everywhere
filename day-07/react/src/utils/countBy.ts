export function countBy<T>(
  items: T[],
  getKey: (item: T) => string
): Record<string, number> {
  return items.reduce<Record<string, number>>((acc, item) => {
    const key = getKey(item);
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
}

export default countBy;