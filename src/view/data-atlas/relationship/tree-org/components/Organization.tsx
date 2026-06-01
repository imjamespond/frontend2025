import { CaretDownFilled, CaretUpFilled } from "@ant-design/icons";
import type { Node } from "@antv/x6";
import Tooltip from "@components/Tooltip";
import { Col, Row } from "antd";
import classnames from "classnames";
import React from "react";
import { ActType, GraphSubject } from "../context";
import type { NodeData, Style } from "../types";
import { useStyles } from "./styles";

export type OrgNodeData = {
  dirId: string;
  style: Style;

  onLayout?: Function;
} & NodeData;
interface Props {
  node: Node;
  className: string /* data: any, style: Style, graphRef: React.MutableRefObject<Graph>, dir: Dir */;
}
interface State {
  expanded: boolean;
  matched: any[] | undefined;
  rect: DOMRect | undefined;
}

export class OrgComponent extends React.PureComponent<Props, State /* & any */> {
  constructor(props: any) {
    super(props);

    this.state = { expanded: false, matched: undefined, rect: undefined };
  }

  componentWillUnmount() {}

  componentDidUpdate(_prevProps: Readonly<any>, prevState: Readonly<State>) {
    const { expanded } = this.state;
    if (prevState.expanded !== expanded) {
      this.resizeNode();
    }
  }

  componentDidMount() {
    // 判断matched是否处于收起(不可见)位置
    const { node } = this.props;
    const { dirId, style, item: data } = node.getData<OrgNodeData>();
    const list: any[] = data?.children ?? [];
    let matched = 0;
    // 判断数量是否要显示收起
    const max = style.maxRows * style.cols;
    if (list && list.length > max - 1) {
      for (const item of list) {
        const { nodeId } = item;
        if (dirId === nodeId) {
          if (matched >= max - 1) {
            this.setState({ expanded: true });
          }
          break;
        }
        matched++;
      }
    }
  }

  hasMore = false;

  resizeNode() {
    const { expanded } = this.state;
    const { node } = this.props;
    const { style, onLayout } = node.getData<OrgNodeData>();
    if (expanded) {
      node?.resize(style.size.boxWidth, style.size.boxMaxHeight + 20);
      node?.toFront();
    } else {
      node?.resize(style.size.boxWidth, style.size.boxHeight + 20);
    }

    onLayout?.();
  }

  render() {
    const { expanded } = this.state;
    const { node, className } = this.props;
    const { dirId, style, item: data } = node.getData<OrgNodeData>();
    const span = 24 / style.cols;

    let items;
    const list = data?.children ?? [];

    // 是否出现滚动条
    if (expanded) {
      items = list.map((item, i: number) => {
        return <Item key={i} item={item} span={span} dirId={dirId} parent={data} node={node} />;
      });
      this.hasMore &&
        items.push(
          <Col key={list.length} span={span}>
            <div>
              <div className="more" onClick={() => this.setState({ expanded: false })}>
                <span>收起</span>
                <CaretUpFilled />
              </div>
            </div>
          </Col>,
        );
    } else {
      const min = style.minRows * style.cols;
      const num = list.length > min ? min - 1 : list.length;
      // 判断列表数目
      items = list.slice(0, num).map((item, i: number) => {
        return <Item key={i} item={item} span={span} dirId={dirId} parent={data} node={node} />;
      });
      // 显示更多
      if (list.length > items.length) {
        this.hasMore = true;
        items.push(
          <Col key={items.length} span={span}>
            <div>
              <div className="more" onClick={() => this.setState({ expanded: true })}>
                <span>更多</span>
                <CaretDownFilled />
              </div>
              {/* <div className="amount">({list.length - items.length})</div> */}
            </div>
          </Col>,
        );
      }
    }

    const boxHeight = expanded ? style.size.boxMaxHeight : style.size.boxHeight;

    return (
      <div
        className={className}
        onClick={() => {
          node?.toFront();
        }}
      >
        <svg viewBox={`0 0 ${style.size.boxWidth} ${boxHeight}`} xmlns="http://www.w3.org/2000/svg" className={"svg"}>
          <rect
            width={style.size.width}
            height={boxHeight - 4}
            x={2}
            y={2}
            rx={3}
            ry={3}
            style={{ fill: "#fff", strokeWidth: 1, stroke: style.color, strokeDasharray: "5, 2" }}
          />
        </svg>
        <div className={"body"}>
          <Row gutter={[8, 8]} className={classnames({ scoll: expanded })}>
            {items}
          </Row>
        </div>
      </div>
    );
  }
}

function Item({
  item,
  span,
  dirId,
  parent,
  node,
}: {
  item: DataAtlas.JsonNode;
  span: any;
  dirId: string;
  parent: DataAtlas.JsonNode;
  node: Node;
}) {
  const { nodeId, text, dataAssetAndSubDirCount } = item;
  const matched = dirId === nodeId;
  const msg = `${text}(${dataAssetAndSubDirCount})`;
  return (
    <Col span={span} className={classnames({ matched })}>
      <div
        onClick={() => {
          GraphSubject.next({ type: ActType.ClickDir, payload: { pdata: parent, node, data: item } });
        }}
      >
        <Tooltip className="org-name" tip={msg} />
      </div>
    </Col>
  );
}

export default function Wrapper({ node }: { node: Node }) {
  const { styles } = useStyles();
  return <OrgComponent node={node} className={styles.root} />;
}
