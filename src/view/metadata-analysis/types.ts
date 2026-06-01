// import { Edge } from "@antv/x6";
// import type { Port } from "./config/port";

import type { Port } from "./config/port";

export type GraphData = MetadataAnalysis.AnalysisTableAndColumn;

export type NodeData = {
  // add node 时copy到node data中
  graphId: number;
  graphType: GraphType;
  analysisType: string;

  width: number;
  height: number;
  /** 默认高度 */
  defaultHeight: number;
  /** 总高度 */
  totalHeight: number;

  data: MetadataAnalysis.NodeData;

  // 通过 effect['data'] 刷新状态
  highlight?: boolean;
  highlightEntry?: boolean;

  // 其它不copy的数据, 后续更新不会更新到node data中
  scrollTop: number; // 拷贝属性detach（node创建时），通过nodeMap修改
  scrollTopMax: number;

  fieldEdges?: {
    outgoing: Record<string, FieldEdgeData>;
    incoming: Record<string, FieldEdgeData>;
  };

  port?: Port;
  portR?: Port;
};

export enum EdgeType {
  Entity = 1,
  Field = 2,
}
export interface EdgeData {
  type: EdgeType;
}
export interface EntEdgeData extends EdgeData {
  data: MetadataAnalysis.TableEdge;
}
export interface FieldEdgeData extends EdgeData {
  data: MetadataAnalysis.ColumnEdge;

  sNodeId: string;
  tNodeId: string;

  //字段关系
  source: string;
  target: string;

  sPort: string;
  tPort: string;
  sPortR: string;
  tPortR: string;
}

// export interface Field {
//   id: string;
//   entityId: string;
//   index: number;
//   ports: [Port, Port];
//   data: MetadataAnalysis.Field;
// }

// export type FieldsMap = Map<string, Field>;
export type NodesMap = Map<string, NodeData>;

export enum GraphType {
  None,
  Field,
  Entity,
}
