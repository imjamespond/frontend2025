import { Message } from "./WebRTC";

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

export function sendClick(msg: Required<Message>["click"]) {
  fetch(`/api/mouse?type=click&x=${msg.x}&y=${msg.y}`, {
    headers: {
      "upgrade-insecure-requests": "1",
    },
    body: null,
    method: "GET",
    mode: "cors",
    credentials: "omit",
  });
}

export function sendKey(msg: Required<Message>["key"]) {
  fetch(`/api/key?key=${msg.key}`, {
    headers: {
      "upgrade-insecure-requests": "1",
    },
    body: null,
    method: "GET",
    mode: "cors",
    credentials: "omit",
  });
}
