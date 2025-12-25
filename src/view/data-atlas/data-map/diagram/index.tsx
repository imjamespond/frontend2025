import { useEffect } from "react";
import { useGraph } from "./graph";
import Operations from "@components/Operations";
import { useDataMap } from "@/view/data-atlas/service";

function FC() {
  const [containerRef, wrapperRef, graphRef] = useGraph();
  const { data } = useDataMap();

  useEffect(() => {
    if (data === undefined) {
      return;
    }

    setTimeout(() => {
      graphRef.current?.dispose(); 
      // 布局
      // DataMapSubject.next({ type: DataMapActType.Layout, payload: undefined });
    });

  }, [data]);

  return (
    <div ref={wrapperRef} style={{ width: "100%", position: "relative", flex: "1" }}>
      <div ref={containerRef} style={{ width: "100%", height: "100%" }}></div>
      <Operations
        onZoomIn={() => {
          graphRef.current?.x6graph.zoom(0.1);
        }}
        onZoomOut={() => {
          graphRef.current?.x6graph.zoom(-0.1);
        }}
        // onRealContent={() => {
        //   graphRef.current!.scale(1);
        // }}
        // onFitContent={() => {
        //   graphRef.current!.zoomToFit(zoomFit);
        //   graphRef.current!.centerCell(graphRef.current!.getCellById("root"));
        // }}
      />
    </div>
  );
}

export default FC;
