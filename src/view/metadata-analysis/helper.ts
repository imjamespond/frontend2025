import type { Edge, Node } from "@antv/x6";
import { edgeHighlight, entityEdgeStroke, primaryColor, secondaryColor } from "./config";
import type { Graph } from "./graph";
import { type EdgeData, EdgeType, type EntEdgeData, type FieldEdgeData, type NodeData } from "./types";

export function getNodeData(node: Node | undefined) {
  return node?.getData<Omit<NodeData, "scrollTop">>();
}

export function getEntEdgeData(edge: Edge) {
  return edge.getData<EntEdgeData>();
}
export function getEdgeData(edge: Edge) {
  return edge.getData<EdgeData>();
}

export function getFieldEdgeData(edge: Edge) {
  const data = edge.getData<FieldEdgeData>();
  if (data.type === EdgeType.Field) return data;
}

export function resetEdges(this: Graph): void {
  this.graph?.getEdges().forEach((edge) => {
    const edgeData = getEntEdgeData(edge);
    if (edgeData && edgeData.type === EdgeType.Entity) {
      edge.attr("line/stroke", entityEdgeStroke);
      edge.attr("icon/stroke", entityEdgeStroke);
    }
  });
}
export function resetNodes(this: Graph): void {
  this.graph?.getNodes().forEach((node) => {
    node.setAttrs(
      this.entryId === node.id
        ? {
            body: { fill: primaryColor, stroke: "#333" },
            label: { fill: "#fff" },
          }
        : {
            label: { fill: "#555" },
            body: { fill: secondaryColor, stroke: "#333" },
          },
    );
  });
}

export function highlighEdge(edge: Edge) {
  edge.attr("line/stroke", edgeHighlight);
  edge.attr("icon/stroke", edgeHighlight);
}
export function highlightNode(node: Node, entry: boolean): void {
  node.setAttrs(
    entry
      ? {
          label: {
            fill: "#fff",
          },
          body: {
            fill: edgeHighlight,
            stroke: edgeHighlight,
          },
        }
      : {
          body: {
            stroke: edgeHighlight,
          },
        },
  );
}

export type HighLightNodes = { [k: string]: Node };

export function highlightNodes(this: Graph, originId: string, nodes: HighLightNodes) {
  this.graph.getNodes().forEach((node) => {
    node.setData({
      highlight: node.id in nodes,
      highlightEntry: originId === node.id,
    });
  });
}

export function highlightEdges(this: Graph, edges: Edge[]) {
  this.resetEdges();
  edges.forEach((edge) => {
    // const type = edge.getData<EdgeData>();
    edge.attr("line/stroke", edgeHighlight);
    edge.attr("icon/stroke", edgeHighlight);
  });
}

export function renderPorts(this: Graph, node: Node, scrollTop?: number) {
  // node.removePorts({ silent: true }); // 删除之前的连线
  const nodeData = this.nodesMap.get(node.id);
  if (nodeData === undefined) return;
  if (scrollTop !== undefined) nodeData.scrollTop = scrollTop;
  // this.getVisiblePorts(node);
  // node.addPorts(ports); // 新增连线, 更新位置的功用
  // addDefaultPorts(node);
}

/* function addDefaultPorts(node: Node) {
  node.addPorts([
    {
      // 触发更新
      id: "hiddenPort",
      group: "gHidden",
      attrs: {
        circle: {
          r: 8,
        },
      },
    },
    {
      // 触发更新
      id: "hiddenPortR",
      group: "gHiddenR",
      attrs: {
        circle: {},
      },
    },
  ]);
} */

export function updateSelfLoopEdges(this: Graph) {
  const nodesPorts = new Map<string, { node: Node; ports: object[] }>();
  const setEdges: (() => void)[] = [];
  this.graph
    ?.getEdges()
    .filter((edge) => getEdgeData(edge).type === EdgeType.Entity)
    .forEach((edge) => {
      const sourceNode = edge.getSourceNode();
      const targetNode = edge.getTargetNode();
      if (sourceNode && targetNode && sourceNode.id === targetNode.id) {
        const nodePorts = nodesPorts.get(sourceNode.id) ?? { node: sourceNode, ports: [] };
        if (nodePorts.ports.length === 0) nodesPorts.set(sourceNode.id, nodePorts);
        const ports = nodePorts.ports;
        const srcPort = "src" + sourceNode.id + ports.length;
        const tarPort = "tar" + sourceNode.id + ports.length;
        ports.unshift({
          id: srcPort,
          group: "top",
        });
        ports.push({
          id: tarPort,
          group: "top",
        });

        setEdges.push(() => {
          edge.setSource({
            cell: sourceNode.id,
            port: srcPort,
          });
          edge.setTarget({
            cell: sourceNode.id,
            port: tarPort,
          });
        });
      }
    });

  nodesPorts.forEach(({ node, ports }) => {
    node.addPorts(ports);
  });
  setEdges.forEach((setEdge) => setEdge());
}
