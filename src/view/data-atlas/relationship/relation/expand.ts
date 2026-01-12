import { getStyle } from "@config/style";
import type { Graph } from "./graph";
import { getEdge, getL3Node, getNode, getNodeData } from "./helper";
import type { X6Node } from "./types";
import type { EdgeMetadata } from "@antv/x6";

export function expandNode(this: Graph, node: X6Node) {
  if (!this.fsm) return;

  const data = getNodeData(node).data;
  const { children: nodeChildren } = data;
  const nm = this._nodeModelMap[node.id];
  if (nm.expanded) {
    nm.expanded = false;

    nodeChildren?.map((item) => {
      this.graph.removeNode(item.nodeId);
      delete this._nodeModelMap[item.nodeId];
    });

    this.fsm.updateRelationships(this.relationships());//删除关系first
    this.fsm.updateNodes(this.nodes());
    this.fsm.restart();
    return;
  }

  nm.expanded = true;

  // 收起已展开结点
  const children = node.getChildren();
  if (children !== null && children.length > 0) {
    children.forEach((child) => node.removeChild(child));
    return;
  }

  const edgesToAdd: EdgeMetadata[] = [];
  const nodesToAdd =
    nodeChildren?.map((item) => {
      const { nodeId, text, childSize } = item;
      const pos = node.position();
      const fill = getStyle(this.entryId === nodeId, childSize);
      const n = getL3Node(nodeId, text, data, fill);
      n.x = pos.x;
      n.y = pos.y;

      edgesToAdd.push(getEdge(node.id, nodeId));

      return getNode(n);
    }) ?? [];

  this.graph.addNodes(nodesToAdd);
  this.graph.addEdges(edgesToAdd);

  this.fsm.updateNodes(this.nodes());
  this.fsm.updateRelationships(this.relationships());

  for (const key in this._nodeModelMap) {
    const nm = this._nodeModelMap[key];
    // 固定结点
    if (node.id === key) {
      const pos = node.getPosition();
      nm.fx = pos.x + nm.r;
      nm.fy = pos.y + nm.r;
    } else {
      nm.fx = null;
      nm.fy = null;
    }
  }

  this.fsm.restart();
}
