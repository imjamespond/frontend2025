import { Graph, type Point } from "@antv/x6";

export interface Port {
  id: string;
  group: string;
  // index?: number
  args: { offset: number }; // unknown;
  // sourceId?: string
  // targetId?: string
}

export type PortArgs = Misc.Any;

function layout(portsArgs: PortArgs[], p1: Point, groupArgs: PortArgs) {
  return portsArgs.map(({ offset, ...others }) => {
    // const p = p1.clone().translate(0, 0)
    const p = p1.clone().translate(0, offset || groupArgs.offset || 0);
    if (others.dx || others.dy) {
      p.translate(others.dx || 0, others.dy || 0);
    }
    return {
      angle: 0,
      position: p.toJSON(),
      ...others,
    };
  });
}

Graph.registerPortLayout(
  "table-layout",
  (portsArgs, elemBBox /* _groupArgs */) => {
    return portsArgs.map(({ /* offset, */ ...others }) => ({
      angle: 0,
      position: elemBBox.getTopLeft().clone().translate(0, 0).toJSON(),
      ...others,
    }));
  },
  true,
);

Graph.registerPortLayout(
  "col-layout",
  (portsArgs, elemBBox, groupArgs) => {
    const point = elemBBox.getTopLeft();
    return layout(portsArgs, point, groupArgs);
  },
  true,
);

Graph.registerPortLayout(
  "col-layout-r",
  (portsArgs, elemBBox, groupArgs) => {
    const point = elemBBox.getTopRight();
    // point.x += 5
    return layout(portsArgs, point, groupArgs);
  },
  true,
);

Graph.registerPortLayout("hidden-layout", (portsPositionArgs /* _elemBBox */) => {
  return portsPositionArgs.map(() => {
    return { position: { x: 0, y: 30 }, angle: 0 }; // 相对node位置
  });
});

Graph.registerPortLayout("hidden-layout-r", (portsPositionArgs, elemBBox) => {
  return portsPositionArgs.map(() => {
    const point = elemBBox.getTopRight();
    return { position: { x: point.x, y: 30 }, angle: 0 };
  });
});

// 定义锚点
export function getPortGroups(args?: { portVisible?: boolean }) {
  return {
    // 分组
    groups: {
      top: {
        position: {
          name: "top",
        },
        markup: [
          {
            tagName: "circle",
            // attrs: {
            //   magnet: "false",
            //   fill: "none",
            //   stroke: "transparent",
            // },
          },
        ],
      },
      gCol: {
        position: "col-layout",
        markup: getPortMarkup(args?.portVisible),
      },
      gColR: {
        position: "col-layout-r",
        markup: getPortMarkup(args?.portVisible),
      },
      gTable: {
        position: "table-layout",
      },
      gHidden: {
        position: "hidden-layout",
        markup: [
          {
            tagName: "circle",
            attrs: {
              magnet: "false",
              fill: "none",
              stroke: "transparent",
              // r: 8,
              // stroke: '#31d0c6',
              // fill: '#fff',
              // strokeWidth: 2,
            },
          },
        ],
      },
      gHiddenR: {
        position: "hidden-layout-r",
        markup: [
          {
            tagName: "circle",
            attrs: {
              magnet: "false",
              fill: "none",
              stroke: "transparent",
              // r: 8,
              // stroke: '#31d0c6',
              // fill: '#fff',
              // strokeWidth: 2,
            },
          },
        ],
      },
    },
  };
}

function getPortMarkup(visible?: boolean) {
  return [
    {
      tagName: "circle",
      attrs: visible
        ? {
            r: 4,
            magnet: "true", // not connetable
            stroke: "#B4BDCF",
            fill: "#fff",
            strokeWidth: 1.5,
            style: "visibility: hidden;",
            // opacity: .5
          }
        : {
            magnet: "false",
            // r: 4,
            // stroke: '#B4BDCF',
            // fill: '#fff',
            // strokeWidth: 1.5,
          },
    },
  ];
}
