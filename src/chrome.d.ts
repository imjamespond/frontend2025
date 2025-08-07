export function createFileWriter(name: string): Promise<FileWriter>;

export type FileWriter = readonly [
  write: (chunk: ArrayBuffer | Blob) => Promise<void>,
  finish: () => void,
  writable: unknown
];
