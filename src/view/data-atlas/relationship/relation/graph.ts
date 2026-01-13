import { BaseGraph, createUseGraph } from "@common/graph";
import { Selection } from "@antv/x6";
import type { GraphData, NodeModel, RelationshipModel } from "./types";
import { zoomFit } from "../tree-org/config";
import { draw1, draw2 } from "./draw";
import type { SubDir } from "../../helper";
import "./register";
import { ForceSimulation } from "./d3/ForceSimulation";
import { getNodeData } from "./helper";
import {
  deSelectNode,
  handleBlankClick,
  handleNodeClick,
  handleNodeContextMenu,
  handleNodeHover,
  handleNodeMove,
  handleNodeMoved,
  handleNodeMoving,
} from "./event";
import { subscribe } from "./subject";
import { expandNode, setRoot } from "./action";
import circularLayout from "./d3/circularLayout";
import { LINK_DISTANCE } from "./d3/constants";

const groupDepth = 3;

export class Graph extends BaseGraph {
  graphData: GraphData | null = null;
  subDir: SubDir | null = null;
  entryId: string | null = null;
  rootDir: SubDir | null = null;

  draw1 = draw1.bind(this);
  draw2 = draw2.bind(this);

  expandNode = expandNode.bind(this);

  setRoot = setRoot.bind(this);

  fsm: ForceSimulation | null = null;

  subscribe = subscribe.bind(this);
  sub = this.subscribe();

  dispose() {
    if (this.fsm) {
      this.fsm.simulation.stop();
    }
    this.sub.unsubscribe();
    super.dispose();
  }

  /**
   * 将图形视图缩放到适合窗口大小的函数
   * 该方法会自动调整缩放比例，使得整个图形能够完整显示在视图中
   */
  zoomToFit() {
    this.graph.zoomToFit(zoomFit);
  }

  init() {
    if (this.fsm) return;

    this.graph.use(new Selection({ enabled: true }));
    this.setupEvents();

    this.draw();
  }

  draw() {
    const { draw1, draw2, graph, subDir } = this;

    if (subDir === null) return;

    this.rootDir = (groupDepth === 3 ? subDir.subDir : subDir)!;

    graph.resetCells([]);

    const isSub = groupDepth === 3 ? subDir.subDir?.subDir : subDir.subDir;

    /* 初始化图形 */
    if (isSub) {
      draw2();
    } else {
      draw1();
    }

    this.fsm = new ForceSimulation(this.render.bind(this));
    this._nodeModelMap = {};
    this.layout();
  }

  protected initialDragPosition: readonly [number, number] | null = null;
  protected restartedSimulation = false;
  handleNodeClick = handleNodeClick.bind(this);
  handleNodeMoving = handleNodeMoving.bind(this);
  handleNodeMoved = handleNodeMoved.bind(this);
  handleNodeMove = handleNodeMove.bind(this);
  handleNodeContextMenu = handleNodeContextMenu.bind(this);
  handleBlankClick = handleBlankClick.bind(this);
  deSelectNode = deSelectNode.bind(this);
  handleNodeHover = handleNodeHover.bind(this);
  setupEvents() {
    this.handleNodeClick();
    this.handleNodeMoving();
    this.handleNodeMoved();
    this.handleNodeMove();
    this.handleNodeContextMenu();
    this.handleBlankClick();
    this.handleNodeHover();
  }

  render() {
    // console.log("render", this._nodeModels);

    this._nodeModels?.forEach((nm) => {
      const node = nm.node;
      if (nm.x !== undefined && nm.y !== undefined) node.setPosition(nm.x - nm.r, nm.y - nm.r);
    });
  }

  protected _nodeModels: NodeModel[] = [];
  protected _nodeModelMap: Record<string, NodeModel> = {};
  nodeModles() {
    const nodeModelMap = this._nodeModelMap;
    // const rootId = this.graphData?.[0].nodeId;
    this._nodeModels = this.graph.getNodes().map((node) => {
      const nodeData = getNodeData(node);
      let nm = nodeModelMap[node.id];
      if (nm) {
        nm.node = node; // 更新node
        return nm;
      }
      nm = {
        node,
        r: nodeData.nodeSize * 0.5,
        x: 0,
        y: 0,
        // initialPositionCalculated: node.id === rootId, // 根节点的初始位置已经计算过了
      };
      nodeModelMap[node.id] = nm;
      return nm;
    });
    return this._nodeModels;
  }

  relationships() {
    const relationships: RelationshipModel[] = [];
    const nodeMap = this._nodeModelMap;
    if (!nodeMap) return relationships;
    this.graph.getEdges().forEach((edge) => {
      const sn = nodeMap[edge.getSourceCellId()];
      const tn = nodeMap[edge.getTargetCellId()];
      if (sn === undefined || tn === undefined) return;
      const r: RelationshipModel = {
        source: sn,
        target: tn,
      };
      relationships.push(r);
    });
    return relationships;
  }

  layout() {
    if (!this.fsm) return;
    const nodeModles = this.nodeModles();
    const _nodeModles = nodeModles.filter((nm) => nm.node.data.data.level === 2);
    const radius = (_nodeModles.length * LINK_DISTANCE) / (Math.PI * 2);
    const center = {
      x: 0,
      y: 0,
    };
    circularLayout(_nodeModles, center, radius);
    // _nodeModles.forEach((nm) => {
    //   nm.node.setPosition(nm.x!, nm.y!);
    // });
    this.fsm.updateNodes(nodeModles);
    this.fsm.updateRelationships(this.relationships());
    this.fsm.precomputeAndStart(() => {
      this.zoomToFit();
    });
  }
}

export const useGraph = createUseGraph(Graph, {
  async: true,
  // virtual: { enabled: true, margin: 200 },
  panning: {
    enabled: true,
  },
  // interacting: !!process.env.devMode,
  mousewheel: {
    enabled: true,
    minScale: 0.5,
    maxScale: 2,
  },
  grid: undefined,
});
