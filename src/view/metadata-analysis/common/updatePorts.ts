import type { Edge, Node, Rectangle } from "@antv/x6";
import { kmDebug } from "@common/misc";
import type { Graph } from "../graph";
import { getPortId } from ".";

const grid = 50;

/**
 * todo 计算每侧ports顺序
 * @param this
 * @param node
 */
export function update_ports(this: Graph, node?: Node) {
  if (this.graph === undefined) {
    throw "graph is undefined";
  }
  const graph = this.graph;

  /**
   *
   * @param node curNode关联节点, 更新curNode另一侧node ports
   * @param curNode
   */
  const updateNode = (node: Node, curNode: Node) => {
    const incomings = graph.getIncomingEdges(node);
    const outgoings = graph.getOutgoingEdges(node);
    incomings?.forEach((edge) => {
      const snode = edge.getSourceNode();
      snode && getNodePorts(edge, snode, node, 1, curNode === snode); // edge是否和current node关联
    });
    outgoings?.forEach((edge) => {
      const tnode = edge.getTargetNode();
      tnode && getNodePorts(edge, node, tnode, 0, curNode === tnode);
    });
  };

  const updateOutgoing = (node: Node) => {
    // current node
    const outgoings = graph.getOutgoingEdges(node);
    outgoings?.forEach((edge) => {
      const tnode = edge.getTargetNode();
      tnode && updateNode(tnode, node);
    });
  };
  const updateIncoming = (node: Node) => {
    // current node
    const incomings = graph.getIncomingEdges(node);
    incomings?.forEach((edge) => {
      const snode = edge.getSourceNode();
      snode && updateNode(snode, node);
    });
  };

  const ports: { [nodeid: string]: NodePorts } = {};
  const paddings: { [gridkey: string]: GridNums } = {};
  /**
   *
   * @param edge
   * @param snode
   * @param tnode
   * @param st 0 更新 src port, 1 更新 tar port
   * @param originNode the dragging node 更新
   */
  const getNodePorts = (edge: Edge, snode: Node, tnode: Node, st: 0 | 1, originNode: boolean) => {
    const sbox = snode.getBBox();
    const tbox = tnode.getBBox();
    let sg: Side = "right",
      tg: Side = "right";
    let router: Port["router"] = 0;
    let direction: Port["direction"] = "H";
    const smid: Port["mid"] = [0, 0];
    const tmid: Port["mid"] = [0, 0];
    if (sbox.left > tbox.right) {
      // source is on the right
      sg = "left";
      smid[0] = sbox.left;
      smid[1] = sbox.center.y;
      tmid[0] = tbox.right;
      tmid[1] = tbox.center.y;
    } else if (sbox.right < tbox.left) {
      // source is on the left
      tg = "left";
      smid[0] = sbox.right;
      smid[1] = sbox.center.y;
      tmid[0] = tbox.left;
      tmid[1] = tbox.center.y;
    } else {
      // y轴重合
      if (sbox.bottom < tbox.top - 100) {
        router = 2;
        // source on top
        direction = "V";
        sg = "bottom";
        tg = "top";
        smid[0] = sbox.center.x;
        smid[1] = sbox.bottom;
        tmid[0] = tbox.center.x;
        tmid[1] = tbox.top;
      } else if (sbox.top > tbox.bottom + 100) {
        router = 2;
        // source at bottom
        direction = "V";
        sg = "top";
        tg = "bottom";
        smid[0] = sbox.center.x;
        smid[1] = sbox.top;
        tmid[0] = tbox.center.x;
        tmid[1] = tbox.bottom;
      } else {
        router = 1;
        if (sbox.center.x > tbox.center.x) {
          // source at the right
          smid[0] = sbox.right;
          smid[1] = sbox.center.y;
          tmid[0] = tbox.right;
          tmid[1] = tbox.center.y;
        } else {
          sg = "left";
          tg = "left";
          smid[0] = sbox.left;
          smid[1] = sbox.center.y;
          tmid[0] = tbox.left;
          tmid[1] = tbox.center.y;
        }
      }
    }

    /**
     * 计算中线偏移
     */
    const gridKey = getGridKey(sbox, tbox);
    paddings[gridKey] ??= { left: 0, right: 0, top: 0, bottom: 0 };
    const pad = paddings[gridKey];
    pad[sg] = (pad[sg] ?? 0) + 1;

    const id = getPortId(edge.id);
    const sp = snode.getPort(id);
    const tp = tnode.getPort(id);
    // 搜集全部ports
    if (st === 0 || originNode) {
      // node 为 source
      ports[snode.id] ??= { left: [], right: [], top: [], bottom: [] };
      const snPorts = ports[snode.id];
      const tb = tbox.y > sbox.y ? 1 : -1;
      snPorts[sg].push({
        id,
        node: snode, // source
        edge,
        type: 1,
        x: tbox.center.x, // 另一侧的位置
        y: tbox.center.y,
        py: (tp?.args?.y as number) ?? 0,
        g: sg,
        sg,
        gridKey,
        router,
        onlyPort: st === 0 && originNode,
        tb,
        direction,
        mid: smid, // the port of this node 所在side的中心
      });
    }
    if (st === 1 || originNode) {
      // node 为target
      const tnPorts = (ports[tnode.id] ??= { left: [], right: [], top: [], bottom: [] });
      const tb = sbox.y > tbox.y ? 1 : -1;
      tnPorts[tg].push({
        id,
        node: tnode, // target
        edge,
        type: 2,
        x: sbox.center.x, // 另一侧的位置
        y: sbox.center.y,
        py: (sp?.args?.y as number) ?? 0,
        g: tg,
        sg,
        gridKey,
        router,
        onlyPort: st === 1 && originNode,
        tb,
        direction,
        mid: tmid,
      });
    }
    // kmDebug('snode', snode.id, sbox, sp?.args, 'tnode', tnode.id, tbox,)
  };

  const updatePorts = (ports: Port[], side: Side) => {
    const _ports = ports.sort((a, b) => {
      let delta = 0;
      if (side === "left") {
        if (a.y > a.mid[1]) {
          if (b.y > a.mid[1]) {
            // 都在中心下方
            delta = a.x - b.x;
            // TODO 判断x相同在一列的情况
          } else {
            delta = 1;
          }
        } else {
          if (b.y < a.mid[1]) {
            // 都在中心上方
            delta = b.x - a.x;
          } else {
            delta = -1;
          }
        }
      } else if (side === "right") {
        // 是否都在中心的一侧
        if (a.y > a.mid[1]) {
          if (b.y > a.mid[1]) {
            // 都在中心下方
            delta = b.x - a.x; // 另一侧越左(x小)port越靠后
          } else {
            delta = 1; // 不在一侧 a 靠后
          }
        } else {
          if (b.y < a.mid[1]) {
            // 都在中心上方
            delta = a.x - b.x; // 另一侧越左(x小)port越靠前
          } else {
            delta = -1; // 不在一侧 a 靠前
          }
        }
      } else if (side === "top") {
        if (a.x > a.mid[0]) {
          if (b.x > a.mid[0]) {
            // 都在中心右侧
            delta = a.y - b.y;
          } else {
            delta = 1;
          }
        } else {
          if (b.x < a.mid[0]) {
            // 都在中心左侧
            delta = b.y - a.y;
          } else {
            delta = -1;
          }
        }
      } else if (side === "bottom") {
        if (a.x > a.mid[0]) {
          if (b.x > a.mid[0]) {
            // 都在中心右侧
            delta = b.y - a.y;
          } else {
            delta = 1;
          }
        } else {
          if (b.x < a.mid[0]) {
            // 都在中心左侧
            delta = a.y - b.y;
          } else {
            delta = -1;
          }
        }
      }
      // port的顺序
      if (delta === 0) {
        // 可能另一端为同一节点
        return a.py - b.py; // 比对port的位置
      }
      return delta;
    });
    _ports.forEach(({ edge, id, node, type, g, onlyPort, router, direction, gridKey, sg, tb }, i) => {
      if (type === 1) {
        edge.setSource(node);
        node.removePort(id);
        node.addPort({
          id,
          group: g,
          args: { y: i },
        });
        edge.setSource(node, { port: id });
      } else {
        edge.setTarget(node);
        node.removePort(id);
        node.addPort({
          id,
          group: g,
          args: { y: i },
        });
        edge.setTarget(node, { port: id });
      }

      if (onlyPort === false) {
        const pad = paddings[gridKey];
        const offset = pad[sg]--;
        edge.setVertices([]);
        edge.setRouter(
          (() => {
            if (router === 0) {
              return {
                name: "er1",
                args: {
                  padding: offset * 5 * tb, // 只能避免对向edge中线重合
                  offset: "center",
                  direction,
                },
              };
            }
            if (router === 1) {
              return {
                name: "oneSide",
                args: { side: sg },
              };
            }
            return {
              name: "manhattan",
              args: {
                startDirections: ["top", "bottom"],
                endDirections: ["top", "bottom"],
                padding: 30,
              },
            };
          })(),
        );
      }

      kmDebug("edge", edge.id, onlyPort);
    });
  };

  if (node) {
    updateOutgoing(node);
    updateIncoming(node);

    kmDebug("paddings", JSON.stringify(paddings));

    for (const nid in ports) {
      const nports = ports[nid];
      updatePorts(nports.left, "left");
      updatePorts(nports.right, "right");
      updatePorts(nports.top, "top");
      updatePorts(nports.bottom, "bottom");
    }

    kmDebug("ports", ports);
  } else {
    graph.getNodes().forEach((node) => {
      updateOutgoing(node);
    });
  }
}

type Side = "left" | "right" | "top" | "bottom";
type Port = {
  id: string;
  type: 1 | 2; // 1 for src, 2 for tar
  node: Node;
  edge: Edge;
  x: number;
  y: number;
  mid: [number, number]; // side 的中点x,y
  py: number;
  g: Side;
  sg: Side; // 出发port的位置
  tb: -1 | 1; // pad 方向
  router: 0 | 1 | 2;
  gridKey: string;
  onlyPort: boolean; // node为拖动点，只更新port，不更新edge
  direction: "H" | "V";
};

type NodePorts = { left: Port[]; right: Port[]; top: Port[]; bottom: Port[] };

type GridNums = { left: number; right: number; top: number; bottom: number };

function getGridKey(sbox: Rectangle, tbox: Rectangle) {
  const x1 = Math.floor(sbox.x / grid);
  const x2 = Math.floor(tbox.x / grid);
  if (x2 < x1) return `${x2}-${x1}`;
  return `${x1}-${x2}`;
}
