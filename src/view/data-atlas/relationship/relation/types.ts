export type { Node, Edge } from "@antv/x6";
import type { Graph } from "./graph";
import type { SimulationLinkDatum, SimulationNodeDatum } from "d3-force";

export type GraphData = DataAtlas.JsonNode[];


export type NodeData = {
  id: string;
  nodeSize: number;
  r: number;
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

export type NodeModel = SimulationNodeDatum;
export type RelationshipModel = SimulationLinkDatum<NodeModel>;
