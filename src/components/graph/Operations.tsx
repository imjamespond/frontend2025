import {
  ApartmentOutlined,
  BlockOutlined,
  CompressOutlined,
  DownloadOutlined,
  FileExcelOutlined,
  FullscreenExitOutlined,
  FullscreenOutlined,
  OneToOneOutlined,
  ReloadOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
} from "@ant-design/icons";
import { Popover, Radio, type RadioGroupProps, Space, Typography } from "antd";
import { createGlobalStyle } from "antd-style";
import React, { Fragment } from "react";

interface Props {
  className?: string;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onFitContent?: () => void;
  onRealContent?: () => void;
  onSetOverhead?: () => void;
  onLayout?: () => void;
  onReload?: () => void;
  onFullScreen?: () => void;
  onFullScreenExit?: () => void;
  onExportImage?: () => void;
  onSelectLevel?: (lv: number) => void;
  onExportExcel?: () => void;
  layoutTypeOpt?: RadioGroupProps & { title: string };
  extra?: React.ReactNode;
}

const FC: React.FC<Props> = (props) => {
  const {
    layoutTypeOpt,
    extra,
    onZoomIn,
    onZoomOut,
    onFitContent,
    onRealContent,
    onLayout,
    onReload,
    onFullScreen,
    onFullScreenExit,
    onExportImage,
    onSelectLevel,
    onExportExcel,
  } = props;

  return (
    <Fragment>
      <Style />
      <ul className={"__operations"}>
        <Popover content="放大" placement="left">
          <li onClick={onZoomIn} className={"item"}>
            <ZoomInOutlined />
          </li>
        </Popover>
        <Popover content="缩小" placement="left">
          <li onClick={onZoomOut} className={"item"}>
            <ZoomOutOutlined />
          </li>
        </Popover>
        <Popover content="实际尺寸" placement="left">
          <li onClick={onRealContent} className={"item"}>
            <OneToOneOutlined />
          </li>
        </Popover>
        <Popover content="适应画布" placement="left">
          <li onClick={onFitContent} className={"item"}>
            <CompressOutlined />
          </li>
        </Popover>
        {!!onLayout && (
          <Popover content="自动布局" placement="left">
            <li onClick={onLayout} className={"item"}>
              <ApartmentOutlined />
            </li>
          </Popover>
        )}
        {!!onReload && (
          <Popover content="重置" placement="left">
            <li onClick={onReload} className={"item"}>
              <ReloadOutlined />
            </li>
          </Popover>
        )}

        {!!onFullScreen && (
          <Popover content="全屏" placement="left">
            <li onClick={onFullScreen} className={"item"}>
              <FullscreenOutlined />
            </li>
          </Popover>
        )}
        {!!onFullScreenExit && (
          <Popover content="退出全屏" placement="left">
            <li onClick={onFullScreenExit} className={"item"}>
              <FullscreenExitOutlined />
            </li>
          </Popover>
        )}
        {!!onExportImage && (
          <Popover content="导出图片" placement="left">
            <li onClick={onExportImage} className={"item"}>
              <DownloadOutlined />
            </li>
          </Popover>
        )}

        {!!onExportExcel && (
          <Popover content="导出Excel" placement="left">
            <li onClick={onExportExcel} className={"item"}>
              <FileExcelOutlined />
            </li>
          </Popover>
        )}
        {!!onSelectLevel && (
          <Popover
            content={
              <Space direction="vertical">
                <Typography.Text>显示层级:</Typography.Text>
                <Radio.Group
                  defaultValue={2}
                  onChange={(e) => {
                    onSelectLevel(e.target.value);
                  }}
                >
                  <Space direction="vertical">
                    {[30, 2, 3, 4, 5].map((opt, i) => {
                      return (
                        <Radio key={i} value={opt}>
                          {opt === 30 ? "全部" : opt}
                        </Radio>
                      );
                    })}
                  </Space>
                </Radio.Group>
              </Space>
            }
            placement="leftBottom"
          >
            <li className={"item"}>
              <BlockOutlined />
            </li>
          </Popover>
        )}

        {!!layoutTypeOpt &&
          (() => {
            const { title, options, ...props } = layoutTypeOpt;
            return (
              <Popover
                content={
                  <React.Fragment>
                    <Typography.Text>{title}:</Typography.Text>
                    <div className="mt-1" />
                    <Radio.Group {...props}>
                      <Space direction="vertical">
                        {options?.map((item, i) => {
                          if (typeof item === "object") {
                            return (
                              <Radio key={i} value={item.value}>
                                {item.label}
                              </Radio>
                            );
                          }
                          return <Radio key={i}> unknown </Radio>;
                        })}
                      </Space>
                    </Radio.Group>
                  </React.Fragment>
                }
                placement="leftBottom"
              >
                <li className={"item"}>
                  <BlockOutlined />
                </li>
              </Popover>
            );
          })()}
        {extra}
      </ul>
    </Fragment>
  );
};

export default FC;

const Style = createGlobalStyle({
  ".__operations": {
    position: "absolute",
    bottom: "15px",
    right: "15px",
    zIndex: 99,
    width: "32px",
    margin: "0",
    padding: "3px 0",
    color: "rgba(0, 0, 0, 0.45)",
    fontSize: "16px",
    listStyleType: "none",
    backgroundColor: "#fff",
    border: "1px solid rgba(0, 0, 0, 0.04)",
    borderRadius: "3px",
    boxShadow: "0 0 20px rgba(0, 0, 0, 0.01)",
    "& .item": {
      textAlign: "center",
      cursor: "pointer",
      "&:hover": { color: "#000", backgroundColor: "#e0e0e0" },
    },
  },
});
