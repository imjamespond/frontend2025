import { Graph } from "@antv/x6";
import { entityEdgeStroke } from ".";

function getCross(self?: boolean) {
  if (self === true) return "M 0 0 -10 -5 M 0 0 -10 5 M 0 0 -10 0";
  if (self === false) return "M 0 0 10 -5 M 0 0 10 5 M 0 0 10 0";
  return "";
}

function getCircle(self?: boolean) {
  if (self === true) return "M -1 0 a 3 3 0 1 1 0 -.1";
  if (self === false) return "M 1 0 a 3 3 0 1 1 0 .1";
  return "";
}

export function getIcon(source: boolean, type: number) {
  const divider = (type & 1) > 0 ? "M 0 -6 0 6" : "";
  const cross = (type & 2) > 0 ? getCross(source) : "";
  const circle = (type & 4) > 0 ? getCircle(!source) : "";
  return {
    d: `${cross} ${divider} ${circle}`,
    fill: "#fff",
    pointerEvents: "none",
  };
}

export function getJoint(cross: boolean) {
  const body = {
    tagName: "rect",
    selector: "body",
  };
  return cross
    ? [
        body,
        {
          tagName: "path",
          selector: "semicircle",
          attrs: {
            d: "M 0 40 a 40 40 0 1 1 80 .0z",
          },
        },
        {
          tagName: "path",
          selector: "cross",
          attrs: {
            d: "M 30 10 50 30 M 50 10 30 30",
          },
        },
      ]
    : [
        body,
        {
          tagName: "path",
          selector: "semicircle",
          attrs: {
            d: "M 0 40 a 40 40 0 1 1 80 .0z",
          },
        },
      ];
}

Graph.registerEdge("er", {
  markup: [
    {
      tagName: "path",
      selector: "line",
      attrs: {
        fill: "none",
        cursor: "pointer",
        // 'pointer-events': 'none',
      },
    },
    {
      tagName: "path",
      groupSelector: "icon",
      selector: "icon1",
    },
    {
      tagName: "path",
      groupSelector: "icon",
      selector: "icon2",
    },
  ],

  attrs: {
    line: {
      connection: true,
      stroke: entityEdgeStroke,
      strokeWidth: 1,
      targetMarker: null,
    },
    icon: {
      stroke: entityEdgeStroke,
      strokeWidth: 1,
    },
    icon1: {
      atConnectionLengthKeepGradient: 10,
    },
    icon2: {
      atConnectionLengthKeepGradient: -10,
    },
  },
});
