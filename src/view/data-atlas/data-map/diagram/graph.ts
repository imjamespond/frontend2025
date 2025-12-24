import type { NodeMetadata, EdgeMetadata } from "@antv/x6";
import { BaseGraph, createUseGraph } from "@common/hooks/graph";

class Graph extends BaseGraph {
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
