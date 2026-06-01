import type { Node } from "@antv/x6";
import { AddNodes, BottomOrg } from "./fixedNodes";
import type { Graph } from "./index";
import type { OrgStyle, ResourceType } from "./types";
import { createOrgNode } from "./utils";

/**
 * 初始化图形
 */
export function render(this: Graph, data: DataAtlas.HomePageMap) {
  const { graph, draw } = this;
  const dirs = data.dataAsset;
  const { bottom, root } = AddNodes(graph);
  this.root = root;

  if (dirs && dirs.length > 0) {
    const middle = Math.ceil(dirs.length * 0.5);
    const upperDirs = dirs.slice(0, middle);
    const lowerDirs = dirs.slice(middle);
    this.layoutFns = [];
    draw({
      parent: bottom,
      pos: { x: 0, y: 0 },
      rankdir: "BT",
      direction: "V",
      style: BottomOrg,
      dirs: upperDirs,
      resourceType: "dataAsset",
    });
    draw({
      parent: bottom,
      pos: { x: 0, y: 0 },
      rankdir: "TB",
      direction: "V",
      style: BottomOrg,
      dirs: lowerDirs,
      resourceType: "dataAsset",
    });
  }
}

/**
 * 上下layout
 * @param this
 * @param param1
 */
export function draw(
  this: Graph,
  {
    parent,
    rankdir,
    direction,
    style,
    dirs,
    resourceType,
  }: {
    parent: Node; // 外部内部资源,数据资产 结点
    pos: unknown; // 结点位置
    rankdir: string; // dagre 布局方向
    direction?: string; // edge ER router 参数
    style: OrgStyle;
    dirs: DataAtlas.HomePageMapItem[];
    resourceType: ResourceType;
  },
) {
  const graph = this.graph;

  const zoom = 1; // graph.zoom();
  const nodes = dirs.map((dir) => {
    const newStyle = getSize(style, dir, zoom);
    const nodeMeta = createOrgNode(newStyle, { dir, style: newStyle, resourceType, matchedDirId: "" });
    return graph.createNode(nodeMeta);
  });

  const edges = nodes.map((node: Node) => {
    return this.createEdge(parent, node, style, direction);
  });

  for (const node of nodes) {
    parent.addChild(node);
  }
  graph.addEdges(edges);

  const layoutFn = () => {
    const margin = style.nodesep!;
    const totalWidth = nodes.length * style.size.width + (nodes.length - 1) * margin!;
    nodes.forEach((n, i) => {
      const bbox = n.getBBox();
      n.setPosition({
        x: i * (bbox.width + margin) - totalWidth * 0.5,
        y: rankdir === "BT" ? -380 - (bbox.height - style.size.height) : 200,
      });
    });
  };
  this.layoutFns.push(layoutFn);
}

export function getSize(style: OrgStyle, data: DataAtlas.HomePageMapItem, zoom: number) {
  const list = data?.list ?? [];
  const { cols, size, minRows } = style;

  const rows = Math.ceil((list.length + 1) / cols);

  const boxMaxHeight = (rows * 32 + 35) / zoom;
  const boxHeight = data.unFold ? boxMaxHeight : ((rows < minRows ? minRows : minRows) * 32 + 35) / zoom;

  return {
    ...style,
    rows,
    size: { ...size, boxWidth: size.width + 4, boxHeight: boxHeight + 4, boxMaxHeight: boxMaxHeight + 4 },
  } as OrgStyle;
}
