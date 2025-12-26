import { Graph } from "@antv/x6";
import { colorPrimary, colorSecodary } from "@config/style";
import { labels, type OrgStyle } from "./types";

type NodeType = "lt" | "lb" | "rt" | "rb";


export const config = {
  x: 600,
  y: 120,
  node: {
    width: 200,
    height: 50,
  },
  root: {
    width: 200,
    height: 200,
  },
  block: {
    width: 400,
    height: 150,
  },
};

const marginX = 20,
  marginY = 100;

const rx = config.x,
  lx = -config.x - config.node.width;
const ty = -config.y - config.node.height,
  by = config.y;

const edgeConfig = {
  lx: -config.x - config.node.width * 0.5,
  rx: config.x + config.node.width * 0.5,
  x1: 100,
  y: 50,
};

export const LTOrg: OrgStyle = {
  label: labels.digitalConsumer,
  class: "__block__",
  color: colorSecodary,
  size: {
    ...config.block,
    boxWidth: 0,
    boxHeight: 0,
    boxMaxHeight: 0,
  },
  marginX,
  marginY,
  cols: 3,
  maxRows: 3,
  minRows: 2,
  nodeMeta: {
    width: config.node.width,
    height: config.node.height,
    x: lx,
    y: ty,
  },
  edgeMeta: {
    vertices: [
      {
        x: -edgeConfig.x1,
        y: 0,
      },
      {
        x: -edgeConfig.x1,
        y: -edgeConfig.y,
      },
      {
        x: edgeConfig.lx,
        y: -edgeConfig.y,
      },
    ],
  },
};

export const RTOrg: OrgStyle = {
  label: labels.functionUnits,
  class: "__block__",
  color: colorSecodary,
  size: {
    ...config.block,
    boxWidth: 0,
    boxHeight: 0,
    boxMaxHeight: 0,
  },
  marginX,
  marginY,
  cols: 3,
  maxRows: 3,
  minRows: 2,
  nodeMeta: {
    width: config.node.width,
    height: config.node.height,
    x: rx,
    y: ty,
  },
  edgeMeta: {
    vertices: [
      {
        x: edgeConfig.x1,
        y: 0,
      },
      {
        x: edgeConfig.x1,
        y: -edgeConfig.y,
      },
      {
        x: edgeConfig.rx,
        y: -edgeConfig.y,
      },
    ],
  },
};

export const LBOrg: OrgStyle = {
  label: labels.common,
  class: "__block__",
  color: colorSecodary,
  size: {
    ...config.block,
    boxWidth: 0,
    boxHeight: 0,
    boxMaxHeight: 0,
  },
  marginX,
  marginY,
  cols: 3,
  maxRows: 3,
  minRows: 2,
  nodeMeta: {
    x: lx,
    y: by,
    width: config.node.width,
    height: config.node.height,
  },
  edgeMeta: {
    vertices: [
      {
        x: -edgeConfig.x1,
        y: 0,
      },
      {
        x: -edgeConfig.x1,
        y: edgeConfig.y,
      },
      {
        x: edgeConfig.lx,
        y: edgeConfig.y,
      },
    ],
  },
};

export const RBOrg: OrgStyle = {
  label: labels.digitalOperation,
  class: "__block__",
  color: colorSecodary,
  size: {
    ...config.block,
    boxWidth: 0,
    boxHeight: 0,
    boxMaxHeight: 0,
  },
  marginX,
  marginY,
  cols: 3,
  maxRows: 3,
  minRows: 2,
  nodeMeta: {
    x: rx,
    y: by,
    width: config.node.width,
    height: config.node.height,
  },
  edgeMeta: {
    vertices: [
      {
        x: edgeConfig.x1,
        y: 0,
      },
      {
        x: edgeConfig.x1,
        y: edgeConfig.y,
      },
      {
        x: edgeConfig.rx,
        y: edgeConfig.y,
      },
    ],
  },
};

