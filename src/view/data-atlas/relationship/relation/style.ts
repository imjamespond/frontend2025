import { createGlobalStyle } from "antd-style";

export const Style = createGlobalStyle(({ theme }) => `
path {
    &.context-menu-item {
        stroke-width: 2px;
        fill: ${theme.colorBgBase};
    }
}


.x6-node .ring {
  opacity: 0;
}
.x6-node:hover .ring {
  stroke: rgb(106, 198, 255);
  opacity: 0.3;
}
.x6-node.x6-node-selected .ring {
  stroke: rgb(106, 198, 255);
  opacity: 0.5;
}
.x6-edge:hover .outline {
  stroke-opacity: 0.15;
}
.x6-node.x6-node path.context-menu-item {
  stroke-width: 2px;
  fill: rgb(210, 213, 218);
}
.x6-node.x6-node path.context-menu-item:hover {
  cursor: pointer;
  font-size: 14px;
  fill: rgb(185, 185, 185);
}
.x6-node.x6-node .context-menu-item {
  cursor: pointer;
}
`)
