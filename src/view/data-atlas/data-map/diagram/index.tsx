import { Fragment, type CSSProperties } from "react";
import Operations from "@components/Operations";
import { OrgStyles } from "./graph/OrgStyles";
import { useInit } from "./helper";
import Loading from "@components/Loading";

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
