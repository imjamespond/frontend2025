import { colorPrimary } from "@config/style";
import type { Style } from "../types";
import type { Graph } from ".";

export const TBStyle: Style = {
  type: 0,
  color: colorPrimary,
  size: {
    width: 400,
    height: 255,
    boxWidth: 0,
    boxHeight: 0,
    boxMaxHeight: 0,
  },
  ranksep: 50,
  nodesep: 130,
  cols: 2,
  maxRows: 6,
  minRows: 6,
};

export const LRStyle: Style = {
  type: 0,
  color: colorPrimary,
  size: {
    width: 800,
    height: 95,
    boxWidth: 0,
    boxHeight: 0,
    boxMaxHeight: 0,
  },
  ranksep: 100,
  nodesep: 50,
  cols: 6,
  maxRows: 2,
  minRows: 2,
};

export function AddNodes(this: Graph, { text, id }: { text: string; [x: string]: unknown }) {
  const { graph, direction } = this;
  const treeText =
    direction === "H"
      ? {
          style: { "writing-mode": "tb" },
          letterSpacing: 3,
        }
      : undefined;

  const size = text.length > 8 ? 300 : 200;

  const treeRect =
    direction === "H"
      ? {
          width: 50,
          height: size,
        }
      : {
          width: size,
          height: 50,
        };

  const node = graph.addNode({
    id: id as string, //: 'root-node',
    shape: "rect",
    ...treeRect,
    attrs: {
      body: {
        // fill: 'rgba(61, 111, 203, 1)',
        fill: colorPrimary,
        rx: 5,
        ry: 5,
        stroke: "none",
        // strokeWidth: 1
      },
      text: {
        text: text ? `${text}` : "默认名称",
        fill: "#fff",
        fontSize: 18,
        ...treeText,
      },
    },
  });

  return { node };
}
