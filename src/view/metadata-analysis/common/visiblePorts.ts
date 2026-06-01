import type { Graph as AntvGraph, Node } from "@antv/x6";
import { rowHeight } from "../config";
import type { Port } from "../config/port";
import type { Graph } from "../graph";
import { getFieldEdgeData } from "../helper";

/**
 * 虚拟滚动取得显示的port
 */

const portSize = 4;
const offsetTop = 38;

export function getVisiblePorts(this: Graph, node: Node) {
  const nodeData = this.nodesMap.get(node.id);
  if (nodeData === undefined) throw new Error("nodeData is undefined");

  const height: number = nodeData.height;
  const scrollTop = nodeData.scrollTop;

  if (scrollTop < 0) {
    return [];
  }

  const outgoings = this.graph.getOutgoingEdges(node);
  const incomings = this.graph.getIncomingEdges(node);

  // const container = getContainer()
  const offsetBase = offsetTop; //GetContainerOffsetTop(container)

  /* 符合高度的ports */
  const hasPorts: { [id: string]: Port[] } = {};
  const ports: { [id: string]: Port[] } = {};
  nodeData.data.fields.forEach((field) => {
    const f = this.fieldsMap.get(field.id);
    if (f === undefined) return;
    // 通过fields取得ports
    // 过滤不在滚动框内的ports
    const top = rowHeight * f.index + (rowHeight - portSize) / 2;
    const bottom = top + portSize;
    if (height > 0 && top > scrollTop && bottom < scrollTop + height) {
      hasPorts[f.id] = f.ports;
      // 根据field的顺序index,计算port位置
      const offset = offsetBase + (f.index ?? 0) * rowHeight + rowHeight / 2 - scrollTop;
      f.ports.forEach((port) => {
        port.args.offset = offset;
      });
    }
  });

  // const edges: Edge[] = [];
  // 本结点为起始 的edges
  if (outgoings) {
    outgoings.forEach((edge) => {
      const edgeData = getFieldEdgeData(edge);
      if (!edgeData) return;

      const lr = getLR(this.graph, edgeData.sNodeId, edgeData.tNodeId);
      // 若起源连线有 和 port匹配上则显示
      const sHiddenPort = sHiddenPorts[lr];
      const sPort = lr > 0 ? edgeData.sPortR : edgeData.sPort;
      const fports = hasPorts[edgeData.source];
      if (fports) {
        edge.setVisible(true); //(!!fports) // edge 对应的左右ports

        edge.setSource(node, { port: sPort });
        ports[edgeData.source] ??= fports;
      } else {
        edge.setSource(node, { port: sHiddenPort });
      }
      // 反向查target node 是否有对应port

      // if (edge.isVisible()) {
      //   edges.push(edge);
      // }
    });
  }
  // 本结点为目标
  if (incomings) {
    incomings.forEach((edge) => {
      const edgeData = getFieldEdgeData(edge);
      if (!edgeData) return;
      const lr = getLR(this.graph, edgeData.sNodeId, edgeData.tNodeId);
      const tHiddenPort = tHiddenPorts[lr];
      const tPort = lr ? edgeData.tPort : edgeData.tPortR;
      const fports = hasPorts[edgeData.target];
      edge.setVisible(true); //(!!fports) // edge 对应的左右ports
      if (fports) {
        edge.setTarget(node, { port: tPort });
        ports[edgeData.target] ??= fports;
      } else {
        edge.setTarget(node, { port: tHiddenPort });
      }

      if (edgeData.sNodeId === edgeData.tNodeId) {
        /* 指向本身的entity, 不应该用getPort判断, 应该在之前删除此node所有已存在port否则此处会误判存在而 本次滚动更新后却不再存在 */
        if (edgeData.source && ports[edgeData.source]) {
          /* 再次判断避免覆盖之前visible值, edge port不用管 */
          edge.setVisible(true);
        }
      } else {
        // 反向查source node 是否有对应port
      }

      // if (edge.isVisible()) {
      //   edges.push(edge);
      // }
    });
  }
}

/**
 * 判断左右
 * @param graph
 * @param sid
 * @param tid
 * @returns
 */
function getLR(graph: AntvGraph, sid: string, tid: string): 0 | 1 {
  const t = graph.getCellById(tid) as Node;
  const s = graph.getCellById(sid) as Node;
  if (t && s) {
    const tx = t.getPosition().x,
      sx = s.getPosition().x;
    if (sx < tx) {
      return 1;
    }
  }
  return 0;
}

const tHiddenPorts = ["hiddenPortR", "hiddenPort"];
const sHiddenPorts = ["hiddenPort", "hiddenPortR"];

export function GetContainerOffsetTop(container: HTMLDivElement | undefined) {
  let offset = container?.offsetTop ?? 0;
  let parent = container?.offsetParent as HTMLElement;
  while (parent && parent.tagName !== "body") {
    offset += parent.offsetTop || 0;
    parent = parent.offsetParent as HTMLElement;
  }
  return offset;
}
