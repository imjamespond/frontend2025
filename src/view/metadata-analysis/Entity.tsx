import {
  BarsOutlined,
  ExclamationCircleOutlined,
  ForkOutlined,
  MinusCircleOutlined as MinusIcon,
  PartitionOutlined,
  PlusCircleOutlined as PlusIcon,
  TableOutlined,
} from "@ant-design/icons";
import type { Graph, Node } from "@antv/x6";
import React from "react";
import "./Entity.css";

import { kmDebug } from "@common/misc";
import VList from "@components/VList";
import { GraphActionType, GraphSubject } from "./common/subject";
import { rowHeight } from "./config";
import { getNodeData } from "./helper";
import { GraphType } from "./types";

interface Props {
  node: Node;
  graph: Graph;
}
interface State {
  scrollTop: number;
}

class Entity extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      scrollTop: 0,
    };
  }

  componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>): void {
    if (prevState.scrollTop !== this.state.scrollTop) {
      this.renderPorts(this.state.scrollTop);
    }
    if (prevProps !== this.props) {
      kmDebug("Entity", "componentDidUpdate", this.nodeData.data.cnName);
    }
  }

  componentWillUnmount() {}

  renderPorts(scrollTop: number) {
    const { graphId } = this.nodeData;
    GraphSubject.next({ type: GraphActionType.RenderPorts, graphId, payload: { node: this.node, scrollTop } });
  }

  ticking = false;
  scrollTop = 0;
  handleScroll: React.DOMAttributes<HTMLDivElement>["onScroll"] = (e) => {
    this.scrollTop = e.currentTarget.scrollTop;
    if (!this.ticking) {
      requestAnimationFrame(this.updateScroll); // 防止mac中 滚动产生的惯性会让内容闪烁抖动
      this.ticking = true;
    }
  };
  updateScroll = () => {
    this.setState({ scrollTop: this.scroll(this.scrollTop) });
    this.scrollTop = 0;
    this.ticking = false;
  };

  deltaY = 0;
  handleWheel: React.DOMAttributes<HTMLDivElement>["onWheel"] = (e) => {
    this.deltaY += e.deltaY;
    if (!this.ticking) {
      requestAnimationFrame(this.updateWheel); // 防止mac中 滚动产生的惯性会让内容闪烁抖动
      this.ticking = true;
    }
  };
  updateWheel = () => {
    this.setState((prev) => {
      const val = prev.scrollTop + this.deltaY;
      this.deltaY = 0;
      this.scrollbar.current?.scroll(0, val); // 同步滚动条
      return { scrollTop: this.scroll(val) };
    });
    this.ticking = false;
  };

  scroll(val: number) {
    const nodeData = this.nodeData;
    const scrollTopMax = nodeData.scrollTopMax;
    const scrollTop = val < 0 ? 0 : val > scrollTopMax ? scrollTopMax : val;
    return scrollTop;
  }

  scrollbar = React.createRef<HTMLDivElement>();

  getClassName() {
    const nodeData = this.nodeData;
    const { highlight, highlightEntry } = nodeData;
    let className = "__entity __entmodel";
    if (this.isEntry) {
      className += " __entry";
    }
    if (highlight) {
      className += " __highlight";
    }
    if (highlightEntry) {
      className += " __highlight_entry";
    }
    return className;
  }

  getHeadIcon() {
    const nodeData = this.nodeData;
    const headIcon =
      nodeData.graphType === GraphType.Field ? (
        <TableOutlined />
      ) : (
        <BarsOutlined
          className="type"
          onClick={() => {
            // this.setState({ modal: true });
          }}
        />
      );

    return headIcon;
  }

  render() {
    const nodeData = this.nodeData;
    const { height, graphId, graphType, analysisType, totalHeight } = nodeData;
    const { scrollTop } = this.state;
    const fields = nodeData?.data.fields;

    const expanded = true;
    const headIcon = this.getHeadIcon();

    const _title =
      nodeData.data.tips ||
      `${nodeData.data.schema}/${nodeData.data.name}/${nodeData.data.cnName}(${nodeData.data.modelDisplayName})`;
    const title = (
      <span>
        {_title} {nodeData.data.status === "error" && <ExclamationCircleOutlined className="error" />}
      </span>
    );

    return (
      <div className={this.getClassName()}>
        {/* <div className='__head'>{this.model?.data.cnName}</div> */}
        <div className="__content">
          <div
            className="__title"
            onMouseEnter={() =>
              GraphSubject.next({
                type: GraphActionType.EntTips,
                graphId: nodeData.graphId,
                payload: nodeData.data,
              })
            }
            onClick={() => {
              GraphSubject.next({
                type: GraphActionType.Highlight,
                payload: this.node.id,
                graphId,
              });
            }}
          >
            {headIcon} &nbsp;
            <div
              className="__text km-ellipsis"
              onClick={() => {
                // graphType === GraphType.Entity && analysisEntityNHighlight(entity.id, this.graphId);
              }}
            >
              {title}
            </div>
            <span
              // loading={expanding}
              onClick={(e) => {
                e.stopPropagation();
                // this.setState((prev) => ({ expanded: !prev.expanded }));
              }}
            >
              {expanded ? <MinusIcon /> : <PlusIcon />}
            </span>
          </div>
          <div className="__border" />
          <div className="__props">
            {/* 虚拟列表 */}
            <VList
              className="__list"
              onWheel={this.handleWheel}
              height={height}
              scrollTop={scrollTop}
              rowHeight={rowHeight}
              rows={fields}
              renderRow={(item) => {
                const cnName = item.name;
                return (
                  <div key={item.id} className="__prop">
                    <div
                      className="__name km-ellipsis km-pointer"
                      // onClick={() => GraphSubject.next({ type: GraphActionType.FieldTips, payload: { field: cnName } })}
                    >
                      {cnName}
                    </div>
                    <div className="__info">
                      {graphType !== GraphType.Entity && (
                        <>
                          {analysisType === "impact" ? (
                            <PartitionOutlined
                              onClick={() => {
                                // this.analysisField(field.id, "impact");
                              }}
                            />
                          ) : (
                            <ForkOutlined
                              onClick={() => {
                                // this.analysisField(field.id, "lineage");
                              }}
                            />
                          )}
                        </>
                      )}
                    </div>
                  </div>
                );
              }}
            />
            {/* 滚动条 */}
            <div className="__scrollbar" style={{ height }} ref={this.scrollbar} onScroll={this.handleScroll}>
              <div style={{ height: totalHeight }}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  public get isEntry() {
    return false; // this.nodeData.isEntry;
  }

  public get node() {
    return this.props.node;
  }

  public get nodeData() {
    const nodeData = getNodeData(this.node);
    if (nodeData === undefined) throw new Error("nodeData is undefined");
    return nodeData;
  }
}

export default Entity;
