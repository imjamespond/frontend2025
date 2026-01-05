import { BaseGraph, createUseGraph } from "@common/hooks/graph";
// import { Node } from "@antv/x6";
import { register } from "@antv/x6-react-shape";
import Organization from "../components/Organization";
import { zoomFit } from "../config";
import { draw1, draw2, init } from "./init";
import { Category, DirNode } from "../components";
import { GraphType } from "../../helper";
import type { GraphData, Style, SubDir } from "../types";
import { layout } from "./layout";
import {
  addNodeTool,
  collapse,
  createCategoryNode,
  createDirNode,
  createEdge,
  createOrgNode,
  expandLayout,
  expandNode,
  selectDir,
  selectL3Dir,
} from "./helper";
import type { Dir } from "@/view/data-atlas/helper";
import { AddNodes } from "./fixedNodes";
import { ActType, GraphSubject } from "../context";

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
  graphData: GraphData | null = null;
  rootDir: Dir | undefined = undefined;
  subDir: SubDir | undefined = undefined;
  direction: string | null = null;
  rankdir: "TB" | "BT" | "LR" | "RL" | undefined = undefined;
  layout = layout.bind(this);
  createEdge = createEdge.bind(this);
  createNode = createOrgNode.bind(this);
  createCategoryNode = createCategoryNode.bind(this);
  createDirNode = createDirNode.bind(this);
  addNodeTool = addNodeTool.bind(this);
  collapse = collapse.bind(this);
  expandNode = expandNode.bind(this);
  expandLayout = expandLayout.bind(this);
  AddNodes = AddNodes.bind(this);
  selectDir = selectDir.bind(this);
  selectL3Dir = selectL3Dir.bind(this);
  draw1 = draw1.bind(this);
  draw2 = draw2.bind(this);
  zoomToFit() {
    const { root } = this;
    if (root === null) return;
    this.graph.zoomToFit(zoomFit);
    // this.graph.centerCell(root);
  }

  sub = GraphSubject.subscribe(({ type, payload }) => {
    switch (type) {
      case ActType.ClickDir: {
        this.selectDir(payload);
      }
    }
  });

  dispose() {
    this.sub.unsubscribe();
    super.dispose();
  }
}

export const useGraph = createUseGraph(Graph, {
  async: false,
  // virtual: { enabled: true, margin: 20 }, // 展开时addNode没有当前视口坐标不会显示即使通过setPos到视口
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
