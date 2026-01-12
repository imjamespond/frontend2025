import { getColor } from "@config/style";
import type { Graph } from "./graph";
import { getL3Node, getNode, getNodeData } from "./helper";
import type { X6Node } from "./types";

export function expand(this: Graph, node: X6Node, entryId: string) {
  const data = getNodeData(node).data;
  const { children: nodeChildren } = data;
  // 收起已展开结点
  const children = node.getChildren();
  if (children !== null && children.length > 0) {
    children.forEach((child) => node.removeChild(child));
    return;
  }

  // 固定结点
  if (this._nodeModelMap === null) return;
  const nm = this._nodeModelMap[node.id];
  const pos = node.getPosition();
  nm.fx = pos.x;
  nm.fy = pos.y;

  const nodesToAdd =
    nodeChildren //.filter(n => n.dbType === dbTypes.dir)
      ?.map((item) => {
        const { nodeId, text, childSize } = item;
        const pos = node.position();
        // const n = appendNode(node, item, vec2, entryId);
        const fill = getColor(entryId === nodeId, childSize);
        const n = getL3Node(nodeId, text, data, { ...fill, color: "#2A2C34" });
        n.x = pos.x;
        n.y = pos.y;
        return getNode(n);
      }) ?? [];

  this.graph.addNodes(nodesToAdd);
}
