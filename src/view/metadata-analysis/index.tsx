import { DownOutlined, UpOutlined } from "@ant-design/icons";
import type { SimpleDispatch } from "@common/misc";
import { KmModal, KmPopover } from "@components";
import Operations from "@components/graph/Operations";
import { DelayLoading } from "@components/LoadingPro";
import { useAppStore } from "@config/app";
import { type CSSProperties, Fragment, useEffect, useMemo, useRef, useState } from "react";
import { GraphActionType, GraphSubject, useSubject } from "./common/subject";
import type { ElkConfigKeys } from "./config/elk";
import { useGraph } from "./graph";
import { getNodeData } from "./helper";
import { useAnalysisTableAndColumn } from "./service";
import type { GraphData } from "./types";

const graphId = 0;

function FC({
  graphId,
  data,
  loading,
  setLevel,
}: {
  graphId: number;
  data?: GraphData;
  loading: boolean;
  setLevel: SimpleDispatch<number>;
}) {
  const [dirty, setDirty] = useState(Symbol());
  const [elkConfig, setElkConfig] = useState<ElkConfigKeys>();
  const [fieldsVis, setFieldsVis] = useState(true);

  const [containerRef, wrapperRef, graphRef, graphQueue] = useGraph();

  useEffect(() => {
    void dirty;
    const { graphRef, graphQueue } = ref.current;
    graphQueue(() => {
      if (graphRef.current === null) return;
      if (data === undefined) return;
      graphRef.current.graphId = graphId;
      graphRef.current.reset();
      graphRef.current.elkConfig = elkConfig;
      graphRef.current.collapsed = !fieldsVis;
      graphRef.current.render(data);
    });
  }, [data, graphId, dirty, elkConfig, fieldsVis]);

  const ref = useRef({ graphRef, graphQueue });

  return (
    <div className={fieldsVis ? undefined : "__km-fields-hide"} style={wrapperStyle} ref={wrapperRef}>
      <div ref={containerRef} style={containerStyle} />

      <Operations
        onZoomIn={() => {
          graphRef.current?.graph?.zoom(0.1);
        }}
        onZoomOut={() => {
          graphRef.current?.graph?.zoom(-0.1);
        }}
        onRealContent={() => {
          graphRef.current?.graph?.scale(1);
          graphRef.current?.graph.centerContent();
        }}
        onFitContent={() => {
          graphRef.current?.zoomToFit();
        }}
        onReload={
          process.env.devMode
            ? () => {
                setFieldsVis(true);
                setDirty(Symbol());
              }
            : undefined
        }
        // onExportImage={() => {
        //   // 逻辑模型新开窗口导出
        //   if (getLogicalDataModelGraphKey && needExport !== true) {
        //     window.open(
        //       `/data-atlas/?app=graph&subGraph=${subGraph}&type=${treeNode?.type}&id=${treeNode?.id}&isSys=${isSys}`,
        //       "doExport",
        //       "popup=1,width=1280,height=720,title"
        //     );
        //   } else {
        //     graphRef.current?.exportImage(getLogicalDataModelGraphKey ? {} : { copyStyles: false });
        //   }
        // }}
        onExportExcel={() => {
          // if (graphData) {
          //   const cells = graphRef.current?.graph?.getSelectedCells();
          //   let tableId = graphData.rootIds[0];
          //   if (cells?.length) {
          //     tableId = cells[0].id;
          //   }
          //   if (tableId) {
          //     const node = graphData.nodes.find((node) => node.id === tableId);
          //     if (node) {
          //       exportToExcel(
          //         graphData.analysisType,
          //         tableId,
          //         node.fields.map((f) => f.id)
          //       );
          //     }
          //   }
          // }
        }}
        onSelectLevel={(lv) => {
          setLevel(lv);
        }}
        layoutTypeOpt={{
          title: "布局类型",
          options: [
            { label: "默认", value: "default" },
            { label: "布局1", value: "config" },
            { label: "布局2", value: "config0" },
            { label: "布局3", value: "config01" },
            { label: "布局4", value: "config1" },
            { label: "布局5", value: "config2" },
            { label: "布局6", value: "config3" },
            { label: "布局7", value: "config4" },
            { label: "布局8", value: "config5" },
          ] as { label: string; value: ElkConfigKeys }[],
          onChange(e) {
            setElkConfig(e.target.value);
          },
          value: elkConfig,
        }}
        extra={
          data && (
            <KmPopover classNames={{ root: "popover" }} content="收起或展开字段" placement="left">
              <li
                onClick={() => {
                  setFieldsVis((prev) => !prev);
                  setDirty(() => Symbol());
                }}
                className={"item"}
              >
                {fieldsVis ? <UpOutlined /> : <DownOutlined />}
              </li>
            </KmPopover>
          )
        }
      />

      {/* {rightTop} */}

      <DelayLoading spinning={loading} relative={false} />
    </div>
  );
}

const wrapperStyle: CSSProperties = { height: "100%", position: "relative", overflow: "hidden" };
const containerStyle: CSSProperties = { width: "100%", height: "100%" };

type UseSubject = ReturnType<typeof useSubject>;

function Ent() {
  const otherParams = useAppStore();
  const [level, setLevel] = useState(2);
  const params = useMemo(() => ({ ...otherParams, level }), [otherParams, level]);
  const { data, setData, trigger, isMutating } = useAnalysisTableAndColumn();

  useEffect(() => {
    trigger(params).then((res) => {
      setData(res);
    });
  }, [params, setData, trigger]);

  const sub = useSubject(graphId);

  const { entFieldModal } = useEntField(sub, data);

  return (
    <Fragment>
      <FC graphId={graphId} loading={isMutating} data={data} setLevel={setLevel} />
      {entFieldModal}
    </Fragment>
  );
}

function EntField(props: UseSubject & { catalog: unknown; versionTimestamp: unknown }) {
  const { field, catalog, versionTimestamp } = props;
  const [level, setLevel] = useState(2);
  const params = useMemo(() => {
    if (field)
      return {
        fieldOnly: true,
        columnIds: [field.field?.id],
        analysisType: field.action,
        nodeId: field.node?.id,
        catalog,
        versionTimestamp,
        level,
      };
  }, [field, catalog, versionTimestamp, level]);
  const { data, setData, trigger, isMutating } = useAnalysisTableAndColumn();

  useEffect(() => {
    if (params)
      trigger(params).then((res) => {
        setData(res);
      });
  }, [params, setData, trigger]);

  const graphId = 1;

  useSubject(graphId);

  return <FC graphId={graphId} loading={isMutating} data={data} setLevel={setLevel} />;
}

export default Ent;

function useEntField(sub: UseSubject, data?: GraphData) {
  const field = sub.field;
  const title = useMemo(() => {
    if (field === undefined) return undefined;
    return `${field?.action === "impact" ? "影响分析" : "血缘分析"}: ${field?.field?.data.name}(${
      getNodeData(field?.node)?.data.cnName
    })`;
  }, [field]);

  const entFieldModal = (
    <KmModal
      open={field !== undefined}
      title={title}
      style={{ top: 10 }}
      width="90vw"
      onCancel={() => GraphSubject.next({ type: GraphActionType.Analysis, graphId, payload: undefined })}
      cancelText="关闭"
      okButtonProps={{ hidden: true }}
      maskClosable={false}
      destroyOnHidden
    >
      {field && (
        <EntField
          field={field}
          tips={sub.tips}
          setField={sub.setField}
          catalog={data?.catalog}
          versionTimestamp={data?.versionTimestamp}
        />
      )}
    </KmModal>
  );
  return { entFieldModal };
}
