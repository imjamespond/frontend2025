import type { Node } from "@antv/x6";
import { register } from "@antv/x6-react-shape";
import { BaseGraph, createUseGraph } from "@components/graph";
import { zoomFit } from "./config";
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
  protected layoutFns: (() => void)[] = [];
  root: Node | null = null;
  layout() {
    const { root } = this;
    if (root === null) return;
    this.layoutFns.forEach((layout) => layout());
  }
  zoomToFit() {
    const { root } = this;
    if (root === null) return;
    this.graph.zoomToFit(zoomFit);
    this.graph.centerCell(root);
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
