import { type Edge, type EdgeBaseOptions, type Node, Shape } from "@antv/x6";
import { kmDebug } from "@common/misc";
import { getPortId, getPortRId } from "./common";
import { tools } from "./common/node";
import { defaultWidth, entityEdgeStroke, headerHeight, maxRows, primaryColor, rowHeight } from "./config";
import { getPortGroups } from "./config/port";
import type { Graph } from "./graph";
import type { EntEdgeData, FieldEdgeData, GraphData, NodeData } from "./types";
import { EdgeType, GraphType } from "./types";

export function format(this: Graph, graphData: GraphData) {
  const { links } = graphData;

  const nodes: Node[] = [];
  const edges: Edge[] = [];

  /* 遍历结点 */
  graphData.nodes.forEach((data) => {
    // 判断没有node
    if (this.graph?.hasCell(data.id) === false) {
      const node = formatNode(this, data, graphData.analysisType);
      if (node) {
        nodes.push(node);
      }
    }

    // 取每个表 相关的 连线
    links[data.id]?.forEach((link) => {
      const edgeData = formatEntEdgeData(this, link);
      edges.push(edgeData);
    });
  });
  // calcPadding(edges)
  kmDebug("format", nodes, edges);

  return { nodes, edges };
}
export function formatNode(graph: Graph, data: NodeData["data"], analysisType: string): Node | undefined {
  if (graph.nodesMap.get(data.id) === undefined) {
    const nodesMap = graph.nodesMap;

    const nodeData: NodeData = {
      analysisType,
      graphId: graph.graphId,
      graphType: graph.graphType,
      height: 0,
      defaultHeight: 0,
      scrollTop: 0,
      data,
      width: 0,
      totalHeight: 0,
      scrollTopMax: 0,
    };
    nodesMap.set(data.id, nodeData);

    const len = data.fields.length ?? 0;
    const rows = len > maxRows ? maxRows : len;
    const maxHeight = rows * rowHeight;

    const totalHeight = len * rowHeight;
    nodeData.totalHeight = totalHeight;
    nodeData.defaultHeight = totalHeight > maxHeight ? maxHeight : totalHeight;
    nodeData.height = nodeData.defaultHeight;
    nodeData.scrollTopMax = totalHeight < maxHeight ? 0 : totalHeight - maxHeight;

    const node = graph.graph.createNode({
      shape: "entity",
      id: data.id,
      x: -1000,
      y: -1000,
      zIndex: 10,
      width: defaultWidth,
      height: (graph.collapsed ? 0 : nodeData.height) + headerHeight,
      attrs: {
        body: {},
      },
      ports: {
        ...getPortGroups(),
      },
      tools: graph.hasTools === false ? undefined : tools,
      data: nodeData, // Note that it will deep copy data and pass into the node
    });
    return node;
  } else {
    console.error("node exited", data.id);
  }
}

/**
 * 关联
 * @param graph
 * @param data
 */
/* function formatNodePorts(id: string) {
  const port: Port = {
    id: getPortId(id),
    group: "gCol",
    args: { offset: 0 },
  };
  const portR: Port = {
    id: getPortRId(id),
    group: "gColR",
    args: { offset: 0 },
  };

  return { port, portR };
} */

export function formatEntEdgeData(graph: Graph, data: EntEdgeData["data"]) {
  const { target, source } = data;

  let label;
  if (data.jobName && data.jobName.length > 0) {
    const jobName = data.jobName;
    const labels = jobName.split(",");
    label = {
      attrs: {
        label: {
          text: labels.join("\n") /* (data.jobName).replace(/,/g, '\n'), */,
          fill: "#fff",
          fontSize: 11,
          textAnchor: "middle",
          textVerticalAnchor: "middle",
          pointerEvents: "none",
          style: { display: "none" },
          refY: -10 - 5.5 * labels.length,
        },
        body: {
          ref: "label",
          fill: primaryColor,
          rx: 2,
          ry: 2,
          refWidth: "102%",
          refHeight: "102%",
          refX: "-1%",
          refY: "-1%",
        },
      },
    };
  }
  const edgeData: EntEdgeData = {
    type: EdgeType.Entity,
    data,
  };
  const edgeMeta: EdgeBaseOptions = {
    // id: getEdgeId(source, target), //nanoid(10),
    label,
    data: edgeData,
    // router,
    // router: {
    //   name: "oneSide",
    //   args: { side: "right" },
    // },
    connector: {
      name: "rounded",
      args: {
        radius: 5,
      },
    },
    attrs: {
      line: {
        stroke: /* ctx.defaultHeight > 0 ? 'none' :  */ entityEdgeStroke,
        strokeWidth: 1,
        opacity: 1,
        targetMarker: { name: "classic", width: 5, height: 5 },
        // sourceMarker: { name: 'classic', width: 6, height: 6, }
      },
    },
    visible: graph.graphType === GraphType.Field ? false : true,
    // 连线 关联 锚点
    target: {
      cell: target,
    },
    source: {
      cell: source,
    },
  };

  return new Shape.Edge(edgeMeta);
}

export function formatFieldEdges(this: Graph, graphData: GraphData) {
  const { links } = graphData;

  const edges: Edge[] = [];

  /* 遍历结点 */
  graphData.nodes.forEach((data) => {
    data.fields.forEach((field) => {
      links[field.id]?.forEach((link) => {
        const edgeData = formatFieldEdgeData(link);
        edges.push(edgeData);
      });
    });
  });
  // calcPadding(edges)
  kmDebug("format", edges);

  return edges;
}

export function formatFieldEdgeData(data: FieldEdgeData["data"]) {
  const { sModelId, tModelId, source, target } = data;

  const label = data.jobName;

  const sPort = getPortId(source);
  const tPort = getPortId(target);
  const sPortR = getPortRId(source);
  const tPortR = getPortRId(target);

  const edgeData: FieldEdgeData = {
    type: EdgeType.Field,
    data,
    sNodeId: sModelId,
    tNodeId: tModelId,
    source,
    target,
    sPort,
    tPort,
    sPortR,
    tPortR,
  };
  const edgeMeta: EdgeBaseOptions = {
    // id: getEdgeId(source, target), //nanoid(10),
    label,
    data: edgeData,
    // router,
    // router: {
    //   name: "oneSide",
    //   args: { side: "right" },
    // },
    connector: {
      name: "rounded",
      args: {
        radius: 5,
      },
    },
    attrs: {
      line: {
        stroke: /* ctx.defaultHeight > 0 ? 'none' :  */ entityEdgeStroke,
        strokeWidth: 1,
        opacity: 1,
        targetMarker: { name: "classic", width: 5, height: 5 },
        // sourceMarker: { name: 'classic', width: 6, height: 6, }
      },
    },
    visible: false, // graph.graphType === GraphType.Field ? false : true,
    // 连线 关联 锚点
    target: {
      cell: tModelId,
    },
    source: {
      cell: sModelId,
    },
  };

  return new Shape.Edge(edgeMeta);
}

export function getEdgeId(s: string, t: string) {
  return `${s}-${t}`;
}
