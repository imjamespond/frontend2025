import React from "react";
import { Node } from "@antv/x6";
import { Row, Col } from "antd";
import { CaretDownFilled, CaretUpFilled } from "@ant-design/icons";
import classnames from "classnames";

import Tooltip from "@components/Tooltip";
import { useStyles } from "./styles";
import type { NodeData, Style } from "../graph/types";

export type OrgNodeData = {
  dirId: string;
  style: Style;
  onSelectDir?: ({
    data /* 当前点击目录 */,
    node /* 当前点击结点 */,
    pdata /* 当前层级所有目录 */,
  }: {
    data: DataAtlas.JsonNode;
    node: Node;
    pdata: DataAtlas.JsonNode;
  }) => void;
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
    let list: any[] = data?.children ?? [];
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
    const { dirId, style, item: data, onSelectDir } = node.getData<OrgNodeData>();
    const span = 24 / style.cols;

    let items = undefined;
    let list = data?.children ?? [];

    // 是否出现滚动条
    if (expanded) {
      items = list.map((item, i: number) => {
        return (
          <Item key={i} item={item} span={span} dirId={dirId} parent={data} node={node} onSelectDir={onSelectDir} />
        );
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
          </Col>
        );
    } else {
      const min = style.minRows * style.cols;
      let num = list.length > min ? min - 1 : list.length;
      // 判断列表数目
      items = list.slice(0, num).map((item, i: number) => {
        return (
          <Item key={i} item={item} span={span} dirId={dirId} parent={data} node={node} onSelectDir={onSelectDir} />
        );
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
          </Col>
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
          <Row gutter={[8, 8]} className={classnames({ ["scoll"]: expanded })}>
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
  parent: parent,
  node,
  onSelectDir,
}: {
  item: DataAtlas.JsonNode;
  span: any;
  dirId: string;
  parent: DataAtlas.JsonNode;
  node: Node;
  onSelectDir: OrgNodeData["onSelectDir"];
}) {
  const { nodeId, text, dataAssetAndSubDirCount } = item;
  const matched = dirId === nodeId;
  const msg = `${text}(${dataAssetAndSubDirCount})`;
  return (
    <Col span={span} className={classnames({ matched })}>
      <div
        onClick={() => {
          onSelectDir?.({ pdata: parent, node, data: item });
        }}
      >
        <Tooltip className="org-name" tip={msg} />
      </div>
    </Col>
  );
}

export default function ({ node }: { node: Node }) {
  const { styles } = useStyles();
  return <OrgComponent node={node} className={styles.root} />;
}
