import { DataUri, Export } from "@antv/x6";
import type { ExportToImageOptions } from "@antv/x6/lib/plugin/export/type";
import { BaseGraph, createUseGraph } from "@components/graph";
import { debounceTime, filter } from "rxjs";
import { highlightNodesAndEdges } from "./common/highlight";
import { elk_layout } from "./common/layout";
import { GraphActionType, GraphSubject } from "./common/subject";
import { update_ports } from "./common/updatePorts";
import { ElkConfigs } from "./config/elk";
import {
  handleNodeClick,
  handleNodeMouseEnter,
  handleNodeMouseLeave,
  handleNodeMoved,
  handleNodeMoving,
} from "./event";
import { format } from "./format";
import { highlightEdges, highlightNodes, renderPorts, resetEdges, resetNodes, updateSelfLoopEdges } from "./helper";
import { type GraphData, GraphType, type NodesMap } from "./types";
import "./config/node";
import "./config/edge";
import { getVisiblePorts } from "./common/visiblePorts";
import { zoomFit } from "./config";

export class Graph extends BaseGraph {
  graphId = 0;
  graphType = GraphType.Entity;
  highlightId: string | undefined;
  entryId: string | undefined;

  elkConfig: keyof typeof ElkConfigs | undefined = undefined;
  collapsed = false;
  nodeHovering = false;

  hasTools?: boolean;

  // fieldsMap: FieldsMap = new Map(); // 设置port时用
  nodesMap: NodesMap = new Map(); // format时用
  // edgesMap: EdgesMap = {}; // edge 两端绝对定位无node

  // 1. 处理高亮：即时、不防抖
  $subHighlight = GraphSubject.pipe(filter((act) => act.type === GraphActionType.Highlight)).subscribe((act) =>
    this.highlight(act.payload),
  );

  // 2. 处理渲染：需要防抖
  $subRenderPorts = GraphSubject.pipe(
    filter((act) => act.type === GraphActionType.RenderPorts),
    debounceTime(500),
  ).subscribe((act) => {
    this.renderPorts(act.payload.node, act.payload.scrollTop);
  });

  highlightNodes = highlightNodes;
  highlightEdges = highlightEdges;

  format = format.bind(this);
  elkLayout = elk_layout.bind(this);
  updatePorts = update_ports.bind(this);
  updateSelfLoopEdges = updateSelfLoopEdges.bind(this);
  highlight = highlightNodesAndEdges.bind(this);
  getVisiblePorts = getVisiblePorts.bind(this);

  renderPorts = renderPorts.bind(this);

  resetNodes = resetNodes.bind(this);
  resetEdges = resetEdges.bind(this);

  handleNodeMoved = handleNodeMoved.bind(this);
  handleNodeMouseLeave = handleNodeMouseLeave.bind(this);
  handleNodeMouseEnter = handleNodeMouseEnter.bind(this);
  handleNodeMoving = handleNodeMoving.bind(this);
  handleNodeClick = handleNodeClick.bind(this);

  setupEvents() {
    this.handleNodeMoved();
    this.handleNodeMouseLeave();
    this.handleNodeMouseEnter();
    this.handleNodeMoving();
    this.handleNodeClick();
  }

  init() {
    this.graph.use(new Export());
    this.setupEvents();
  }

  dispose() {
    this.$subHighlight.unsubscribe();
    this.$subRenderPorts.unsubscribe();
    super.dispose();
  }

  async render(graphData: GraphData) {
    const { nodes, edges } = this.format(graphData);
    // formatFieldEdges() // 另外更新不copy到nodeData属性

    if (nodes.length) {
      const elk = this.elkConfig ? ElkConfigs[this.elkConfig] : undefined;
      await this.elkLayout([...nodes], [...edges], {
        mx: this.collapsed ? "100" : "150",
        my: this.collapsed ? "30" : "100",
        edgepy: 5,
        portAlign: "BEGIN",
        nodePorts: true,
        elk: {
          ...elk,
          "spacing.nodeSelfLoop": "0",
          "spacing.componentComponent": this.collapsed ? "30f" : "80f", // 单独个体间距
        },
      }).then(() => {
        this.graph.addNodes(nodes);
        this.graph.addEdges(edges);
        this.updateSelfLoopEdges();
        // if (this.collapsed === false) {
        //   this.renderPorts(nodes);
        // }
        this.zoomToFit();
      });
    }
  }

  zoomToFit() {
    this.graph.zoomToFit(zoomFit);
    this.graph.centerContent();
  }

  getSize(id: string) {
    const cell = this.graph?.getCellById(id);
    if (cell) {
      const bbox = cell.getBBox();
      return bbox;
    }
    return { width: 0, height: 0 };
  }

  exportImage(options?: ExportToImageOptions | undefined) {
    this.graph?.toPNG(
      (dataUri: string) => {
        DataUri.downloadDataUri(dataUri, "chart.png");
      },
      { padding: 10, preserveDimensions: true, copyStyles: true, ...options },
    );
  }

  reset() {
    // this.fieldsMap.clear();
    // this.edgesMap = {};
    this.nodesMap.clear();
    this.graph.resetCells([]);
  }

  // addEdgesMap(edgeId: string, src: string, tar: string) {
  //   this.edgesMap[src] ??= { outgoings: [], incomings: [] };
  //   this.edgesMap[tar] ??= { outgoings: [], incomings: [] };
  //   const source = this.edgesMap[src];
  //   const target = this.edgesMap[tar];
  //   source.outgoings.push({ edgeId, nodeId: tar });
  //   target.incomings.push({ edgeId, nodeId: src });
  // }
}

export const useGraph = createUseGraph(Graph, {
  grid: undefined,
  panning: {
    enabled: true,
  },
  virtual: true,
  mousewheel: {
    enabled: true,
    zoomAtMousePosition: true,
    modifiers: "ctrl",
    minScale: 0.5,
    maxScale: 2,
  },
});
