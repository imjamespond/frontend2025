import { Fragment, useEffect, useRef, type CSSProperties } from "react";
import { useGraph } from "./graph";
import Operations from "@components/Operations";
import { useDataMap } from "@/view/data-atlas/service";
import { OrgStyles } from "./graph/OrgStyles";

function FC() {
  const { data } = useDataMap();
  const [containerRef, wrapperRef, graphRef, graphQueue] = useGraph();

  useEffect(() => {
    if (data === undefined) {
      return;
    }

    ref.current.graphQueue(() => {
      graphRef.current?.x6graph.resetCells([]);
      graphRef.current?.init(data);
      // 布局
      graphRef.current?.layout();
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const ref = useRef({ graphQueue });

  return (
    <Fragment>
      <OrgStyles />
      <div ref={wrapperRef} style={wrapperStyle}>
        <div ref={containerRef} style={containerStyle}></div>
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
    </Fragment>
  );
}

export default FC;

const wrapperStyle: CSSProperties = { width: "100%", position: "relative", flex: "1", overflow: "hidden" };
const containerStyle: CSSProperties = { width: "100%", height: "100%" };
