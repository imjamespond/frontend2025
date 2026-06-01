import { DagreLayout, GridLayout } from "@antv/layout";
import type { Edge, Node } from "@antv/x6";
import ELK, { type ElkExtendedEdge, type ElkNode } from "elkjs";
import type { Graph } from "../graph";
import { getEdgeData } from "../helper";
import { EdgeType } from "../types";
import { getPortId } from ".";

export type LayoutOpt = {
  rankdir?: "LR" | "RL" | "TB" | "BT";
  batch?: boolean;
  disableRenderPorts?: boolean;
  fixedNode?: Node;
  mx?: number;
  my?: number;
  pad?: number;
};

export function grid_layout(this: Graph) {
  if (this.graph === undefined) {
    throw Error("graph is undefined");
  }

  const graph = this.graph;

  const gridLayout = new GridLayout({
    type: "grid",
    // width: 600,
    // height: 400,
    // rows: 4,
    // cols: 4,
    nodeSize: 250,
    preventOverlap: true,
    sortBy: "degree",
  });

  // 设置结点
  const nodes = graph.getNodes().map((node) => {
    node.getData();
    return {
      id: node.id,
      size: this.getSize(node.id),
      node,
    };
  });
  // 设置连线
  const edges = graph.getEdges()?.map((ln) => {
    return {
      source: ln.getSourceCellId(),
      target: ln.getTargetCellId(),
    };
  });
  const model = {
    nodes,
    edges,
  };
  // 布局计算
  gridLayout.layout(model);

  // 更新位置
  gridLayout.nodes.forEach((v) => {
    const gnode = v;
    const node = (gnode as unknown as { node: Node }).node;
    const x = gnode.x; //- gnode.width * .5 /* 只有一个node时 强制更新  */ + 1
    const y = gnode.y; //- gnode.height * .5

    node.setPosition({ x, y });
    // node.toFront() 避免遮挡连线
  });

  this.graph.zoomToFit();
}

export function antv_layout(this: Graph, _nodes: Node[], _edges: Edge[], { ...layoutOpt }: LayoutOpt = {}) {
  if (this.graph === undefined) {
    throw Error("graph is undefined");
  }

  const mx = layoutOpt.mx ?? 120;
  const my = layoutOpt.my ?? 30;

  // const graph = this.graph;
  // 布局配置
  const dagreLayout = new DagreLayout({
    type: "dagre",
    rankdir: layoutOpt.rankdir ?? "LR",
    align: "UR",
    // nodeSize: 250,
    // nodesepFunc: undefined;
    // ranksepFunc: undefined;
    ranksep: layoutOpt.rankdir === "TB" ? my : mx, // LR 左右间距, TB 上下
    nodesep: layoutOpt.rankdir === "TB" ? mx : my, // LR 上下间距, TB 左右
    controlPoints: true,
  });

  // 设置结点
  const nodes = _nodes.map((node) => {
    node.getData();
    return {
      id: node.id,
      size: this.getSize(node.id),
      node,
    };
  });
  // 设置连线
  const edges = _edges.map((ln) => {
    return {
      source: ln.getSourceCellId(),
      target: ln.getTargetCellId(),
    };
  });
  const model = {
    nodes,
    edges,
  };
  // 布局计算
  dagreLayout.layout(model);

  const delta: [number, number] | null = null;
  // if (fixedNode) {
  //   const origin = fixedNode.getPosition()
  //   const gnode = g.node(fixedNode.id)
  //   const x = gnode.x - gnode.width * .5
  //   const y = gnode.y - gnode.height * .5
  //   delta = [origin.x - x, origin.y - y]
  // }

  // 更新位置
  dagreLayout.nodes.forEach((v) => {
    const gnode = v;
    const node = (gnode as unknown as { node: Node }).node;
    const x = gnode.x; //- gnode.width * .5 /* 只有一个node时 强制更新  */ + 1
    const y = gnode.y; //- gnode.height * .5
    if (delta === null) {
      node.setPosition({ x, y });
    } else {
      node.setPosition({ x: x + delta[0], y: y + delta[1] });
    }
    // node.toFront() 避免遮挡连线
  });

  this.graph.zoomToFit();
}

