import "./publicPath";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { useAppStore, type AppType } from "@config/app";

let root: Misc.Nullable<ReactDOM.Root> = null;

export async function bootstrap() {
  console.log("[react] react app bootstraped");
}

export async function mount(props: { container?: HTMLElement | void } & AppType) {
  console.log("[react] props from main framework", props);

  const { container, ...restProps } = props;
  const rootEl = container || document.getElementById("root");
  useAppStore.getState().mergeValue(restProps);

  if (rootEl) {
    root = ReactDOM.createRoot(rootEl);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  }
}

export async function unmount() {
  console.log("[react] react app unmount");
  root?.unmount();
}

// 增加 update 钩子以便主应用手动更新微应用
export async function update(props?: AppType) {
  console.debug("[react] update", props);
  useAppStore.getState().mergeValue({ ...props });
}

if (!window.__POWERED_BY_QIANKUN__) {
  if (process.env.NODE_ENV === "development") {
    bootstrap().then(() => mount({}));
  }
}
