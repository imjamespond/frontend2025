export function isType<T>(val: unknown, cond: boolean): val is T {
  return cond;
}