export async function elk_layout(
  this: Graph,
  _nodes: Node[],
  _edges: Edge[],
  opt?: {
    mx?: string;
    my?: string;
    edgepy?: number;
    portAlign?: string;
    withPorts?: boolean;
    elk?: object;
    nodePorts?: boolean;
  },
) {
  const nodesMap: Record<string, Node> = {};

  // 设置结点
  const nodes = _nodes.map((node) => {
    const { width, height } = node.getBBox();

    return {
      id: node.id,
      width: width,
      height: height,
      layoutOptions: {
        // portConstraints: 'FIXED_ORDER', // FIXED_ORDER FIXED_POS FIXED_SIDE FREE
        "portAlignment.default": opt?.portAlign, // https://eclipse.dev/elk/reference/options/org-eclipse-elk-portAlignment-default.html
      },
      ports: opt?.nodePorts
        ? [
            {
              id: `${node.id}-src`,
              width: 80,
              // height: 10,
              layoutOptions: {
                "port.side": "WEST",
                "port.index": "1",
              },
            },
            {
              id: `${node.id}-tar`,
              width: 80,
              // height: 10,
              layoutOptions: {
                "port.side": "WEST",
                "port.index": "2",
              },
            },
          ]
        : [],
      node,
    } as ElkNode;
  });
  // 设置连线
  const edges = _edges
    // self loop 的edge用manhattan 路由
    .filter((edge) => getEdgeData(edge).type === EdgeType.Entity && edge.getSourceCellId() !== edge.getTargetCellId())
    .map((edge: Edge) => {
      const source = edge.getSourceCellId();
      const target = edge.getTargetCellId();
      return {
        sources: [source],
        targets: [target],
        id: edge.id,
        edge,
      } as ElkExtendedEdge;
    });

  const elk = new ELK({
    defaultLayoutOptions: {
      // "elk.padding": "[top=25,left=25,bottom=25,right=25]",
      // "elk.margins": "[top=25,left=125,bottom=125,right=125]",
      "elk.algorithm": "org.eclipse.elk.layered",
      // 'elk.separateConnectedComponents': 'false',
      // 'spacing.componentComponent': '40f', // 单独个体间距
      "spacing.edgeNode": "40", // 线与节点的空间
      "spacing.nodeSelfLoop": "40",
      "spacing.nodeNodeBetweenLayers": opt?.mx ?? "100", // 垂直间距 when DOWN
      "spacing.nodeNode": opt?.my ?? "100", // 水平间距 when DOWN
      "spacing.edgeEdgeBetweenLayers": "10",
      // 'elk.direction': 'DOWN', //'DOWN', 'UNDEFINED'
      // 'elk.layered.nodePlacement.strategy': 'LINEAR_SEGMENTS',// 'SIMPLE', // 'INTERACTIVE', // 'NETWORK_SIMPLEX', // 结点布局策略, INTERACTIVE
      "elk.edgeRouting": "ORTHOGONAL", // 多连线
      "layered.spacing.edgeNodeBetweenLayers": "40", // edge转折与node间距
      "spacing.portPort": "15", // port 间隔
      ...opt?.elk,
    },
  });

  const edgepy = opt?.edgepy ?? 0;

  try {
    return await elk
      .layout({
        id: "__root__",
        children: nodes,
        edges,
      })
      .then((res) => {
        res.children?.forEach((child) => {
          const node = (child as unknown as { node: Node }).node;
          if (node) {
            const x = child.x ?? 0;
            const y = (child.y ?? 0) - edgepy; // edge 向下偏移补偿
            node.setPosition({ x, y });
          }
        });
        res.edges?.forEach((elkEdge) => {
          const edge = (elkEdge as unknown as { edge: Edge }).edge;
          if (edge && elkEdge.sections?.length) {
            // const edgeData = edge.data
            const { startPoint, endPoint, bendPoints = [] } = elkEdge.sections[0];
            if (opt?.withPorts) {
              const source = nodesMap[edge.getSourceCellId()];
              const target = nodesMap[edge.getTargetCellId()];
              const id = getPortId(edge.id);
              const sx = startPoint.x - source.getPosition().x;
              const tx = endPoint.x - target.getPosition().x;

              source.addPort({
                id,
                group: "abs",
                args: {
                  x: sx,
                  y: startPoint.y - source.getPosition().y,
                },
              });
              target.addPort({
                id,
                group: "abs",
                args: {
                  x: tx,
                  y: endPoint.y - target.getPosition().y,
                },
              });
              edge.setSource({ cell: source, port: id });
              edge.setTarget({ cell: target, port: id });
            } else {
              edge.setSource(startPoint);
              edge.setTarget(endPoint);
            }
            edge.setVertices(bendPoints);
          }
        });

        // _nodes?.forEach((node) => {
        //   const data = node.getData()
        //   if (isFKNode(data)) { // 若是fk节点，则对齐至target node的高度
        //     const edge = helpers[node.id]
        //     if (edge) {
        //       const [src, tar] = edge
        //       if (tar) {
        //         const tNode = nodesMap[tar]
        //         if (tNode) {
        //           const tpos = tNode.getPosition()
        //           const pos = node.getPosition()
        //           node.setPosition({ x: pos.x, y: tpos.y + 80 });
        //         }
        //       }
        //     }
        //   }
        // })

        // 单独处理自己连自己
        _edges
          .filter((edge) => edge.getSourceCellId() === edge.getTargetCellId())
          .forEach((edge: Edge) => {
            edge.setRouter({
              name: "manhattan",
              // args: { startDirections: ['top'], endDirections: ['left'] },
            });
          });
      });
  } catch (error) {
    console.error("elk layout error:", error);
  }
}
