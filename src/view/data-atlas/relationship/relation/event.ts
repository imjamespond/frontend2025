import { select } from "d3";
import { DEFAULT_ALPHA_TARGET, DRAGGING_ALPHA, DRAGGING_ALPHA_TARGET } from "./d3/constants";
import { nodeMenuRenderer } from "./d3/menu";
import type { Graph } from "./graph";

const tolerance = 25;

export function handleNodeMove(this: Graph) {
    this.graph.on("node:move", (event) => {
        this.initialDragPosition = [event.x, event.y];
        this.restartedSimulation = false;
    });
}

export function handleNodeMoved(this: Graph) {
    this.graph.on("node:moved", (event) => {
        const { fsm, initialDragPosition, restartedSimulation } = this;
        if (!fsm || !initialDragPosition) return;
        if (restartedSimulation) {
            // Reset alphaTarget so the simulation cools down and stops.
            fsm.simulation.alphaTarget(DEFAULT_ALPHA_TARGET);
        }
        const nodeMap = this._nodeMap;
        if (!nodeMap) return;
        const node = nodeMap[event.node.id];
        node.fx = null;
        node.fy = null;
    });
}

export function handleNodeMoving(this: Graph) {

    this.graph.on("node:moving", (event) => {
        const { fsm, initialDragPosition, restartedSimulation } = this;
        if (!fsm || !initialDragPosition) return;
        const nodeMap = this._nodeMap;
        if (!nodeMap) return;
        const node = nodeMap[event.node.id];
        // Math.sqrt was removed to avoid unnecessary computation, since this
        // function is called very often when dragging.
        const dist = Math.pow(initialDragPosition[0] - event.x, 2) + Math.pow(initialDragPosition[1] - event.y, 2);

        // This is to prevent clicks/double clicks from restarting the simulation
        if (dist > tolerance && !restartedSimulation) {
            // Set alphaTarget to a value higher than alphaMin so the simulation
            // isn't stopped while nodes are being dragged.
            fsm.simulation.alphaTarget(DRAGGING_ALPHA_TARGET).alpha(DRAGGING_ALPHA).restart();
            this.restartedSimulation = true;
        }

        // 固定位置
        node.fx = event.x;
        node.fy = event.y;
    });
}

export function handleNodeContextMenu(this: Graph) {
    this.graph.on("node:contextmenu", (event) => {
        const view = event.node.findView(this.graph);
        const container = view?.container as SVGGElement;
        if (!container) return;
        const nodeMap = this._nodeMap;
        if (!nodeMap) return;
        const n = nodeMap[event.node.id]
        n.selected = true;
        nodeMenuRenderer.donutExpandNode.onGraphChange(select(container).datum(n));
        nodeMenuRenderer.donutRemoveNode.onGraphChange(select(container).datum(n));
        nodeMenuRenderer.donutUnlockNode.onGraphChange(select(container).datum(n));
    });
}