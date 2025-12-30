import React, { useState } from "react";
import { getOpenAssetsDetail } from "@service";
import { KmButton, KmCard, KmDrawer, KmEmpty, KmSpin } from "@components";
import { Col, ConfigProvider, Row, Tooltip, Typography } from "antd";

import lv1 from "./assets/block/2/1.png";
import lv2 from "./assets/block/2/2.png";
import lv3 from "./assets/block/2/3.png";
import lv4 from "./assets/block/2/4.png";
import lv5 from "./assets/block/2/5.png";
import icon1 from "./assets/block/2/icon/1.png";
import icon2 from "./assets/block/2/icon/2.png";
import icon3 from "./assets/block/2/icon/3.png";
import icon4 from "./assets/block/2/icon/4.png";

import { useRootDir, useSetRelBySearchResult } from "../context";
import { useStyles, BlockStyles } from "./styles/block";
import { dbTypes } from "./helper";
import { useIntersection } from "@common/hooks/intersection";
import { useHelper } from "./blockHelper";
import { EllipsisOutlined } from "@ant-design/icons";
import Loading from "@components/Loading";
import { HoverEffectStyle, HoverEffectWrapper } from "@components/HoverEffect";

const levels = [lv1, lv2, lv3, lv4, lv5];

function FC() {
  const { styles } = useStyles();

  const rootDir = useRootDir();
  const setRelBySearchResult = useSetRelBySearchResult();

  const [modelsData, modelsTotal, callback, ref, hasNextPage, isFetching] = useHelper();

  const { rootRef, targetRef } = useIntersection({
    callback,
    options: { rootMargin: "0px 0px 20px" },
  });

  const [detail, set_detail] = useState<string>();

  return (
    <React.Fragment>
      <BlockStyles />
      <HoverEffectStyle />
      <div className={styles.root} ref={rootRef}>
        <div>
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
            <Row gutter={[10, 10]}>
              {modelsData?.pages?.map((models) => {
                return models.map((item, i: number) => {
                  // 表
                  if (item.dbType === dbTypes.table) {
                    let safety = "";
                    if (typeof item.safetyLevel === "number" && item.safetyLevel > 0) {
                      // const index =  i % levels.length
                      const index = item.safetyLevel - 1; // 1 ~ 4级
                      if (index < levels.length)
                        safety = `url(${levels[index]}) right 5px top 5px / 75px 80px no-repeat,`;
                    }

                    const title = item.cnName ? item.cnName : "暂无";
                    return (
                      <Col key={i} xs={24} md={8} xxl={4} xl={6}>
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
                    <Col key={i} xs={24} md={8} xxl={4} xl={6}>
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
                });
              })}
            </Row>
          </ConfigProvider>
          <div className="km-p3 text-center" ref={targetRef}>
            {hasNextPage && (
              <KmButton
                type="text"
                icon={<EllipsisOutlined />}
                onClick={() => {
                  ref.current.fetchNextPage();
                }}
              >
                加载更多
              </KmButton>
            )}
          </div>
        </div>
        <Loading spinning={isFetching} relative={false} />
      </div>

      <Model url={detail} open={!!detail} onClose={() => set_detail(undefined)} />

      {/* <Debug data={{ status, modelsTotal, isFetching, getTableModelKey }} /> */}
    </React.Fragment>
  );
}

export default FC;

function getIcon(msg: string, title: string, icon: string) {
  return (
    <Tooltip placement="top" title={`${title}: ${!!msg ? msg : "暂无"}`}>
      <img src={icon} style={!!msg ? undefined : { filter: "grayscale(1)", opacity: 0.7 }} />
    </Tooltip>
  );
}

function Model({ open, url, onClose }: { open: boolean; url?: string; onClose: Function }) {
  return (
    <React.Fragment>
      <KmDrawer open={open} width={"90vw"} onClose={() => onClose()}>
        <iframe src={url} style={{ width: "100%", height: "calc(100vh - 110px)", border: "none" }} />
      </KmDrawer>
    </React.Fragment>
  );
}
