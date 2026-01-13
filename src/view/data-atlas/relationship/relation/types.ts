export type { Node as X6Node, Edge as X6Edge } from "@antv/x6";
import type { Node } from "@antv/x6";
import type { SimulationLinkDatum, SimulationNodeDatum } from "d3-force";
import type { getStyle } from "@config/style";

export type GraphData = DataAtlas.JsonNode[];

export type NodeData = {
  id: string;
  pid: string | null;

  nodeSize: number;
  // radius: number;
  fontSize: number;
  x: number;
  y: number;
  // lineHeight?: number;
  label: string;
  amount?: number;
  leaf?: boolean;

  data: DataAtlas.JsonNode;

  style?: ReturnType<typeof getStyle>;

  attrs?: object;
  props?: object;
};

export type NodeModel = SimulationNodeDatum & {
  // initialPositionCalculated: boolean;
  r: number;
  selected?: boolean;
  expanded?: boolean;
  node: Node;
};
export type RelationshipModel = SimulationLinkDatum<NodeModel>;
