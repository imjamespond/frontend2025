export type { Node as X6Node, Edge as X6Edge } from "@antv/x6";
import type { Node } from "@antv/x6";
import type { Graph } from "./graph";
import type { SimulationLinkDatum, SimulationNodeDatum } from "d3-force";

export type GraphData = DataAtlas.JsonNode[];

export type NodeData = {
  id: string;
  nodeSize: number;
  radius: number;
  fontSize: string;
  x: number;
  y: number;
  lineHeight?: number;
  label: string;
  leaf?: boolean;

  data: DataAtlas.JsonNode;

  style?: Graph["style"];

  attrs?: object;
  props?: object;
};

export type NodeModel = SimulationNodeDatum & { initialPositionCalculated: boolean; r: number; node: Node };
export type RelationshipModel = SimulationLinkDatum<NodeModel>;
