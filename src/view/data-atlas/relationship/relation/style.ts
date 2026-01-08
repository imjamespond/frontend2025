import { createGlobalStyle } from "antd-style";

export const Style = createGlobalStyle(({ theme }) => `
path {
    &.context-menu-item {
        stroke-width: 2px;
        fill: ${theme.colorBgBase};
    }
}`)
