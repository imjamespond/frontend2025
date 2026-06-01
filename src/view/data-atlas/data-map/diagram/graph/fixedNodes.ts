import type { Graph } from "@antv/x6";
import { colorPrimary } from "@config/style";
import { labels, type OrgStyle } from "./types";

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

export const LeftOrg: OrgStyle = {
  label: labels.innerSource,
  type: 1,
  class: "__left__",
  color: "#316bcd",
  size: {
    width: 505,
    height: 105,
    boxWidth: 0,
    boxHeight: 0,
    boxMaxHeight: 0,
  },
  cols: 3,
  minRows: 2,
  midRows: 2,
  maxRows: 2,
};

export const RightOrg: OrgStyle = {
  label: labels.outerSource,
  type: 1,
  class: "__right__",
  color: "#4f99f7",
  size: {
    width: 505,
    height: 105,
    boxWidth: 0,
    boxHeight: 0,
    boxMaxHeight: 0,
  },
  cols: 3,
  minRows: 2,
  midRows: 2,
  maxRows: 2,
};

export const BottomOrg: OrgStyle = {
  label: labels.dataAsset,
  type: 0,
  class: "__bottom__",
  color: colorPrimary,
  size: {
    width: 388,
    height: 160,
    boxWidth: 0,
    boxHeight: 0,
    boxMaxHeight: 0,
  },
  ranksep: 80,
  nodesep: 20,
  cols: 3,
  maxRows: 3,
  minRows: 3,
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
  });
  const rootBBox = root.getBBox();
  const { width, height } = rootBBox;

  root.setPosition({ x: -width * 0.5, y: -height * 0.5 });

  const bottomPos = { x: -40, y: -200 };

  const bottom = root;

  return { root, bottom, bottomPos };
}
