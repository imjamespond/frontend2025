import type { ThemeConfig } from "antd";
import type { CSSProperties } from "react";
import { createUseStore } from "../common/hooks/zustand";
import { colorPrimary } from "./style";

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
export const showcolumn = () => useAppStore.getState()._v?.showcolumn;

export function useDomainId() {
  const domainId = useAppStore((state) => state._v)?.env?.domainId;
  if (process.env.devMode) return 2980796;
  return domainId === undefined ? undefined : parseInt(domainId);
}
