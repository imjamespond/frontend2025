export function setData<T = unknown>(key: string, val: T) {
  if (val !== undefined) window.localStorage.setItem(key, JSON.stringify(val));
}

export function getData<T = unknown>(key: string): T | undefined {
  const item = window.localStorage.getItem(key);
  try {
    return item ? JSON.parse(item) : undefined;
  } catch (error) {
    console.error(error);
  }
  return undefined;
}
