import type { Graph } from "./graph";

export function handleNodeMoved(this: Graph) {
  this.graph.on("node:moved", () => {
    // this.nodeHovering = true;
    // const node = e.node;
    // // kmDebug(node);
    // // const data = getNodeData(node);
    // node.attr({
    //   body: {
    //     fill: highlight,
    //   },
    // });
    // const incoming = this.graph.getIncomingEdges(node);
    // const outgoing = this.graph.getOutgoingEdges(node);
    // const setEdges = (edges: Edge[] | null) => {
    //   edges?.forEach((edge) => {
    //     edge.toFront();
    //     edge.attr("line/stroke", highlight);
    //     edge.prop("labels/0", {
    //       attrs: {
    //         body: { display: "block" },
    //       },
    //     });
    //   });
    // };
    // setEdges(incoming);
    // setEdges(outgoing);
  });
}

export function handleNodeMouseLeave(this: Graph) {
  this.graph.on("node:mouseleave", () => {
    // if (this.nodeHovering) {
    //   const node = e.node as Node;
    //   const data = node.getData<FKNodeData | NodeData>();
    //   if (data && "isFK" in data) {
    //     node.attr({
    //       body: {
    //         fill: entityEdgeLight,
    //       },
    //     });
    //     this.resetFKEdges();
    //   }
    // }
    // this.nodeHovering = false;
  });
}

export function handleNodeMouseEnter(this: Graph) {
  this.graph.on("node:mouseenter", () => {});
}

export function handleNodeMoving(this: Graph) {
  this.graph.on("node:moving", ({ node }) => {
    const edges = this.graph.getConnectedEdges(node);
    if (edges) {
      edges.forEach((edge) => {
        edge.setVertices([]);
        edge.setRouter({
          name: "er",
          args: {
            offset: "center",
            direction: "H",
          },
        });
      });
    }
  });
}

export function handleNodeClick(this: Graph) {
  this.graph.on("node:click", () => {});
}
