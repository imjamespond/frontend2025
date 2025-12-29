import { LayoutSubject } from "./context";
import { debounceTime, tap } from "rxjs";
import { useGraph } from "./graph";
import { useEffect, useRef } from "react";
import { useMatchedDirId } from "@/view/data-atlas/context";
import { getOrgNodeData, setOrgNodeData } from "./graph/utils";
import { useDataMap } from "@/view/data-atlas/service";

export function useInit() {
  const { data, isLoading } = useDataMap();

  const matchedDirId = useMatchedDirId();
  const [containerRef, wrapperRef, graphRef, graphQueue] = useGraph();

  useEffect(() => {
    if (data === undefined) {
      return;
    }

    const { graphQueue, graphRef } = ref.current;

    graphQueue(() => {
      graphRef.current?.x6graph.resetCells([]);
      graphRef.current?.init(data);
      // 布局
      graphRef.current?.layout();
      graphRef.current?.zoomToFit();
    });
  }, [data]);

  useEffect(() => {
    const { graphRef } = ref.current;
    graphRef.current?.x6graph.getNodes().forEach((node) => {
      if (matchedDirId) {
        const nodeData = getOrgNodeData(node, true);
        if (nodeData === undefined) return;
        // 清空匹配状态
        if (nodeData.matchedDirId) {
          setOrgNodeData(node, { matchedDirId: undefined, expanded: false });
        }
        const matched = nodeData.dir?.list?.some((item) => {
          return item.dirId === matchedDirId;
        });
        if (matched) {
          setOrgNodeData(node, { matchedDirId, expanded: true });
        }
      }
    });
  }, [matchedDirId]);

  useEffect(() => {
    const sub = LayoutSubject.pipe(
      tap((/* data */) => {
        // setWaiting(true);
      }),
      debounceTime(100)
    ).subscribe((/* data */) => {
      const graph = graphRef.current?.x6graph;
      if (!graph) return;
      const root = graph.getCellById("root");
      if (!root.isNode()) return;
      // const currentTranslation = graph.translate();
      graphRef.current?.layout();
      // if (data.keepCurPos) {
      //   graph.translate(currentTranslation.tx, currentTranslation.ty);
      // }
      // setWaiting(false);
    });

    return () => {
      sub.unsubscribe();
    };
  }, []);

  const ref = useRef({ graphQueue, graphRef });

  return [wrapperRef, containerRef, graphRef, isLoading] as const;
}
