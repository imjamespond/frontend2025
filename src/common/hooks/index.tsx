import { App } from "antd";

export function useMsg() {
  const { message } = App.useApp();
  return message;
}
