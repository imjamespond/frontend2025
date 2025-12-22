import { useGraph } from "./graph";
import Operations from "@components/Operations";

function FC() {
  const [containerRef, wrapperRef, graphRef] = useGraph();

  return (
    <div ref={wrapperRef} style={{ width: "100%", position: "relative", height: "calc(100% - 50px)" }}>
      <div ref={containerRef} style={{ width: "100%", height: "100%" }}></div>
      <Operations
        // onZoomIn={() => {
        //   graphRef.current!.zoom(0.1);
        // }}
        // onZoomOut={() => {
        //   graphRef.current!.zoom(-0.1);
        // }}
        // onRealContent={() => {
        //   graphRef.current!.scale(1);
        // }}
        // onFitContent={() => {
        //   graphRef.current!.zoomToFit(zoomFit);
        //   graphRef.current!.centerCell(graphRef.current!.getCellById("root"));
        // }}
      />
      {/* {true && <Loading tip="布局中..." />} */}
    </div>
  );
}

export default FC;
