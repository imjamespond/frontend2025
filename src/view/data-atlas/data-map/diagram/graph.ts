import { type NodeMetadata, type EdgeMetadata, Graph as X6 } from "@antv/x6";
import { BaseGraph, createUseGraph } from "@common/hooks/graph";
import { register } from "@antv/x6-react-shape";
import Organization from "./components/org";
import { createEdge, createNode } from "./graph/utils";

register({
  shape: "organization",
  effect: ["data"],
  component: Organization,
});

export class Graph extends BaseGraph {
  createNode = createNode.bind(this);
  createEdge = createEdge.bind(this);
  layout(_model?: void | { nodes?: NodeMetadata[]; edges?: EdgeMetadata[] } | undefined): void {
    throw new Error("Method not implemented.");
  }
}

export const useGraph = createUseGraph(Graph, {
  async: false,
  // autoResize: true,
  panning: {
    enabled: true,
    // eventTypes: ['leftMouseDown', 'mouseWheel'],
  },
  // scroller: true,
  interacting: !!process.env.devMode,
  mousewheel: {
    enabled: true,
    minScale: 0.5,
    maxScale: 1.5,
  },
});
