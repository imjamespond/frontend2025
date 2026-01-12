import { Fragment, useEffect, useRef, type CSSProperties } from "react";
import Operations from "@components/Operations";
import { useStyles } from "../styles/relation";
import Loading from "@components/Loading";
import { useGraph } from "./graph";
import { useRelationChartDData } from "../service";
import type { SubDir } from "../../helper";
import { useRootDir } from "../../context";
import { Style } from "./style";

function FC({ subDir, graphData }: { graphData: DataAtlas.JsonNode[]; subDir?: SubDir }) {
  const { styles } = useStyles();
  const [containerRef, wrapperRef, graphRef, graphQueue] = useGraph();
  const rootDir = useRootDir();

  useEffect(() => {
    const { graphRef, graphQueue } = ref.current;
    graphQueue(() => {
      if (graphData.length < 1) return;
      if (subDir === undefined) return;
      if (graphRef.current === null) return;
      if (graphRef.current.mounted === false) return;
      graphRef.current.graphData = graphData;
      // if (process.env.devMode && graphData[0].children)
      //   graphRef.current.graphData = [
      //     {
      //       ...graphData[0],
      //       children: graphData[0].children?.slice(0, 2),
      //     },
      //   ];
      graphRef.current.subDir = subDir;
      if (rootDir?.dirId) graphRef.current.entryId = rootDir.dirId;
      graphRef.current.init();
    });
  }, [subDir, graphData, rootDir]);

  const ref = useRef({ graphRef, graphQueue });

  return (
    <Fragment>
      <Style />
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
            graphRef.current?.graph.scale(1);
          }}
          onFitContent={() => {
            graphRef.current!.zoomToFit();
          }}
        />
      </div>
    </Fragment>
  );
}

export default function Wrapper({ subDir }: { subDir?: SubDir }) {
  const { data, isLoading, error } = useRelationChartDData();

  return (
    <Fragment>
      {data && <FC graphData={data} subDir={subDir} />}
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
