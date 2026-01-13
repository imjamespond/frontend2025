import { getStyle } from "@config/style";
import type { Graph } from "./graph";
import { getEdge, getL3Node, getNode, getNodeData } from "./helper";
import type { NodeData, X6Node } from "./types";
import type { EdgeMetadata } from "@antv/x6";

export function expandNode(this: Graph, node: X6Node) {
  const fsm = this.fsm;
  if (!fsm) return;

  const data = getNodeData(node).data;
  const { children: nodeChildren } = data;
  const nm = this._nodeModelMap[node.id];
  // 收起
  if (nm.expanded) {
    nm.expanded = false;

    nodeChildren?.forEach((item) => {
      this.graph.removeNode(item.nodeId);
      delete this._nodeModelMap[item.nodeId];
    });

    fsm.updateRelationships(this.relationships()); //删除关系first
    fsm.updateNodes(this.nodeModles());
    return;
  }

  nm.expanded = true;

  const edgesToAdd: EdgeMetadata[] = [];
  const nodesToAdd =
    nodeChildren?.map((item) => {
      const { nodeId, text, childSize } = item;

      const fill = getStyle(this.entryId === nodeId, childSize);
      const n = getL3Node(data.nodeId, nodeId, text, item, fill);

      edgesToAdd.push(getEdge(node.id, nodeId));

      return getNode(n);
    }) ?? [];

  this.graph.addNodes(nodesToAdd);
  this.graph.addEdges(edgesToAdd);

  const pos = node.position();
  // 延长线
  let x = pos.x;
  let y = pos.y;
  this.graph.getIncomingEdges(node)?.forEach((edge) => {
    const spos = edge.getSourceNode().getPosition();
    const dx = pos.x - spos.x;
    const dy = pos.y - spos.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance === 0) return;
    const unitX = dx / distance;
    const unitY = dy / distance;
    const offset = 100 + 100 * Math.random();
    x = pos.x + unitX * offset;
    y = pos.y + unitY * offset;
  });

  const nodeModels = this.nodeModles();
  // 固定位置
  nodeModels.forEach((nm) => {
    const pos = nm.node.getPosition();
    nm.fx = pos.x + nm.r;
    nm.fy = pos.y + nm.r;
  });
  // 非固定位置
  nodeChildren?.forEach((node) => {
    const nm = this._nodeModelMap[node.nodeId];
    nm.x = x + nm.r;
    nm.y = y + nm.r;
    nm.vx = 0;
    nm.vy = 0;
    nm.fx = null;
    nm.fy = null;
  });

  fsm.updateNodes(nodeModels);
  fsm.updateRelationships(this.relationships());

  fsm.restart(() => {
    nodeModels.forEach((nm) => {
      nm.vx = 0;
      nm.vy = 0;
      nm.fx = null;
      nm.fy = null;
    });
  });
}

export function setRoot(this: Graph, rootNode: X6Node) {
  const fsm = this.fsm;
  if (!fsm) return;

  const graph = this.graph;
  const entryId = this.entryId;

  const { data } = getNodeData(rootNode);
  const { text, nodeId, children: rootChildren } = data;

  graph.resetCells([]);

  const root = {
    id: nodeId,
    pid: null,
    nodeSize: 100,
    fontSize: 13,
    x: 0,
    y: 0,
    label: text,
    data: { ...data },
    // refreshable: true,
  } satisfies NodeData;
  graph.addNode(getNode(root));

  rootChildren?.forEach((item) => {
    const { text, nodeId, childSize } = item;
    const style = getStyle(entryId === nodeId, childSize);
    const node = {
      id: nodeId,
      pid: root.id,
      nodeSize: 50,
      fontSize: 10,
      x: 0,
      y: 0,
      label: text,
      data: item,
      leaf: true,
      style: style,
    } satisfies NodeData;

    graph.addNode(getNode(node)); // 先让上层结点发散
    graph.addEdge(getEdge(root.id, node.id));
  });

  this.zoomToFit();

  const nodeModels = this.nodeModles();
  fsm.updateNodes(nodeModels);
  fsm.updateRelationships(this.relationships());
  fsm.restart();
}
