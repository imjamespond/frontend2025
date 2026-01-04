export interface OrgStyle {
  label: string;
  type: 0 | 1; // 1为内部或外部
  class: string;
  color: string;
  size: {
    width: number;
    height: number;
    boxWidth: number;
    boxHeight: number;
    boxMaxHeight: number;
  };
  ranksep?: number;
  nodesep?: number; // 布局
  cols: number; // 列数
  minRows: number;
  midRows?: number;
  maxRows: number; //
  rows?: number; // 行数
  // body: any, title: any
}

export const labels = {
  dataAssets: "数据资产",
  innerSource: "内部资源",
  outerSource: "外部资源",
};

export type ResourceType = keyof typeof labels;

export type NodeData = {
  dir: DataAtlas.HomePageMapItem;
  style: OrgStyle;
  resourceType: ResourceType;
  // 外部节点控制状态
  expanded?: boolean;
  matchedDirId: string;
};
