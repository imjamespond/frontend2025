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
  handleNodeMove,
  handleNodeMoved,
  handleNodeMoving,
} from "./event";
import { subscribe } from "./subject";
import { expandNode } from "./expand";

const groupDepth = 3;

export class Graph extends BaseGraph {
  graphData: GraphData | null = null;
  subDir: SubDir | null = null;
  entryId: string | null = null;
  rootDir: SubDir | null = null;

  draw1 = draw1.bind(this);
  draw2 = draw2.bind(this);

  expandNode = expandNode.bind(this);

  fsm: ForceSimulation | null = null;

  subscribe = subscribe.bind(this);
  sub = this.subscribe();

  layout() {
    throw new Error("Method not implemented.");
  }

  dispose() {
    if (this.fsm) {
      this.fsm.simulation.stop();
    }
    this.sub.unsubscribe();
    super.dispose();
  }

  zoomToFit() {
    this.graph.zoomToFit(zoomFit);
  }

  init() {
    if (this.fsm) return;

    this.graph.use(new Selection({ enabled: true }));

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
    this.fsm.updateNodes(this.nodes());
    this.fsm.updateRelationships(this.relationships());
    this.fsm.precomputeAndStart(() => {
      this.zoomToFit();
    });

    this.setupEvents();
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
  setupEvents() {
    this.handleNodeClick();
    this.handleNodeMoving();
    this.handleNodeMoved();
    this.handleNodeMove();
    this.handleNodeContextMenu();
    this.handleBlankClick();
  }

  render() {
    console.log("render", this._nodeModels);

    this._nodeModels?.forEach((nm) => {
      const node = nm.node;
      if (nm.x !== undefined && nm.y !== undefined) node.setPosition(nm.x - nm.r, nm.y - nm.r);
    });
  }

  protected _nodeModels: NodeModel[] | null = null;
  protected _nodeModelMap: Record<string, NodeModel> = {};
  nodes() {
    const nodeModelMap = this._nodeModelMap;
    const rootId = this.graphData?.[0].nodeId;
    this._nodeModels = this.graph.getNodes().map((node, index) => {
      const nodeData = getNodeData(node);
      let nm = nodeModelMap[node.id];
      if (nm) {
        return nm;
      }
      nm = {
        index,
        node,
        r: nodeData.nodeSize * 0.5,
        x: 0,
        y: 0,
        initialPositionCalculated: nodeData.data.level === 3 && node.id === rootId, // 根节点的初始位置已经计算过了
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
}

export const useGraph = createUseGraph(Graph, {
  async: false,
  virtual: { enabled: true, margin: 200 },
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
