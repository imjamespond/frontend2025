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

  // {
  //   const { width, height } = parent.getBBox();
  //   g.setNode(parent.id, { width, height, x: 0, y: 0 });
  // }

  // nodes.forEach((node) => {
  //   const { width, height } = node.getBBox();
  //   // if (node.data?.lv === 3 && rankdir === 'TB') {
  //   //   g.setNode(node.id, { width, height: node.data.style.size.boxHeight })
  //   // } else {
  //   g.setNode(node.id, { width, height, x: 0, y: 0 });
  // });

  // edges.forEach((edge) => {
  //   const source = edge.getSource() as TerminalCellData;
  //   const target = edge.getTarget() as TerminalCellData;
  //   g.setEdge(source.cell, target.cell);
  // });

  // dagre.layout(g);

  // // 内部, 外部，修正dagre, parent y， vertical上居中
  // let minY = 0,
  //   maxY = 0;
  // g.nodes().forEach((id: any) => {
  //   if (id !== parent.id) {
  //     const node = graph.getCellById(id) as Node;
  //     if (node) {
  //       const { width, height } = node.getBBox();
  //       const pos = g.node(id);
  //       node.position(pos.x - width * 0.5, pos.y - height * 0.5);
  //       minY = pos.y < minY ? pos.y : minY;
  //       maxY = pos.y > maxY ? pos.y : maxY;
  //     }
  //   }
  // });
  // // 内部, 外部，修正dagre, parent y， vertical上居中
  // {
  //   const { width, height } = parent.getBBox();
  //   const pos = g.node(parent.id);
  //   const _height = style.type === 1 ? (maxY - minY - height) * 0.5 : pos.y - height * 0.5;
  //   parent.position(pos.x - width * 0.5, _height);
  // }
}
