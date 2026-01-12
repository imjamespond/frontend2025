import { getStyle } from "@config/style";
import type { Graph } from "./graph";
import { getEdge, getL3Node, getNode } from "./helper";
import type { NodeData } from "./types";
// import { Node } from "@antv/x6";
// import type { SubDir } from "../../helper";

// export type C = { spNode: Node; children: Node[] };
export function draw1(this: Graph) {
  const { graph, graphData, entryId } = this;
  const style = getStyle(undefined, 0);
  if (!graphData || graphData.length < 1) {
    console.error("invalid graphData...");
    return;
  }
  // graph.setAsync(true)
  // graph.freeze()
  // 根结点
  const rootData = graphData[0];
  const root: NodeData = {
    id: rootData.nodeId,
    nodeSize: 100,
    fontSize: 16,
    x: 0,
    y: 0,
    // lineHeight: 20,
    label: `${rootData.text}`,
    amount: rootData.dataAssetAndSubDirCount,
    data: rootData,
    style,
  };
  graph.addNode(getNode(root));

  const nodes: NodeData[] = [root];
  // const categories: C[] = [];

  rootData.children?.forEach((category) => {
    const { text, nodeId, children, dataAssetAndSubDirCount } = category;

    // 二级结点
    // const angle = (i / rootData?.children!.length) * Math.PI * 2 + anglePad + Math.random() * 0.25 - 0.125;
    const node: NodeData = {
      id: nodeId,
      nodeSize: 60,
      fontSize: 10,
      x: 0,
      y: 0,
      // lineHeight: 20,
      label: `${text}`,
      amount: dataAssetAndSubDirCount,
      data: category,
      style,
    };
    nodes.push(node);
    // const spNode =
    graph.addNode(getNode(node)); // 先让上层结点发散
    const _edge = getEdge(root.id, node.id, {
      line: {
        strokeWidth: 1.5,
        stroke: "rgb(165, 171, 182)",
        targetMarker: {
          name: "block",
          width: 10,
          height: 10,
        },
      },
    });
    graph.addEdge(_edge);

    // const c: C = { spNode, children: [] };
    // categories.push(c);

    // const hasEntry = children?.some(({nodeId})=>entryId === nodeId)
    // const color = '#d4d8d8' //hasEntry ? getColors(1): getColors(0)
    // 三级结点, 只展示有入口结点的
    if (
      children?.some((child) => {
        const { nodeId } = child;
        return entryId === nodeId;
      })
    ) {
      children?.forEach((child) => {
        const { nodeId, text, childSize } = child;
        !nodeId && console.error("nodeId is null!");

        const isEntry = entryId === nodeId;
        const fill = getStyle(isEntry, childSize);
        const _node = getL3Node(nodeId, text, child, fill);
        nodes.push(_node);
        // const childNode =
        graph.addNode(getNode(_node));
        const _edge = getEdge(node.id, _node.id);
        graph.addEdge(_edge);

        // c.children.push(childNode);
      });
    }
  });
}

export function draw2(this: Graph) {
  /* const { graph, graphData, rootDir, style } = this;
  if (!graphData || graphData.length < 1) {
    console.error("invalid graphData...");
    return;
  }
  // graph.setAsync(true)
  // graph.freeze()
  // 根结点
  const rootData = graphData[0];
  const root: NodeData = {
    id: rootData.nodeId,
    nodeSize: 120,
    radius: 0,
    fontSize: "16px",
    x: 0,
    y: 0,
    lineHeight: 20,
    label: `${rootData.text}\n${rootData.dataAssetAndSubDirCount}`,
    data: rootData,
    style,
  };
  graph.addNode(getNode(root));
  const links: unknown[] = [];
  const nodes: NodeData[] = [root];
  // const categories: C[] = [];

  const anglePad = 2;
  rootData.children?.forEach((category, i: number) => {
    const { text, nodeId, children, dataAssetAndSubDirCount } = category;

    // 二级结点
    const angle = (i / rootData?.children!.length) * Math.PI * 2 + anglePad + Math.random() * 0.25 - 0.125;
    const node: NodeData = {
      id: nodeId,
      nodeSize: 100,
      radius: 0,
      fontSize: "14px",
      x: Math.cos(angle) * 500,
      y: Math.sin(angle) * 500,
      lineHeight: 20,
      label: `${text}\n${dataAssetAndSubDirCount}`,
      data: category,
      style,
    };
    nodes.push(node);
    const spNode = graph.addNode(getNode(node)); // 先让上层结点发散
    const link = { source: root, target: node };
    links.push(link);
    const _edge = getEdge(root.id, node.id, {
      line: {
        strokeWidth: 2,
        stroke: "rgb(165, 171, 182)",
        targetMarker: {
          name: "block",
          width: 10,
          height: 10,
        },
      },
    });
    graph.addEdge(_edge);

    // const c: C = { spNode, children: [] };
    // categories.push(c);
    type NodeCfg = typeof node;

    // 三级结点, 只展示有入口结点的
    const addSubNodes = (dir: SubDir, pNode: NodeCfg, children?: GraphData | null) => {
      const xy = { x: pNode.x + Math.cos(angle) * 300, y: pNode.y + Math.sin(angle) * 300 };
      const entryId = dir.dirId;
      if (children?.some((child) => entryId === child.nodeId)) {
        children?.forEach((child) => {
          const { nodeId, text, childSize } = child;
          !nodeId && console.error("nodeId is null!");

          const isEntry = entryId === nodeId && !dir.subDir;
          const fill = getColor(isEntry, childSize);
          const _node: NodeData = {
            id: nodeId,
            nodeSize: 50,
            radius: 25,
            fontSize: "10px",
            x: xy.x - 100 * Math.random(),
            y: xy.y - 100 * Math.random(),
            data: child,
            label: `${text}`,
            leaf: true,
            style: { ...fill, color: "#2A2C34" },
          };
          nodes.push(_node);
          const childNode = graph.addNode(graph.createNode(getNode(_node)));
          const link = { source: pNode, target: _node };
          links.push(link);
          const _edge = getEdge(pNode.id, _node.id);
          graph.addEdge(_edge);

          // c.children.push(childNode)

          dir.subDir && addSubNodes(dir.subDir, _node as unknown as NodeCfg, child.children);
        });
      }
    };

    if (rootDir === null) return;
    addSubNodes(rootDir, node, children);
  }); */
}
