import Operations from "@components/graph/Operations";
import Loading from "@components/Loading";
import { useRootDir } from "@view/data-atlas/context";
import { type CSSProperties, Fragment, useEffect, useRef } from "react";
import type { SubDir } from "../../helper";
import type { GraphType } from "../helper";
import { useRelationChartDData } from "../service";
import { useStyles } from "./components/styles";
import { useGraph } from "./graph";

function FC({
  graphType,
  subDir,
  graphData,
}: {
  graphData: DataAtlas.JsonNode[];
  graphType: GraphType;
  subDir?: SubDir;
}) {
  const { styles } = useStyles();
  const rootDir = useRootDir();
  const [containerRef, wrapperRef, graphRef, graphQueue] = useGraph();

  useEffect(() => {
    const { graphRef, graphQueue } = ref.current;
    graphQueue(() => {
      if (rootDir === undefined || graphData.length < 1) return;
      if (graphRef.current === null) return;
      if (graphRef.current.mounted === false) return;
      graphRef.current.graphType = graphType;
      graphRef.current.graphData = graphData;
      graphRef.current.rootDir = rootDir;
      graphRef.current.subDir = subDir;
      const root = graphData[0];
      graphRef.current.root = root;
      graphRef.current.render();
    });
  }, [graphType, subDir, rootDir, graphData]);

  const ref = useRef({ graphRef, graphQueue });

  return (
    <Fragment>
      <div ref={wrapperRef} style={wrapperStyle} className={styles.root}>
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
      </div>
    </Fragment>
  );
}

export default function Wrapper({ graphType, subDir }: { graphType: GraphType; subDir?: SubDir }) {
  const { data, isLoading, error } = useRelationChartDData();

  return (
    <Fragment>
      {data && <FC graphType={graphType} graphData={data} subDir={subDir} />}
      {error && JSON.stringify(error)}
      <Loading spinning={isLoading} />
    </Fragment>
  );
}

const wrapperStyle: CSSProperties = {
  width: "100%",
  height: "100%",
  position: "relative",
  flex: "1",
  overflow: "hidden",
};
const containerStyle: CSSProperties = { width: "100%", height: "100%" };
