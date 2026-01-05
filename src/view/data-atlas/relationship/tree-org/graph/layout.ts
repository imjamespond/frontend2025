import { Node } from "@antv/x6";
import { DagreLayout } from "@antv/layout";
import type { Graph } from ".";
import { getNodeData } from "./helper";

export function layout(this: Graph) {
  const { style, rankdir, graph } = this;
  const nodesMap: Record<string, Node> = {};
  const nodes = graph.getNodes().map((node) => {
    nodesMap[node.id] = node;
    const bbox = node.getBBox();
    return {
      id: node.id,
      width: bbox.width,
      height: bbox.height,
    };
  });
  const edges = graph.getEdges().map((edge) => ({ source: edge.getSourceCellId(), target: edge.getTargetCellId() }));
  if (!nodes || !edges || !rankdir) return;

  const dagreLayout = new DagreLayout({
    type: "dagre",
    rankdir: rankdir,
    // align: "UR",
    ranksep: style?.ranksep,
    nodesep: style?.nodesep,
  });

  const model = dagreLayout.layout({ nodes, edges });

  model.nodes?.forEach((_n) => {
    const n = _n as unknown as { x: number; y: number };
    const node = nodesMap[_n.id];
    const nodeData = getNodeData(node);
    const bbox = node.getBBox();

    // 层级居中对齐
    if (rankdir === "LR") node.setPosition(n.x, n.y - bbox.height / 2);
    else node.setPosition(n.x - bbox.width / 2, nodeData?.lv === 3 ? n.y - 80 : n.y);
  });
}
