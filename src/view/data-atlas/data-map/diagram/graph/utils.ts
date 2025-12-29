import type { Cell, NodeMetadata, Node } from "@antv/x6";
import type { Graph } from "./index";
import type { NodeData, OrgStyle } from "./types";

export function createOrgNode(style: OrgStyle, data: NodeData): NodeMetadata {
  // const title = getTitleStyle(style, data.category)
  const node = {
    shape: "organization",
    attrs: {
      // rect: {}, will effect svg in foreign object
    },
    data,
    width: style.size.boxWidth,
    height: style.size.boxHeight + 20,
    // x:-1000,
    // y:-1000
  };

  return node;
}

export function getOrgNodeData(node: Node, nullable: true): NodeData | void;
export function getOrgNodeData(node: Node): NodeData;
export function getOrgNodeData(node: Node) {
  return node.getData();
}
export function setOrgNodeData(node: Node, nodeData: Partial<NodeData>) {
  node.setData({ ...node.getData<NodeData>(), ...nodeData });
}

export function createEdge(this: Graph, source: Cell, target: Cell, style: OrgStyle, direction = "H") {
  const graph = this.x6graph;
  let marker: object = {
    targetMarker: {
      name: "block",
      width: 8,
      height: 16,
    },
    sourceMarker: null,
  };
  if (direction === "H") {
    marker = {
      targetMarker: null,
      sourceMarker: {
        name: "block",
        width: 8,
        height: 16,
      },
    };
  }
  return graph.createEdge({
    source: { cell: source.id /* port: 'port' */ },
    target: { cell: target.id, /* port: 'port' */ connectionPoint: "bbox" },
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
    zIndex: -1,
    attrs: {
      line: {
        strokeWidth: 2,
        stroke: style.color,
        ...marker,
      },
    },
  });
}

export function clampOffset(lDirs: DataAtlas.HomePageMapItem[], rDirs: DataAtlas.HomePageMapItem[]) {
  let offset = 0;
  if (lDirs.length > 3 && rDirs.length > 3) {
    offset = lDirs.length - rDirs.length;
    offset = offset > 2 ? 2 : offset;
    offset = offset < -2 ? -2 : offset;
  }
  return offset;
}
