import { createUseStore } from "../common/hooks/zustand";
import type { ThemeConfig } from "antd";
import { colorPrimary } from "./style";
import type { CSSProperties } from "react";

export type AppType =
  | (Record<string, unknown> & {
      theme?: ThemeConfig;
      height?: CSSProperties["height"];
    })
  | undefined;

export const useAppStore = createUseStore<AppType>({
  theme: {
    token: {
      colorPrimary,
      colorInfo: colorPrimary,
    },
  },
  height: "100vh",
});

export const useAppTheme = () => useAppStore((state) => state)._v?.theme;
export const useAppHeight = () => useAppStore((state) => state)._v?.height;
