import type { Graph } from "@antv/x6";
import { colorPrimary } from "@config/style";

export const graphConfig: ConstructorParameters<typeof Graph>[0] = {
  panning: {
    enabled: true,
  },
  async: true,
  // interacting: function (cellView: CellView) {
  //   // if (cellView.cell.getData() != undefined && cellView.cell.getData<NodeType>().entity === EntityTypeEnum.Table) {
  //   //   console.debug( cellView.cell.getData())
  //   //   return true
  //   // }
  //   return true
  // },
  background: {
    color: "#F2F7FA",
  },
};

export const rowHeight = 20;
export const maxRows = 8;
export const defaultWidth = 180;
export const headerHeight = 45;
// export const defaultHeight = 175
export const edgeOpacity = 1;
export const edgeStroke = "#aaaaaa80";
export const edgeHighlight = "#fdc000";
export const entityEdgeStroke = "#a1b6ee"; //'#dddddd'
export const entityEdgeLight = "#ddd";
export const fkEdgeStroke = "#c4c6c8";
export const primaryColor = colorPrimary;
export const secondaryColor = "#f8f8f8";
export const lightColor = "#EFF4FF";
export const highlight = "#ffa500";

export const lineStyle = {
  stroke: edgeStroke,
  strokeWidth: 1,
  // opacity: .5,
  targetMarker: process.env.devMode
    ? { name: "classic", args: { size: 6, /* offset: -5,  */ stroke: "#aaaaaa", fill: "#aaaaaa" } }
    : null,
};

export const zoomFit = { padding: 10, minScale: 0.5, maxScale: 1.2 };
