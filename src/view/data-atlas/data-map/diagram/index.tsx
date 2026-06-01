import Operations from "@components/graph/Operations";
import Loading from "@components/Loading";
import { type CSSProperties, Fragment } from "react";
import { OrgStyles } from "./graph/OrgStyles";
import { useInit } from "./helper";

function FC() {
  const [wrapperRef, containerRef, graphRef, isLoading] = useInit();

  return (
    <Fragment>
      <OrgStyles />
      <div ref={wrapperRef} style={wrapperStyle}>
        <div ref={containerRef} style={containerStyle} />
        <Operations
          onZoomIn={() => {
            graphRef.current?.graph.zoom(0.1);
          }}
          onZoomOut={() => {
            graphRef.current?.graph.zoom(-0.1);
          }}
          onRealContent={() => {
            graphRef.current!.graph.scale(1);
          }}
          onFitContent={() => {
            graphRef.current!.zoomToFit();
          }}
        />
        <Loading spinning={isLoading} relative={false} />
      </div>
    </Fragment>
  );
}

export default FC;

const wrapperStyle: CSSProperties = { width: "100%", position: "relative", flex: "1", overflow: "hidden" };
const containerStyle: CSSProperties = { width: "100%", height: "100%" };
