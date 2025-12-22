import React from "react";
import { Popover, Radio, Space, Typography, type RadioGroupProps } from "antd";
import {
  CompressOutlined,
  OneToOneOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
  ApartmentOutlined,
  ReloadOutlined,
  FullscreenOutlined,
  FullscreenExitOutlined,
  DownloadOutlined,
  BlockOutlined,
} from "@ant-design/icons";
import { createGlobalStyle } from "antd-style";

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
  layoutTypeOpt?: RadioGroupProps & { title: string };
  extra?: React.ReactNode;
}

const CanvasHandler: React.FC<Props> = (props) => {
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
  } = props;

  return (
    <Style>
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
    </Style>
  );
};

export default CanvasHandler;

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
