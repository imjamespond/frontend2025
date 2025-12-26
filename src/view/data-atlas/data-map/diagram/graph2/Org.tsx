import React from "react";
import { Node } from "@antv/x6";
import { CaretDownFilled, CaretUpFilled } from "@ant-design/icons";

import { Subject } from "rxjs";
import type { ResourceType } from "@/view/data-atlas/helper";
import { KmFlex } from "@components";
import classnames from "classnames";
import Tooltip from "@components/Tooltip";
import type { OrgStyle } from "../graph/types";

export const SearchSubject = new Subject<string>();
export const MatchedDirId = new Subject<string>();

export type NodeData = { dir: DataAtlas.HomePageMapItem; style: OrgStyle; resourceType: ResourceType };
interface Props /* extends WithStylesProps<stylesType> */ {
  node: Node;
}
interface State {
  expanded: boolean;
  matched: any[] | undefined;
  matchedDirId?: string /* rect: DOMRect | undefined */;
}

/**
 * 组织机构
 */
class OrgComponent extends React.PureComponent<Props, State> {
  $search;
  $matchedDirId;

  constructor(props: Props) {
    super(props);
    this.state = { expanded: false, matched: undefined };
    // 此处为x6的子组件, 传入属性非reactive?
    // 处理搜索事件
    this.$search = SearchSubject.subscribe((val) => {
      this.onSearch(val);
    });
    this.$matchedDirId = MatchedDirId.subscribe((val) => {
      this.onMatch(val);
    });
  }

  componentWillUnmount() {
    this.$search.unsubscribe();
    this.$matchedDirId.unsubscribe();
  }

  // shouldComponentUpdate(_nextProps: Readonly<any>, nextState: Readonly<State>) { // pure component not allowed
  // }

  componentDidMount() {
    const { node } = this.props;
    const { dir } = node.getData<NodeData>();
  }

  componentDidUpdate(_prevProps: Readonly<any>, prevState: Readonly<State>) {
    const { expanded } = this.state;
    if (prevState.expanded !== expanded) {
      this.resizeNode();
    }
  }

  onSearch(val: string) {
    const { node } = this.props;
    const { dir } = node.getData<NodeData>();
    if (!!val) {
      // console.debug(this.props.data?.category, val)
      const matched = dir.list?.filter((item: any) => {
        return (item.dirName as string)?.includes(val);
      });
      // console.debug(matched)
      this.setState((pre) => {
        if (!!matched && matched.length > 0) {
          // 有结果
          return { ...pre, matched, expanded: true };
        }
        return { ...pre, matched: undefined }; // 清空结果
      });
    } else {
      this.setState({ matched: undefined });
    }
  }

  onMatch(dirId: string) {
    const { node } = this.props;
    const { dir } = node.getData<NodeData>();
    if (!!dirId) {
      const matched = dir?.list?.some((item: any) => {
        return (item.dirId as string) === dirId;
      });
      this.setState((pre) => {
        if (matched) {
          return { ...pre, matchedDirId: dirId, expanded: true };
        }
        return { ...pre, matchedDirId: dirId };
      });
    }
  }

  hasMore = false;

  resizeNode() {
    const { expanded } = this.state;
    const { node } = this.props;
    const { dir, style } = node.getData<NodeData>();
    if (dir.unFold === true) {
      return;
    }
    if (expanded) {
      const boxHeight = style.size.boxMaxHeight < style.size.boxHeight ? style.size.boxHeight : style.size.boxMaxHeight;
      node?.resize(style.size.boxWidth, boxHeight + 20);
      node?.toFront();
    } else {
      node?.resize(style.size.boxWidth, style.size.boxHeight + 20);
    }

    // DataMapSubject.next({ type: DataMapActType.Layout, payload: { keepCurPos: true } });
  }

