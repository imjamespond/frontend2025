import { Fragment, useEffect, useRef, type CSSProperties } from "react";
import Operations from "@components/Operations";
import { useStyles } from "../styles/relation";
import Loading from "@components/Loading";
import { useGraph } from "./graph";
import { useRelationChartDData } from "../service";
import type { SubDir } from "../../helper";
import { useRootDir } from "../../context";
import { Style } from "./style";
import { Descriptions } from "antd";
import { ReloadOutlined } from "@ant-design/icons";

import icons from "./d3/d3Icons";
import centerSvg from "../assets/crosshairs-solid.svg";
import blockSvg from "../assets/cubes-stacked-solid.svg";
import { useTips } from "./subject";

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
          onReload={() => {
            graphRef.current!.draw();
          }}
        />
        <Tips />
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

function Tips() {
  const tips = useTips();
  const _tips = !!tips ? (
    <Descriptions title="详细信息" column={1} size="small">
      <Descriptions.Item label="名称">{tips?.name}</Descriptions.Item>
      <Descriptions.Item label="子目录">{tips?.count}</Descriptions.Item>
      <Descriptions.Item label="资产总数">{tips?.amount}</Descriptions.Item>
    </Descriptions>
  ) : (
    <Descriptions title="帮助信息" column={1} size="small">
      <Descriptions.Item>点击结点打开或收起结点菜单</Descriptions.Item>
      <Descriptions.Item>
        点击
        <div
          dangerouslySetInnerHTML={{ __html: icons["Expand / Collapse"] }}
          style={{ width: 20, display: "inline-block" }}
        />
        展开或收起下级目录
      </Descriptions.Item>
      <Descriptions.Item>
        点击
        <img style={{ width: 15 }} src={centerSvg} alt="centerSvg" />
        设置为中心
      </Descriptions.Item>
      <Descriptions.Item>
        点击
        <img style={{ width: 15 }} src={blockSvg} alt="blockSvg" />
        到对应方块图
      </Descriptions.Item>
      <Descriptions.Item>
        点击
        <ReloadOutlined />
        回到初始关系图
      </Descriptions.Item>
      <Descriptions.Item>子目录数大于零的结点将用较深颜色表示</Descriptions.Item>
    </Descriptions>
  );
  return (
    <div
      style={{
        width: 280,
        padding: "10px",
        position: "absolute",
        top: 0,
        right: 0,
        backgroundColor: "rgb(249, 252, 255, .5)",
      }}
    >
      {_tips}
    </div>
  );
}
