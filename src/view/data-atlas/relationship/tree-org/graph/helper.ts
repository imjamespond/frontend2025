import type { Cell, CellView, Edge, Node } from "@antv/x6";
import { type HierarchyPointNode, hierarchy, tree } from "d3";
import type { SubDir } from "@/view/data-atlas/helper";
import type { OrgNodeData } from "../components/Organization";
import type { DirNodeData, NodeData } from "../types";
import type { Graph } from ".";

export function getNodeData(node: Cell) {
  return node.getData<NodeData | void>();
}
export function createOrgNode(this: Graph, { nodeData }: { nodeData: OrgNodeData }): Node {
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

export function createDirNode(this: Graph, { nodeId }: DataAtlas.JsonNode, data: DirNodeData): Node {
  const { graph } = this;
  return graph.createNode({
    id: nodeId,
    shape: "graph-dir",
    // label: item.dirName ?? '暂无',
    width: 120,
    height: 24,
    attrs: {
      // body: {
      //   fill: highlight ? colorPrimary : '#fff',
      //   stroke: colorPrimary,
      //   strokeWidth: 1,
      //   rx: 3,
      //   ry: 3,
      // },
    },
    data,
  });
}

export function createEdge(
  this: Graph,
  source: Cell,
  target: Cell,
  options = { marker: { width: 8, height: 16 }, strokeWidth: 2.2 },
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

export function createCategoryNode(this: Graph, item: DataAtlas.JsonNode, color: string, label: string) {
  const node = this.graph.createNode({
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

const dirToolOpt = { r: 6, fontSize: 14, x: 0, y: 4 };

export function selectDir(
  this: Graph,
  {
    data /* 当前点击目录 */,
    node /* 当前点击结点 */,
    pdata /* 当前层级所有目录 */,
  }: {
    data: DataAtlas.JsonNode;
    node: Node;
    pdata: DataAtlas.JsonNode;
  },
) {
  const { graph, direction, rootDir, createEdge, createDirNode, addNodeTool, expandLayout } = this;
  const resourceType = rootDir?.resourceType;
  // console.debug(curData, node, data)

  // 2级结点
  let spNode: Node | null = null;
  let curNode: Node | null = null;
  const edges: Edge[] = [];
  const nodes: Node[] = [];
  // 从点击结点取得2级结点
  graph.getIncomingEdges(node)?.forEach((edge: Edge) => {
    spNode = edge.getSourceCell() as Node;
    spNode.data.collapsed = true; // 选中结点标记为展开
  });
  // 3级目录结点
  const l3Nodes = pdata?.children;
  // 删除之前的3级结点
  graph.getNodes().forEach((node) => {
    const nodeData = getNodeData(node);
    if (nodeData?.lv === 3) {
      node.remove();
    } else if (node.data?.lv === 2) {
      addNodeTool(node);
    }
  });

  if (spNode !== null) {
    const edgeOpt = { marker: { width: 4, height: 8 }, strokeWidth: 1 };
    // 3级目录结点
    l3Nodes?.forEach((item) => {
      const highlight = item.nodeId === data.nodeId;
      const nodeData: DirNodeData = { ...spNode!.data, collapsed: false, item, direction, highlight, resourceType };
      const node = createDirNode(item, nodeData);
      const edge = createEdge(spNode!, node, edgeOpt);
      // _spNode.addChild(node) // 加入上级子结点, not work with async
      graph.addNode(node);
      nodes.push(node);
      edges.push(edge);
      if (data.nodeId === item.nodeId) {
        curNode = node;
        node.data.collapsed = true;
      }
      addNodeTool(node, dirToolOpt);
    });

    const begin = performance.now();

    if (curNode !== null) {
      const item = getNodeData(curNode)!.item;
      // 4级目录
      const l4Nodes = item.children;
      l4Nodes
        // .filter((item) => item.dbType === dbTypes.dir)
        ?.forEach((item) => {
          const nodeData: DirNodeData = { ...curNode!.data, item, collapsed: false, highlight: false };
          const node = createDirNode(item, nodeData);
          const edge = createEdge(curNode!, node, edgeOpt);
          addNodeTool(node, dirToolOpt);
          // curNode!.addChild(node) // 加入上级子结点
          graph.addNode(node);
          nodes.push(node);
          edges.push(edge);
        });
      expandLayout({ center: spNode });
      graph.addEdges(edges);
    }

    console.debug(selectDir.name, performance.now() - begin);
  }
}

/* 点击结点按钮展开 */
export function expandNode(this: Graph, { node /* 当前点击结点 */ }: { node: Node }) {
  const { graph, createDirNode, createEdge, addNodeTool, expandLayout } = this;
  const begin = performance.now();

  const { item } = node.getData<NodeData>();
  const edges: Edge[] = [];
  const nodes: Node[] = [];
  const edgeOpt = { marker: { width: 4, height: 8 }, strokeWidth: 1 };
  // 子目录结点
  item.children &&
    item.children
      // .filter((item) => item.dbType === dbTypes.dir)
      .forEach((item) => {
        // performance evaluating
        // for(let i = 0; i < 10; i++) {
        // const _node = createDirNode({...item, nodeId: `${item.nodeId}${i}` }, color)

        const _node = createDirNode(item, { ...node!.data, item, collapsed: false });
        const edge = createEdge(node, _node, edgeOpt);
        addNodeTool(_node, dirToolOpt);
        nodes.push(_node);
        edges.push(edge);
        // }
      });
  graph.addNodes(nodes);
  graph.addEdges(edges);

  // layout3({ center: node, nodes: graph.getNodes(), edges: graph.getEdges(), rankdir })
  expandLayout({ center: node });

  console.debug(expandNode.name, performance.now() - begin);
}

/* 三级子节点 */
export function selectL3Dir(this: Graph, { node /* 当前点击结点 */, subDir }: { node: Node; subDir: SubDir }) {
  const { graph, direction, rootDir, createEdge, createDirNode, addNodeTool } = this;
  const resourceType = rootDir?.resourceType;
  let center: Node | null = null;
  const edges: Edge[] = [];
  const nodes: Node[] = [];
  const edgeOpt = { marker: { width: 4, height: 8 }, strokeWidth: 1 };

  const addNodes = (node: Node, dir: SubDir) => {
    const { item } = node.getData<NodeData>();

    if (item.children && item.children.some((item) => item.nodeId === dir.dirId)) {
      // 子目录结点
      item.children.forEach((item) => {
        const highlight = !dir.subDir && item.nodeId === dir.dirId;
        const data: DirNodeData = {
          ...node!.data,
          item,
          direction,
          resourceType,
          highlight,
          collapsed: !!dir.subDir && item.nodeId === dir.dirId,
        };
        const subNode = createDirNode(item, data);
        const edge = createEdge(node, subNode, edgeOpt);
        addNodeTool(subNode, dirToolOpt);
        nodes.push(subNode);
        edges.push(edge);

        if (dir.subDir && item.nodeId === dir.dirId) {
          center = subNode;
          addNodes(subNode, dir.subDir);
        }
      });
    }
  };
  addNodes(node, subDir);

  graph.addNodes(nodes);
  graph.addEdges(edges);

  return center;
}

export function addNodeTool(this: Graph, node: Node, options = { r: 10, fontSize: 18, x: 0, y: 5 }) {
  const { direction, collapse, expandNode, addNodeTool } = this;
  const { r, fontSize, x, y } = options;
  const { color, item, collapsed } = node.data;
  // console.debug(item, collapsed)
  let pos: object = {
    x: "100%",
    y: "50%",
  };
  if (direction === "V") {
    pos = {
      x: "50%",
      y: "100%",
      offset: { x: 0, y: 2 },
    };
  }

  node.removeTools();
  item.childSize > 0 &&
    node.addTools({
      name: "button",
      args: {
        markup: [
          {
            tagName: "circle",
            selector: "button",
            attrs: {
              r,
              stroke: color ?? "#fe854f",
              "stroke-width": 1,
              fill: "white",
              cursor: "pointer",
            },
          },
          {
            tagName: "text",
            textContent: collapsed ? "-" : "+",
            selector: "icon",
            attrs: {
              fill: color ?? "#fe854f",
              fontSize,
              "text-anchor": "middle",
              "pointer-events": "none",
              x,
              y, // icon 相对位置
            },
          },
        ],
        ...pos,
        onClick({ cell }: { cell: Cell; view: CellView }) {
          if (cell.data.collapsed) {
            // 收起
            collapse(node);
          } else {
            // 展开
            expandNode({ node });
          }
          // 展开取反
          cell.data.collapsed = !cell.data.collapsed;
          addNodeTool(cell as Node, options);
        },
      },
    });
}

export function collapse(this: Graph, node: Node) {
  const { graph, expandLayout } = this;
  const item = getNodeData(node)!.item;
  const rmSubItems = (item: DataAtlas.JsonNode) => {
    item.children &&
      item.children?.forEach((child) => {
        rmSubItems(child);
        graph.removeCell(child.nodeId);
      });
  };
  rmSubItems(item);
  // layout3({ center: node, nodes: graph.getNodes(), edges: graph.getEdges(), rankdir })
  expandLayout({ center: node });
}

// 展开收起用
// d3 tree
export function expandLayout(this: Graph, { center }: { center: Node }) {
  const { graph, direction, graphData } = this;
  if (graphData === null) return;
  const rootData = getRootData(graph, graphData[0]);
  const root = hierarchy(rootData) as Misc.Any;
  const nodeSize: [number, number] = direction === "V" ? [135, 120] : [45, 250];
  tree()
    .nodeSize(nodeSize)
    .separation((a) => {
      // console.debug(a, b)
      return a.depth === 0 ? 2 : a.depth === 1 ? 3 : 1;
    })(root);
  // console.debug(root)

  const getPos = (treeNode: HierarchyPointNode<TreeData>): [number, number] | undefined => {
    const x = treeNode.x,
      y = treeNode.y;
    if (center.id === treeNode.data.id!) {
      return direction === "V" ? [x, y] : [y, x];
    }
    let pos;
    for (const child of treeNode.children ?? []) {
      pos = getPos(child);
      if (pos !== undefined) break;
    }
    return pos;
  };
  const pos2 = getPos(root) ?? [0, 0];
  const pos1 = center.position();
  const { width, height } = center.getBBox();
  const dx = pos1.x - pos2[0] + width * 0.5;
  const dy = pos1.y - pos2[1] + height * 0.5;

  const setPos = (treeNode: HierarchyPointNode<TreeData>) => {
    // const rad = totalRadius(treeNode)
    const x = treeNode.x;
    const y = treeNode.y;
    const node = graph.getCellById(treeNode.data.id!);
    if (node.isNode()) {
      const bbox = node.getBBox();
      if (direction === "V") node.position(x - bbox.width * 0.5 + dx, y - bbox.height * 0.5 + dy);
      else node.position(y - bbox.width * 0.5 + dx, x - bbox.height * 0.5 + dy);
      treeNode.children?.forEach((child) => {
        setPos(child);
      });
    }
  };
  setPos(root);

  // graph.centerContent()
}

interface TreeData {
  id?: string;
  [key: string]: unknown;
  children: TreeData[];
}

function getRootData(graph: Graph["graph"], rootData: DataAtlas.JsonNode) {
  const getData = (nodeData: DataAtlas.JsonNode): TreeData | undefined => {
    const rootData: TreeData = { children: [] };
    const cell = graph.getCellById(nodeData.nodeId);
    if (cell) {
      rootData.id = nodeData.nodeId;
      nodeData.children?.forEach((child) => {
        const childData = getData(child);
        !!childData && rootData.children.push(childData);
      });
      return rootData;
    }
    return undefined;
  };
  return getData(rootData);
}
