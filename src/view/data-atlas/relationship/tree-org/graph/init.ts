import { Cell, Edge } from "@antv/x6";
import { LRStyle, TBStyle } from "./fixedNodes";
import type { GraphData, Style } from "../types";
import { getColors, groupDepth } from "../config";
import { GraphType } from "../../helper";
import type { Graph } from ".";
import { getNodeData } from "./helper";

/**
 * 初始化图形
 */
export function init(this: Graph) {
  const { graph, graphType, subDir, root, AddNodes } = this;
  if (root === null) return;

  const rankdir = graphType === GraphType.Org ? "TB" : "LR";
  const direction = graphType === GraphType.Org ? "V" : "H";
  const style = graphType === GraphType.Org ? TBStyle : LRStyle;

  this.style = style;
  this.direction = direction;
  this.rankdir = rankdir;

  graph.resetCells([]);
  const { node } = AddNodes({ id: root.nodeId, text: root.text });

  const noGroup = groupDepth === 3 ? subDir?.subDir?.subDir : subDir?.subDir;
  if (noGroup) {
    root.children && this.draw2({ parent: node, items: root.children, rankdir });
  } else {
    root.children && this.draw1({ parent: node, items: root.children });
  }

  this.layout();
  graph.zoomToFit({ padding: 10 });
  graph.centerContent();
}

export function draw1(
  this: Graph,
  {
    parent,
    items,
  }: {
    items?: GraphData;
    parent: Cell; // 外部内部资源,数据资产 结点
  }
) {
  const { graph, rootDir, style, createNode, createEdge, createCategoryNode } = this;

  if (rootDir === undefined || style === null) {
    return;
  }

  const edges: Edge[] = [];
  // 二级结点
  const nodes = (items ?? []).map((item, i: number) => {
    const { text } = item;
    const color = getColors(i);
    const label = `${text}(${item.dataAssetAndSubDirCount ?? 0})`;
    const node = createCategoryNode(item, color, label);
    edges.push(createEdge(parent, node));
    node.data = { item };
    return node;
  });

  const zoom = graph.zoom();

  // 三级带虚线的html结点
  const children = nodes.map((spNode, i: number) => {
    const color = getColors(i);
    const item = getNodeData(spNode)!.item;

    const newStyle = getSize({ ...style, color }, item.children?.length ?? 0, zoom);

    const nodeData = {
      style: newStyle,
      dirId: rootDir.dirId,
      item,
      label: "",
      // onSelectDir: selectDir1,
    };
    const node = createNode({ nodeData });

    edges.push(createEdge(spNode, node));

    return node;
  });

  const allNodes = nodes.concat(children);

  for (const node of allNodes) {
    graph.addNode(node);
  }
  graph.addEdges(edges);
}

export function draw2(
  this: Graph,
  {
    parent,
    items,
  }: {
    items?: GraphData;
    parent: any; // 外部内部资源,数据资产 结点
    rankdir: string; // dagre 布局方向
  }
) {
  const { graph, subDir, createCategoryNode, createEdge, addNodeTool, expandLayout, selectL3Dir } = this;
  let center: Node | null = null;

  // 二级结点
  (items ?? []).forEach((item, i: number) => {
    const { text } = item;
    const color = getColors(i);
    const label = `${text}(${item.dataAssetAndSubDirCount ?? 0})`;
    const node = createCategoryNode(item, color, label);
    graph.addNode(node);
    graph.addEdge(createEdge(parent, node));
    node.data = { item, collapsed: false };

    // 3级以下目录结点
    const _center = selectL3Dir({ node, subDir: (groupDepth === 3 ? subDir?.subDir : subDir) as DataAtlas.SubDir });
    center = _center ? _center : center;

    node.data.collapsed = !!_center;
    addNodeTool(node);

    return node;
  });

  if (!!center) {
    expandLayout({ center });
    graph.centerCell(center);
  }
}
export function getSize(style: Style, length: number, zoom: number) {
  const { cols, size, minRows } = style;

  const rows = Math.ceil((length + 1) / cols);

  const boxHeight = (minRows * 31 + (minRows - 1) * 8 + 30) / zoom;
  const boxMaxHeight = (rows * 31 + (rows - 1) * 8 + 30) / zoom;

  return {
    ...style,
    rows,
    size: { ...size, boxWidth: size.width + 4, boxHeight: boxHeight + 4, boxMaxHeight: boxMaxHeight + 4 },
  } as Style;
}
