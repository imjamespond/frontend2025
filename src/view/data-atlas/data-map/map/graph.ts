import type { NodeMetadata, EdgeMetadata } from "@antv/x6";
import { BaseGraph, createUseGraph, type Options } from "@common/hooks/graph";

class Graph extends BaseGraph {
  layout(_model?: void | { nodes?: NodeMetadata[]; edges?: EdgeMetadata[] } | undefined): void {
    throw new Error("Method not implemented.");
  }
  constructor(options: Options) {
    super(options);
  }
}

export const useGraph = createUseGraph(Graph);