export function AddNodes(graph: Graph) {
  const rootColor = colorPrimary;
  // root
  const root = graph.addNode({
    id: "root",
    shape: "circle",
    x: 0,
    y: 0,
    width: config.root.width,
    height: config.root.height,
    attrs: {
      ring1: {
        fill: rootColor,
        stroke: "none",
        r: 60,
        cx: 100,
        cy: 100,
      },
      ring2: {
        fill: rootColor,
        stroke: "none",
        r: 70,
        cx: 100,
        cy: 100,
        opacity: 0.5,
      },
      ring3: {
        fill: rootColor,
        stroke: "none",
        r: 80,
        cx: 100,
        cy: 100,
        opacity: 0.2,
      },
      text: {
        text: "资产\n目录",
        fill: "#fff",
        fontSize: 24,
        letterSpacing: 3,
        lineHeight: 32,
      },
    },
    markup: [
      {
        tagName: "circle",
        selector: "ring3",
      },
      {
        tagName: "circle",
        selector: "ring2",
      },
      {
        tagName: "circle",
        selector: "ring1",
      },
      {
        tagName: "text",
        selector: "text",
      },
    ],
    ports: rootPorts,
  });
  const rootBBox = root.getBBox();
  const { width, height } = rootBBox;
  root.setPosition({ x: -width * 0.5, y: -height * 0.5 });
  // const rootHalfWidth = root.getBBox().height * .5

  /**
   * L1 nodes
   */
  const addL1Node = ({ style, port }: { style: OrgStyle; port: NodeType }) => {
    const node = graph.createNode({
      shape: "rect",
      ...style.nodeMeta,
      label: style.label,
      attrs: {
        body: {
          fill: colorPrimary, // style.color,
          rx: 5,
          ry: 5,
          strokeWidth: 0,
        },
        text: {
          fontSize: 18,
          fill: "#fff",
        },
      },
      ports,
    });
    const edge = graph.createEdge({
      target: { cell: node, port: port === "lb" || port === "rb" ? "tp" : "bp" },
      source: { cell: root, port },
      ...style.edgeMeta,
      // router: 'orth',
      connector: {
        name: "rounded",
        args: {
          radius: 10,
        },
      },
      attrs: {
        line: {
          stroke: style.color,
          strokeWidth: 2,
          targetMarker: {
            name: "block",
            width: 8,
            height: 16,
          },
          sourceMarker: null,
        },
      },
    });

    root.addChild(node);
    root.addChild(edge);

    return { node, edge };
  };

  const rt = addL1Node({ style: RTOrg, port: "rt" });
  const rb = addL1Node({ style: RBOrg, port: "rb" });
  const lt = addL1Node({ style: LTOrg, port: "lt" });
  const lb = addL1Node({ style: LBOrg, port: "lb" });

  return { root, rt, rb, lt, lb };
}

const rootPorts = {
  groups: {
    left: {
      attrs: {
        circle: {
          r: 0,
        },
      },
      position: {
        name: "absolute",
      },
    },
    right: {
      attrs: {
        circle: {
          r: 0,
        },
      },
      position: {
        name: "absolute",
      },
    },
  },
  items: [
    {
      id: "lt",
      group: "left",
      args: {
        x: 20,
        y: config.root.height / 2 - 0,
      },
    },
    {
      id: "lb",
      group: "left",
      args: {
        x: 20,
        y: config.root.height / 2 + 0,
      },
    },
    {
      id: "rt",
      group: "right",
      args: {
        x: config.root.width - 20,
        y: config.root.height / 2 - 0,
      },
    },
    {
      id: "rb",
      group: "right",
      args: {
        x: config.root.width - 20,
        y: config.root.height / 2 + 0,
      },
    },
  ],
};

const ports = {
  groups: {
    top: {
      attrs: {
        circle: {
          r: 0,
          // magnet: true,
          // stroke: '#31d0c6',
          // strokeWidth: 2,
          // fill: '#fff',
        },
        // text: {
        //   fontSize: 12,
        //   fill: '#888',
        // },
      },
      // 文档：https://x6.antv.vision/zh/docs/api/registry/port-layout#left-right-top-bottom
      position: {
        name: "top",
      },
    },
    bottom: {
      attrs: {
        circle: {
          r: 0,
        },
      },
      position: {
        name: "bottom",
      },
    },
  },
  items: [
    {
      id: "tp",
      group: "top",
    },
    {
      id: "bp",
      group: "bottom",
    },
  ],
};
