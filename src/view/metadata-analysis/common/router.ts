import type { Edge } from "@antv/x6";
// import { defaults } from '@antv/x6/lib/registry/router/manhattan/options';
// import { router } from '@antv/x6/lib/registry/router/manhattan/router';
import { metro } from "@antv/x6/lib/registry/router/metro";
import type { EdgeView } from "@antv/x6/lib/view";
import { kmDebug } from "@common/misc";
import type { Graph } from "../graph";

export function getRoute(this: Graph, edge: Edge) {
  const view = this.graph.findViewByCell(edge) as unknown as EdgeView;
  if (view) {
    // const verts = router.call(
    //   view,
    //   [],
    //   {
    //     ...defaults,
    //     step: 10,
    //     excludeShapes: ['center'],
    //     startDirections: ['left', 'right'],
    //     endDirections: ['left', 'right'],
    //     padding: { left: 60, right: 60, top: 20, bottom: 20 }, // 从节点出发到转角的距离
    //   },
    //   view
    // );
    const verts = metro.call(
      view,
      [],
      {
        startDirections: ["right", "left"],
        endDirections: ["right", "left"],
        padding: { left: 40, right: 60, top: 10, bottom: 10 } /* 避障 */,
      },
      view,
    );
    edge.setVertices(verts.length === 0 ? [view.sourcePoint, view.targetPoint] : verts);
    kmDebug("verts", verts);
  }
}