  render() {
    const { expanded, matched, matchedDirId } = this.state;
    const { node } = this.props;
    const { dir, style, resourceType } = node.getData<NodeData>();
    // const span = 24 / style.cols

    let items = undefined;
    let list = dir?.list ?? [];

    // 是否出现滚动条
    if (expanded) {
      items = list.map((item: any, i: number) => {
        return (
          <Item
            key={i}
            item={item}
            resourceType={resourceType}
            matched={matched}
            style={style}
            matchedDirId={matchedDirId}
          />
        );
      });
      this.hasMore &&
        items.push(
          <Col key={list.length} cols={style.cols}>
            <div className="more">
              <div onClick={() => this.setState({ expanded: false })}>
                <span>收起</span>
                <CaretUpFilled />
              </div>
            </div>
          </Col>
        );
    } else {
      const { unFold } = dir;
      const maxRows = unFold ? 999 : style.maxRows;
      const min = style.minRows * style.cols,
        max = maxRows * style.cols;
      let num = list.length > min ? min - 1 : list.length;
      if (unFold) {
        num = list.length > max ? max - 1 : list.length;
      }
      // 判断列表数目
      items = list.slice(0, num).map((item, i) => {
        return <Item key={i} item={item} resourceType={resourceType} style={style} matchedDirId={matchedDirId} />;
      });
      // 显示更多
      if (list.length > items.length) {
        this.hasMore = true;
        items.push(
          <Col key={items.length} cols={style.cols}>
            <div className="more">
              <div onClick={() => this.setState({ expanded: true })}>
                <span>更多</span>
                <CaretDownFilled />
              </div>
            </div>
          </Col>
        );
      }
    }

    const boxHeight = expanded
      ? style.size.boxMaxHeight < style.size.boxHeight
        ? style.size.boxHeight
        : style.size.boxMaxHeight
      : style.size.boxHeight;

    // 渲染, safari不支持svg中position relative!, 只能用fixed
    return (
      <div
        className={classnames(style.class, "__block__")}
        onClick={() => {
          node?.toFront();
        }}
      >
        {/* {boxHeight},{rows} */}
        <svg viewBox={`0 0 ${style.size.boxWidth} ${boxHeight}`} xmlns="http://www.w3.org/2000/svg" className={"svg"}>
          <rect
            width={style.size.boxWidth - 4}
            height={boxHeight - 4}
            x={2}
            y={2}
            rx={3}
            ry={3}
            style={{ fill: "#fff", strokeWidth: 1, stroke: style.color, strokeDasharray: "5, 2" }}
          />
        </svg>
        <div className={"title"}>
          <div>
            <span
              style={{ cursor: "pointer" }}
              onClick={() => {
                // ActionSubject.next({
                //   type: ActionType.ToGraph,
                //   payload: { label: style.label, dir: dir as unknown as DataAtlas.Dir, resourceType },
                // });
              }}
            >
              {dir.dirName}
            </span>
          </div>
        </div>
        <div className={"body"}>
          <Row className={classnames({ ["scoll"]: expanded })}>{items}</Row>
        </div>
      </div>
    );
  }
}

function Item({
  item,
  matchedDirId,
  style,
  resourceType,
}: {
  item: DataAtlas.Dir;
  matched?: any;
  matchedDirId?: string;
  style: OrgStyle;
  resourceType: ResourceType;
}) {
  const _matched = matchedDirId === item.dirId;
  const cols = style.cols;
  return (
    <Col cols={cols} className={classnames({ matched: _matched })}>
      <div
        onClick={() => {
          // ActionSubject.next({ type: ActionType.ToGraph, payload: { label: style.label, dir: item, resourceType } });
        }}
      >
        <Tooltip className="org-name" tip={item.dirName} />
        <div className="amount">({item.count})</div>
      </div>
    </Col>
  );
}

// const Organization = withOrgStyles(OrgComponent)

function Organization({ node }: { node: Node }) {
  // const { style } = node.getData<NodeData>();
  // useOrgStyles({ theme: { colorPrimary: style.color } }); // FIXME 每个node生成一个样式？

  return (
    <div className="__container __data_map">
      <OrgComponent node={node} />
    </div>
  );
}

export default Organization;

const Col: React.FC<React.PropsWithChildren<{ className?: string; cols: number }>> = ({
  children,
  cols,
  className,
}) => {
  const w = ((1 / cols) * 100).toFixed(2);
  const width = `${w}%`;
  const flex = `0 0 ${w}`;
  return (
    <div className={classnames("col", className)} style={{ width, flex }}>
      {children}
    </div>
  );
};

const Row: React.FC<React.PropsWithChildren<{ className: string }>> = ({ children, ...props }) => {
  return (
    <KmFlex style={{ flexFlow: "row wrap" }} {...props}>
      {children}
    </KmFlex>
  );
};
