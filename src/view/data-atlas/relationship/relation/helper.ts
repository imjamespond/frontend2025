import type { NodeMetadata } from "@antv/x6";
import type { NodeData, X6Node } from "./types";

export function getNodeData(node: X6Node) {
  return node.getData<NodeData>();
}

export function getLeafNode(item: NodeData) {
  return getNode(item);
}

export function getNode(item: NodeData) {
  const style = item.style ?? { fill: "#F79767", stroke: "#f36924", color: "#fff" };
  // const click = item.leaf ? { cursor: 'pointer', event: 'node:open', } : undefined
  const radius = item.nodeSize * 0.5;
  item.radius = radius;
  const circle = { cx: radius, cy: radius, r: radius };
  const node: NodeMetadata = {
    id: item.id,
    shape: "flowchart_collate",
    width: item.nodeSize,
    height: item.nodeSize,
    x: item.x,
    y: item.y,
    attrs: {
      body: {
        ...style,
        "stroke-width": `4px`,
        ...circle,
      },
      ".ring": {
        ...circle,
        r: circle.r + 5,
        fill: "transparent",
        "stroke-width": `6px`,
      },
      text: {
        text: item.label,
        fontSize: item.fontSize,
        fill: style.color,
        lineHeight: item.lineHeight ?? 0,
        // ...click,
        textWrap: {
          width: -10, // 宽度减少 10px
          height: "50%", // 高度为参照元素高度的一半
          ellipsis: true, // 文本超出显示范围时，自动添加省略号
          breakWord: true, // 是否截断单词
        },
      },
      ".__menu": {
        transform: `translate(${radius},${radius})`,
      },
      // tab1: {
      //     d: getArc(radius, 0)(),
      // },
      // tab2: {
      //     d: getArc(radius, 1)(),
      // },
      // tab3: {
      //     d: getArc(radius, 2, 0)(),
      // },
      ...item.attrs,
    },

    ...item.props,
    data: item,
  };

  return node;
}

export function getEdge(
  source: string,
  target: string,
  options = {
    line: {
      strokeWidth: 1,
      stroke: "rgb(165, 171, 182)",
      targetMarker: {
        name: "block",
        width: 5,
        height: 5,
      },
    },
  }
) {
  const color = "rgb(106, 198, 255)";
  const shape = "shadow-edge";
  return {
    source: { cell: source, anchor: "nodeCenter" },
    target: { cell: target, anchor: "nodeCenter" },
    attrs: {
      line: {
        ...options.line,

        sourceMarker: {
          fill: "none",
        },
      },
      shadow: {
        refX: 0,
        refY: 0,
        stroke: color,
        strokeWidth: 12,
        strokeOpacity: 0,
        targetMarker: {
          fill: "none",
        },
        sourceMarker: {
          fill: "none",
        },
        class: "outline",
      },
    },
    shape,
    zIndex: 99,
  };
}
