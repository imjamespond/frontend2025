import { ForkOutlined, PartitionOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import type { Node } from "@antv/x6";
import type { IAct } from "@common/hooks/act";
import { Typography } from "antd";
import React, { useEffect, useState } from "react";
import { Subject } from "rxjs";
import { useTagColors } from "../service";
import type { EntEdgeData, Field, GraphData } from "../types";

export type FieldAnalysis = { field?: Field; node?: Node; action?: "impact" | "lineage" };

export enum GraphActionType {
  Init,
  Analysis,
  EntTips,
  FieldTips,
  FieldEdgeTips,
  Loading,
  RenderPorts,
  Highlight,
}
export type GraphAction = { graphId: number } & (
  | IAct<GraphActionType.Init, GraphData | undefined>
  | IAct<GraphActionType.Analysis, FieldAnalysis | undefined>
  | IAct<GraphActionType.EntTips, MetadataAnalysis.NodeData | undefined>
  | IAct<GraphActionType.FieldTips, Field | undefined>
  | IAct<GraphActionType.FieldEdgeTips, object>
  | IAct<GraphActionType.Loading, boolean>
  | IAct<GraphActionType.RenderPorts, { node: Node; scrollTop: number }>
  | IAct<GraphActionType.Highlight, string>
);
export const GraphSubject = new Subject<GraphAction>();

export const Tips = (
  <React.Fragment>
    {/* <Space align="start"> */}
    <QuestionCircleOutlined />
    <ul>
      <li>
        <Typography.Text>
          点击
          <ForkOutlined /> 分析血缘关系
        </Typography.Text>
      </li>
      <li>
        <Typography.Text>
          点击
          <PartitionOutlined /> 分析影响关系
        </Typography.Text>
      </li>
    </ul>
    {/* </Space> */}
  </React.Fragment>
);

export function getFieldTips(payload: Field) {
  return (
    <div>
      {"字段名称: "}
      <Typography.Text italic underline>
        {"payload.name"}
      </Typography.Text>
    </div>
  );
}
export function getFieldEdgeTips(payload: EntEdgeData) {
  const labels = payload.data.jobName?.split(",");
  return (
    <div style={{ overflow: "auto", maxHeight: 450 }}>
      {"SQL: "}
      {labels?.map((label, i) => {
        return (
          <div key={i}>
            <Typography.Text italic underline>
              {label}
            </Typography.Text>
          </div>
        );
      })}
    </div>
  );
}

export function useSubject(graphId: number) {
  const { data: tagColors } = useTagColors();
  const [tips, setTips] = useState<React.ReactElement>();
  const [field, setField] = useState<FieldAnalysis>();

  useEffect(() => {
    GraphSubject.next({ graphId, type: GraphActionType.Loading, payload: true });

    // subscribe
    const $GraphSubject = GraphSubject.subscribe((act) => {
      if (act.type === GraphActionType.FieldTips) {
        setTips(act.payload ? getFieldTips(act.payload) : undefined);
      } else if (act?.type === GraphActionType.FieldEdgeTips) {
        setTips(act.payload ? getFieldEdgeTips(act.payload) : undefined);
      } else if (act?.type === GraphActionType.Analysis) {
        setField(act.payload);
      }
    });
    // subscribe

    // dispose
    return () => {
      $GraphSubject.unsubscribe();
    };
  }, [tagColors]);

  return { tips, field, setField };
}
