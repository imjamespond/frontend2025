import type { Edge, Node } from "@antv/x6";
import { kmDebug } from "@common/misc";
import type { Graph } from "../graph";
import { getEntEdgeData, type HighLightNodes } from "../helper";
import { EdgeType } from "../types";

/**
 * 分析相关关系并高亮
 * @param originId 起点node id
 */
export function highlightNodesAndEdges(this: Graph, originId: string) {
  if (this.highlightId && this.highlightId === originId) {
    this.highlightId = undefined;
    this.highlightEdges([]);
    this.highlightNodes(originId, {});
    // EntitySubject.next({ type: EntityActionType.HighLight, payload: { nodes: {}, originId } });
    return;
  } else {
    this.highlightId = originId;
  }

  const nodes: HighLightNodes = {};
  const edges: Edge[] = [];

  const find = (modelId: string, forward: boolean, pDepth: number) => {
    const depth = pDepth + 1;
    // 防止闭环
    if (depth > 10) {
      return;
    }

    kmDebug("highlightNodesAndEdges depth", depth);

    const node = (nodes[modelId] = this.graph.getCellById(modelId) as unknown as Node);

    const edges = forward ? this.graph.getOutgoingEdges(node) : this.graph.getIncomingEdges(node);
    if (edges) {
      edges
        .filter((e) => getEntEdgeData(e).type === EdgeType.Entity)
        .forEach((edge) => {
          const otherId = forward ? edge.getTargetCellId() : edge.getSourceCellId();
          // 高亮edge
          edge && edges.push(edge);
          // 防止infinite loop
          if (otherId !== originId) {
            find(otherId, forward, depth);
          }
        });
    }
  };

  find(originId, true, 0);
  find(originId, false, 0);

  this.highlightEdges(edges);
  this.highlightNodes(originId, nodes);

  // EntitySubject.next({ type: EntityActionType.HighLight, payload: { nodes, originId } });
}
