import { Fragment, useEffect, useRef, type CSSProperties } from "react";
import Operations from "@components/Operations";
import { useStyles } from "./components/styles";
import type { GraphType } from "../helper";
import useSWR from "swr";
import { service } from "@service/api/data-atlas";
import type { KeyOfFetcher } from "@service/api";
import { useRootDir, useTemplateType } from "@view/data-atlas/context";
import { useDomainId } from "@config/app";
import type { SubDir } from "./types";
import Loading from "@components/Loading";
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
      if (rootDir === undefined || graphData === undefined || graphData.length < 1) return;
      if (graphRef.current === null) return;
      if (graphRef.current.mounted === false) return;
      graphRef.current.graphType = graphType;
      graphRef.current.rootDir = rootDir;
      graphRef.current.subDir = subDir;
      const root = graphData[0];
      graphRef.current.root = root;
      graphRef.current.init();
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
  const { data, isLoading, error } = useData();

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

type QueryRelationChartDataKey = KeyOfFetcher<typeof service.dataassetmanager.queryRelationChartData> | null;

function useData() {
  const rootDir = useRootDir();
  const templateType = useTemplateType();
  const env = useDomainId();
  const queryRelationChartDataKey: QueryRelationChartDataKey =
    env && rootDir?.resourceType
      ? { args: { params: { resourceType: rootDir.resourceType, env, templateType } } }
      : null;

  return useSWR(queryRelationChartDataKey, service.dataassetmanager.queryRelationChartData);
}
