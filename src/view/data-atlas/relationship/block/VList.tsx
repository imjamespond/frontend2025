import React, { useMemo, useRef } from "react";
import { ConfigProvider } from "antd";

import { BlockStyles } from "../styles/block";
import { rowHeight, useHelper } from "./helper";
import { Context, RowComponent } from "./RowComponent";
import { HoverEffectStyle } from "@components/HoverEffect";
import { KmEmpty } from "@components";
import { useVirtualList } from "ahooks";
import { createStyles } from "antd-style";
import { useXXL } from "@common/hooks/responsive";
import Loading from "@components/Loading";

const getHeight = (i: number, length: number) => (i === length - 1 ? 50 : rowHeight);
function FC() {
  const { styles } = useStyles();
  const { modelsData, modelsTotal, ref, isFetching, hasNextPage } = useHelper();
  const xxl = useXXL();
  const modelRows = useMemo(() => {
    const items = modelsData?.pages?.flatMap((page) => page) || [];

    const rows = [];
    const rowSize = xxl ? 6 : 4;
    for (let i = 0; i < items.length; i += rowSize) {
      rows.push(items.slice(i, i + rowSize));
    }

    hasNextPage && rows.push([]);

    return rows;
  }, [modelsData, hasNextPage, xxl]);

  const containerRef = useRef(null);
  const wrapperRef = useRef(null);
  const [list] = useVirtualList(modelRows, {
    containerTarget: containerRef,
    wrapperTarget: wrapperRef,
    overscan: 1,
    itemHeight: (i) => getHeight(i, modelRows.length),
  });

  return (
    <React.Fragment>
      {/* {JSON.stringify({})} */}
      <BlockStyles />
      <HoverEffectStyle />

      {modelsTotal === 0 && <KmEmpty />}
      <ConfigProvider
        theme={{
          components: {
            Card: {
              colorBgContainer: "transparent",
            },
          },
        }}
      >
        <Context.Provider value={{ ref: ref.current }}>
          <div ref={containerRef} className={styles.root}>
            <div ref={wrapperRef}>
              {list.map((item) => (
                <RowComponent key={item.index} row={item.data} xxl={xxl} />
              ))}
            </div>
            <Loading spinning={isFetching} relative={false} delay />
          </div>
        </Context.Provider>
      </ConfigProvider>
    </React.Fragment>
  );
}

export default FC;

export const useStyles = createStyles(() => ({
  root: {
    height: "100%",
    overflow: "auto",
    "& .km-col": {
      minHeight: rowHeight,
    },
    "& .km-col > div": {
      height: "100%",
      paddingBottom: 10,
      boxSizing: "border-box",
    },
    "& .km-col .km-card": {
      height: "100%",
      fontSize: "14px",
    },
    "& .km-row": {
      marginRight: "0px !important",
    },
  },
}));
