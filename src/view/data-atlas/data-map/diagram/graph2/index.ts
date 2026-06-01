import type { EdgeMetadata, NodeMetadata } from "@antv/x6";
import { register } from "@antv/x6-react-shape";
import { BaseGraph, createUseGraph } from "@components/graph";
import { draw, render } from "./draw";
import Organization from "./Org";
import { createEdge, createOrgNode } from "./utils";

register({
  shape: "organization",
  effect: ["data"],
  component: Organization,
});

export class Graph extends BaseGraph {
  render = render.bind(this);
  draw = draw.bind(this);
  createNode = createOrgNode.bind(this);
  createEdge = createEdge.bind(this);
  layout(_model?: void | { nodes?: NodeMetadata[]; edges?: EdgeMetadata[] } | undefined): void {
    throw new Error("Method not implemented.");
  }
}

export const useGraph = createUseGraph(Graph, {
  async: true,
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
