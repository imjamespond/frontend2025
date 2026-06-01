import type { ResourceType } from "@/view/data-atlas/helper";

export interface Style {
  type: 0 | 1; // 1为内部或外部
  size: {
    width: number;
    height: number;
    boxWidth: number;
    boxHeight: number;
    boxMaxHeight: number;
  };
  ranksep?: number; // 布局
  nodesep?: number;
  cols: number; // 列数
  minRows: number;
  maxRows: number; //
  rows?: number; // 行数
  color?: string;
}

export enum NodeType {
  Category = 0,
  Organization = 1,
}

export interface NodeData {
  item: DataAtlas.JsonNode;
  label: string;
  color?: string;
  lv?: number;
}

export type DirNodeData = {
  direction: string;
  resourceType: ResourceType;
  highlight: boolean;
  color: string;
} & NodeData;

export type GraphData = DataAtlas.JsonNode[];
