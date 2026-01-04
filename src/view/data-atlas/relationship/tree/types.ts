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

export interface NodeData {
  item: DataAtlas.JsonNode;
  color?: string;
}

export type GraphData = DataAtlas.JsonNode[];
export type SubDir = DataAtlas.SubDir;
