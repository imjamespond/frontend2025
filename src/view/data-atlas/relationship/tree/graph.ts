import { BaseGraph, createUseGraph } from "@common/hooks/graph";
// import { Node } from "@antv/x6";
import { register } from "@antv/x6-react-shape";
import Organization from "./components/Organization";
import { zoomFit } from "./config";
import { draw1, init } from "./init";
import { Category, DirNode } from "./components";
import { GraphType } from "../helper";
import type { Style, SubDir } from "./types";
import { layout } from "./layout";
import { createCategoryNode, createEdge, createNode } from "./graphHelper";
import type { Dir } from "@/view/data-atlas/helper";
import { AddNodes } from "./fixedNodes";

register({
  shape: "graph-organization",
  effect: ["data"],
  component: Organization,
});

register({
  shape: "graph-category",
  effect: ["data"],
  component: Category,
});

register({
  shape: "graph-dir",
  effect: ["data"],
  component: DirNode,
});

export class Graph extends BaseGraph {
  init = init.bind(this);
  style: Style | null = null;
  root: DataAtlas.JsonNode | null = null;
  graphType: GraphType = GraphType.Tree;
  rootDir: Dir | undefined = undefined;
  subDir: SubDir | undefined = undefined;
  direction: string | null = null;
  rankdir: "TB" | "BT" | "LR" | "RL" | undefined = undefined;
  layout = layout.bind(this);
  createEdge = createEdge.bind(this);
  createNode = createNode.bind(this);
  createCategoryNode = createCategoryNode.bind(this);
  AddNodes = AddNodes.bind(this);
  draw1 = draw1.bind(this);
  zoomToFit() {
    const { root } = this;
    if (root === null) return;
    this.graph.zoomToFit(zoomFit);
    // this.graph.centerCell(root);
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
