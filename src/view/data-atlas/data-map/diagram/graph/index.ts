import { type NodeMetadata, type EdgeMetadata, type Node } from "@antv/x6";
import { BaseGraph, createUseGraph } from "@common/hooks/graph";
import { register } from "@antv/x6-react-shape";
import Organization from "./Org";
import { createEdge, createOrgNode } from "./utils";
import { draw, init } from "./draw";
import { zoomFit } from "./config";

register({
  shape: "organization",
  effect: ["data"],
  component: Organization,
});

export class Graph extends BaseGraph {
  init = init.bind(this);
  draw = draw.bind(this);
  createNode = createOrgNode.bind(this);
  createEdge = createEdge.bind(this);
  layoutFns: { (): void }[] = [];
  root: Node | null = null;
  layout(_model?: void | { nodes?: NodeMetadata[]; edges?: EdgeMetadata[] } | undefined): void {
    const { root } = this;
    if (root === null) return;
    this.layoutFns.forEach((layout) => layout());
    this.x6graph.zoomToFit(zoomFit);
    this.x6graph.centerCell(root);
  }
}

export const useGraph = createUseGraph(Graph, {
  async: false,
  virtual: { enabled: true, margin: 20 },
  panning: {
    enabled: true,
  },
  interacting: !!process.env.devMode,
  mousewheel: {
    enabled: true,
    minScale: 0.5,
    maxScale: 1.5,
  },
  grid: undefined,
});
