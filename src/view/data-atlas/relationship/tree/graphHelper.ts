import { Cell, Node } from "@antv/x6";
import type { Graph } from "./graph";
import type { NodeData } from "./types";
import type { OrgNodeData } from "./components/Organization";

export function getNodeData(node: Cell) {
  return node.getData<NodeData>();
}
export function createNode(this: Graph, { nodeData }: { nodeData: OrgNodeData }): Node {
  const { style } = nodeData;
  const node = this.graph.createNode({
    shape: "graph-organization",
    attrs: {},
    data: { lv: 3, ...nodeData },
    width: style.size.boxWidth,
    height: style.size.boxHeight + 20,
  });

  return node;
}

export function createEdge(
  this: Graph,
  source: Cell,
  target: Cell,
  options = { marker: { width: 8, height: 16 }, strokeWidth: 2.2 }
) {
  const { style, direction } = this;
  const nodeData = getNodeData(source);
  const { strokeWidth } = options;
  return this.graph.createEdge({
    // shape: 'org-edge',
    source: { cell: source.id /* port: 'port' */ },
    target: { cell: target.id, /* port: 'port' */ connectionPoint: "bbox" },
    zIndex: -1,
    attrs: {
      line: {
        strokeWidth,
        stroke: nodeData?.color ?? style?.color,
        sourceMarker: null,
        targetMarker: {
          name: "block",
          ...options.marker,
        },
      },
    },
    router: {
      name: "er",
      args: {
        offset: "center",
        direction,
      },
    },
    connector: {
      name: "rounded",
      args: {
        radius: 10,
      },
    },
  });
}

export function createCategoryNode(graph: Graph, item: DataAtlas.JsonNode, color: string, label: string) {
  const node = graph.graph.createNode({
    id: item.nodeId,
    shape: "graph-category",
    width: 200,
    height: 40,
    attrs: {
      // body: {
      //   fill: '#fff',
      //   stroke: color ?? '#9254de',
      //   strokeWidth: 1,
      //   rx: 10,
      //   ry: 10,
      // },
      // label: {
      //   fill: color ?? '#9254de',
      //   refX: 0.5,
      //   refY: 0.5,
      //   fontSize: 12,
      //   textAnchor: 'middle',
      //   textVerticalAnchor: 'middle',
      // },
    },
    data: {
      color,
      lv: 2,
      collapsed: false,
      label,
    },
  });

  return node;
}
