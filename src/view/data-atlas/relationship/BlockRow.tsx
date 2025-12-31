import { getOpenAssetsDetail } from "@service";
import { KmButton, KmCard, KmFlex } from "@components";
import { Col, Row, Typography } from "antd";

import icon1 from "./assets/block/2/icon/1.png";
import icon2 from "./assets/block/2/icon/2.png";
import icon3 from "./assets/block/2/icon/3.png";
import icon4 from "./assets/block/2/icon/4.png";

import { dbTypes } from "./helper";
import { HoverEffectWrapper } from "@components/HoverEffect";
import { getIcon, levels, Model } from "./block";
import React, { Fragment, useEffect, useState } from "react";
import { useRootDir, useSetRelBySearchResult } from "../context";

export const Context = React.createContext<{ ref: { loadMore: () => void } } | null>(null);

export function RowComponent({ row, xxl }: { xxl?: boolean; row: DataAtlas.TableModelInfo[] }) {
  const rootDir = useRootDir();
  const setRelBySearchResult = useSetRelBySearchResult();
  const [detail, set_detail] = useState<string>();
  const span = xxl ? 4 : 6;

  if (row.length === 0) {
    return <LoadMore />;
  }

  return (
    <Fragment>
      <Row gutter={[10, 0]}>
        {row.map((item, i: number) => {
          // 表
          if (item.dbType === dbTypes.table) {
            let safety = "";
            if (typeof item.safetyLevel === "number" && item.safetyLevel > 0) {
              // const index =  i % levels.length
              const index = item.safetyLevel - 1; // 1 ~ 4级
              if (index < levels.length) safety = `url(${levels[index]}) right 5px top 5px / 75px 80px no-repeat,`;
            }

            const title = item.cnName ? item.cnName : "暂无";
            return (
              <Col key={i} span={span}>
                <HoverEffectWrapper>
                  <KmCard
                    className={item.dbType}
                    variant="borderless"
                    onClick={() => {
                      item.id && set_detail(getOpenAssetsDetail(item.id, item.dirId));
                    }}
                    styles={{
                      body: {
                        height: "100%",
                        background: `${safety} url(${icon2}) right -5px bottom 0px / 20% no-repeat`,
                      },
                    }}
                  >
                    <div className="__title__">{title}</div>
                    <div className="__desc__">
                      <Typography.Text type="secondary">{item.enName}</Typography.Text>
                    </div>
                    <div className="__bottom__">
                      <div className="__icons__">
                        {getIcon(item.performance, "表现形式", icon3)}
                        {getIcon(item.dataType, "数据类型", icon4)}
                      </div>
                    </div>
                  </KmCard>
                </HoverEffectWrapper>
              </Col>
            );
          }
          // 目录
          return (
            <Col key={i} span={span}>
              <HoverEffectWrapper>
                <KmCard
                  className={item.dbType}
                  onClick={() => {
                    if (rootDir) {
                      setRelBySearchResult({ dirId: item.dirId, resourceType: rootDir.resourceType });
                    }
                  }}
                  styles={{
                    body: {
                      height: "100%",
                      background: `url(${icon1}) right bottom no-repeat`,
                      backgroundSize: "128px 96px",
                    },
                  }}
                >
                  <div>
                    <span className="__dirName__">{item.dirName}</span>
                    <span className="__count__">（{/* item.subDirCount +  */ item.tableModelCount}）</span>
                  </div>
                  <div>
                    <span>{item.dirDesc}</span>
                  </div>
                </KmCard>
              </HoverEffectWrapper>
            </Col>
          );
        })}
      </Row>
      <Model url={detail} open={!!detail} onClose={() => set_detail(undefined)} />
    </Fragment>
  );
}

export function LoadMore() {
  const ctx = React.useContext(Context);
  const ref = React.useRef({ ctx, mounted: false });
  useEffect(() => {
    if (!ref.current.mounted) {
      ref.current.ctx?.ref.loadMore();
    }
    ref.current.mounted = true;
  }, []);
  return (
    <KmFlex justify="center">
      <KmButton
        type="text"
        onClick={() => {
          ctx?.ref.loadMore();
        }}
      >
        加载更多
      </KmButton>
    </KmFlex>
  );
}
