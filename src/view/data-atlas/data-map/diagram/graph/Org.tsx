import { CaretDownFilled, CaretUpFilled } from "@ant-design/icons";
import type { Graph, Node } from "@antv/x6";
import { KmFlex } from "@components";
import Tooltip from "@components/Tooltip";
import classnames from "classnames";
import React from "react";
import { Subject } from "rxjs";
import { setRelView } from "@/view/data-atlas/context";
import type { ResourceType } from "@/view/data-atlas/helper";
import { LayoutSubject } from "../context";
import type { OrgStyle } from "../graph/types";
import type { NodeData } from "./types";
import { getOrgNodeData } from "./utils";

export const SearchSubject = new Subject<string>();
export const MatchedDirId = new Subject<string>();

interface Props {
  node: Node;
  graph: Graph;
}
interface State {
  expanded: boolean;
}

/**
 * 组织机构
 */
export default class OrgComponent extends React.Component<Props, State> {
  // $search;
  // $matchedDirId;

  get node() {
    return this.props.node;
  }
  get nodeData() {
    return getOrgNodeData(this.node);
  }

  constructor(props: Props) {
    super(props);
    this.state = { expanded: false };
    // 此处为x6的子组件, 传入属性非reactive?
    // 处理搜索事件
    // this.$search = SearchSubject.subscribe((val) => {
    //   this.onSearch(val);
    // });
    // this.$matchedDirId = MatchedDirId.subscribe((val) => {
    //   this.onMatch(val);
    // });
  }

  // shouldComponentUpdate(nextProps: Readonly<Props>, nextState: Readonly<State>) { // pure component not allowed
  //   return false;
  // }

  // componentDidMount() {
  //   const { node } = this.props;
  // }

  componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>) {
    if (prevProps.node.data !== this.node.data) {
      if (this.state.expanded !== this.nodeData.expanded) {
        this.setState({ expanded: this.nodeData.expanded === true });
      }
    } else if (prevState.expanded !== this.state.expanded) {
      this.resizeNode();
    }
  }

  // onSearch(val: string) {
  //   const { node } = this.props;
  //   const { dir } = node.getData<NodeData>();
  //   if (!!val) {
  //     // console.debug(this.props.data?.category, val)
  //     const matched = dir.list?.filter((item: any) => {
  //       return (item.dirName as string)?.includes(val);
  //     });
  //     // console.debug(matched)
  //     this.setState((pre) => {
  //       if (!!matched && matched.length > 0) {
  //         // 有结果
  //         return { ...pre, matched, expanded: true };
  //       }
  //       return { ...pre, matched: undefined }; // 清空结果
  //     });
  //   } else {
  //     this.setState({ matched: undefined });
  //   }
  // }

  hasMore = false;

  resizeNode() {
    const { expanded } = this.nodeData;
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

    LayoutSubject.next({ keepCurPos: true });
  }

  render() {
    const { matchedDirId, dir, style, resourceType } = this.nodeData;
    const { node } = this.props;
    const { expanded } = this.state;
    // const span = 24 / style.cols

    let items;
    const list = dir?.list ?? [];

    // 是否出现滚动条
    if (expanded) {
      items = list.map((item, i: number) => {
        return (
          <Item key={i.toString()} item={item} resourceType={resourceType} style={style} matchedDirId={matchedDirId} />
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
          </Col>,
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
          </Col>,
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
      <div className="__container __data_map">
        <div
          className={classnames(style.class, "__block__")}
          onClick={() => {
            node?.toFront();
          }}
        >
          {/* {boxHeight},{rows} */}
          <svg viewBox={`0 0 ${style.size.boxWidth} ${boxHeight}`} xmlns="http://www.w3.org/2000/svg" className={"svg"}>
            <title> </title>
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
                  setRelView()({ label: style.label, dir: dir as unknown as DataAtlas.Dir, resourceType });
                }}
              >
                {dir.dirName}
              </span>
            </div>
          </div>
          <div className={"body"}>
            <Row className={classnames({ scoll: expanded })}>{items}</Row>
          </div>
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
          setRelView()({ label: style.label, dir: item, resourceType });
        }}
      >
        <Tooltip className="org-name" tip={item.dirName} />
        <div className="amount">({item.count})</div>
      </div>
    </Col>
  );
}

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
