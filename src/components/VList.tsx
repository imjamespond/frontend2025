import { kmDebug } from "@common/misc";
import { useSize } from "ahooks";
import React, { Fragment, type HTMLAttributes, useCallback, useEffect, useMemo, useRef, useState } from "react";

interface Props<T = unknown> {
  rowHeight: number;
  rows?: T[];
  renderRow: (item: T) => React.ReactElement;
}

export default function FC<T>({
  className,
  height,
  scrollTop,
  rowHeight,
  rows,
  onWheel,
  renderRow,
}: Props<T> & {
  height: number;
  scrollTop: number;
} & HTMLAttributes<HTMLDivElement>) {
  const _rows = useMemo(() => {
    const start = Math.floor(scrollTop / rowHeight),
      end = Math.ceil((scrollTop + height) / rowHeight);
    // kmDebug(d => d('VList', scrollTop, start, end))

    if (rows && start > -1 && end > -1) {
      return rows?.slice(start, end);
    }
  }, [rows, scrollTop, rowHeight, height]);

  const marginTop = -(scrollTop % rowHeight);

  return (
    <div className={className} style={{ height, overflow: "hidden" }} onWheel={onWheel}>
      <div style={{ marginTop }}>{_rows?.map((item) => renderRow(item))}</div>
    </div>
  );
}

export function AutoHeightVList<T>({
  className,
  rowHeight,
  rows,
  renderRow,
  onScrollTop,
}: Props<T> & { onScrollTop: (val: number) => void } & HTMLAttributes<HTMLDivElement>) {
  const scrollbarRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const size = useSize(listRef);
  const height = size?.height ?? 0;
  const [scrollTop, setScrollTop] = useState(0);
  const _rows = useMemo(() => {
    const start = Math.floor(scrollTop / rowHeight);
    const end = Math.ceil((scrollTop + height) / rowHeight);
    // kmDebug(d => d('VList', scrollTop, start, end))

    if (rows && start > -1 && end > -1) {
      return rows.slice(start, end);
    }
  }, [rows, scrollTop, rowHeight, height]);

  const marginTop = -(scrollTop % rowHeight);

  const onScroll = useCallback<Required<React.DOMAttributes<HTMLDivElement>>["onScroll"]>((e) => {
    kmDebug("onScroll", e.currentTarget.scrollTop);
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  const onWheel = useCallback<Required<React.DOMAttributes<HTMLDivElement>>["onWheel"]>((e) => {
    let scrollTop = stateRef.current.scrollTop + e.deltaY;
    if (scrollTop < 0) {
      scrollTop = 0;
    } else {
      const { listHeight, height } = stateRef.current;
      if (listHeight > height) {
        const max = listHeight - height;
        if (scrollTop > max) {
          scrollTop = max;
        }
      } else {
        scrollTop = 0;
      }
    }

    setScrollTop(scrollTop);

    if (scrollbarRef.current) {
      scrollbarRef.current.scrollTop = scrollTop;
    }
  }, []);

  useEffect(() => {
    if (scrollbarRef.current) {
      // sync scrollTop to scrollbar
      stateRef.current.onScrollTop(scrollTop);
    }
  }, [scrollTop]);

  const listHeight = (rows?.length ?? 0) * rowHeight;
  const stateRef = useRef({ listHeight, height, scrollTop, onScrollTop });
  stateRef.current.listHeight = listHeight;
  stateRef.current.height = height;
  stateRef.current.scrollTop = scrollTop;

  // 上级flex stretch, height 自动100%
  return (
    <Fragment>
      <div className="__vlist" /* style={{ display: "flex", flex: 1, overflow: "hidden" }} */>
        <div ref={listRef} className={className} onWheel={onWheel}>
          <div style={{ marginTop }}>{_rows?.map((item) => renderRow(item))}</div>
        </div>
        {/* 滚动条 */}
        <div className="__scrollbar" onScroll={onScroll} ref={scrollbarRef}>
          <div style={{ width: 1, height: listHeight }} />
        </div>
      </div>
    </Fragment>
  );
}
