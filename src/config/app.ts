import { createUseStore } from "../common/hooks/zustand";
import type { ThemeConfig } from "antd";
import { colorPrimary } from "./style";

export type AppType =
  | (Record<string, unknown> & {
      theme?: ThemeConfig;
    })
  | undefined;

export const useAppStore = createUseStore<AppType>({
  theme: {
    token: {
      colorPrimary,
      colorInfo: colorPrimary,
    },
  },
});

export const useAppTheme = () => useAppStore((state) => state)._v?.theme;
