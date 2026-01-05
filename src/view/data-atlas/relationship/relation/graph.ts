import { BaseGraph, createUseGraph } from "@common/hooks/graph";
import { Selection } from "@antv/x6";
import type { GraphData } from "./types";
import { zoomFit } from "../tree-org/config";
import { colorPrimary } from "@config/style";
import { draw1, draw2 } from "./draw";
import type { SubDir } from "../../helper";
import "./register";

export const groupDepth = 3;

export class Graph extends BaseGraph {
  graphData: GraphData | null = null;
  subDir: SubDir | null = null;
  entryId: string | null = null;
  rootDir: SubDir | null = null;
  style = { fill: colorPrimary, stroke: colorPrimary, color: "#fff" };
  draw1 = draw1.bind(this);
  draw2 = draw2.bind(this);
  layout() {
    throw new Error("Method not implemented.");
  }

  zoomToFit() {
    this.graph.zoomToFit(zoomFit);
  }

  init() {
    this.graph.use(new Selection({ enabled: true }));

    const { draw1, draw2, graph, subDir } = this;

    if (subDir === null) return;

    this.rootDir = (groupDepth === 3 ? subDir.subDir : subDir)!;

    graph.resetCells([]);

    const isSub = groupDepth === 3 ? subDir.subDir?.subDir : subDir.subDir;

    /* 初始化图形 */
    if (isSub) {
      draw2();
    } else {
      draw1();
    }
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
