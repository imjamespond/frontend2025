export function createChunks(file: File, chunkSize = 1024 * 1024) {
  const result = [];
  for (let i = 0; i < file.size; i += chunkSize) {
    result.push(file.slice(i, i + chunkSize));
  }
  return result;
}

export function isType<T>(value: unknown, condition: boolean): value is T {
  return condition;
}