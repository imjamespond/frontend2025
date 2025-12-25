import { createUseStore } from "../common/hooks/zustand";
import type { ThemeConfig } from "antd";
import { colorPrimary } from "./style";
import type { CSSProperties } from "react";

export type AppType =
  | (Record<string, unknown> & {
      theme?: ThemeConfig;
      height?: CSSProperties["height"];
      env?: object & {
        domainId?: string;
      };
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

export function useDomainId() {
  const domainId = useAppStore((state) => state._v)?.env?.domainId;
  if (process.env.devMode) return 0;
  return domainId === undefined ? undefined : parseInt(domainId);
}
