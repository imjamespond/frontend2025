import type { EdgeMetadata, NodeMetadata } from "@antv/x6";

export interface OrgStyle {
  label: string;
  class: string;
  color: string;
  size: {
    width: number;
    height: number;
    boxWidth: number;
    boxHeight: number;
    boxMaxHeight: number;
  };
  marginX: number;
  marginY: number; // 布局
  cols: number; // 列数
  minRows: number;
  midRows?: number;
  maxRows: number; //
  rows?: number; // 行数
  // body: any, title: any
  nodeMeta?: NodeMetadata;
  edgeMeta?: EdgeMetadata;
}

export const labels = {
  functionUnits: "Function Units",
  digitalConsumer: "Digital Consumer",
  common: "Common",
  digitalOperation: "Digital Operation",
};

export type ResourceType = keyof typeof labels;
