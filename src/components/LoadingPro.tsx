import { KmFlex, KmSkeleton, KmSpin } from "@components";
import type { FlexProps, SkeletonProps, SpinProps } from "antd";
import React, { type CSSProperties, type PropsWithChildren, useEffect, useState } from "react";

/**
 * 撑满父级元素
 * @description wrapper postion must set to relative
 * @returns
 */
export function FullHWLoading({
  blur,
  loading,
  type = "spin",
  spinProps,
  skeletonProps,
  children,
}: React.PropsWithChildren<{
  blur?: boolean;
  loading?: boolean;
  type?: "spin" | "skeleton" | "none";
  spinProps?: SpinProps;
  skeletonProps?: SkeletonProps;
}>) {
  if (!loading) return null;
  return (
    <KmFlex
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backdropFilter: blur === false ? undefined : "blur(2px)",
        backgroundColor: "rgba(250,250,250,0.75)",
      }}
      justify={"center"}
      align="center"
    >
      {type === "skeleton" && <KmSkeleton active style={{ margin: 10 }} {...skeletonProps} />}
      {type === "spin" && <KmSpin {...spinProps} />}
      {type === "none" && children}
    </KmFlex>
  );
}

const RelStyle: CSSProperties = { position: "relative", zIndex: 999 };
const AbsStyle: CSSProperties = { position: "absolute", inset: 0, minHeight: 50, background: "rgba(255,255,255,.7)" };
const style = { height: "100%" };
export function DelayLoading({
  tip,
  spinning,
  relative,
  delay,
  relStyle,
  absStyle,
  children,
  ...props
}: PropsWithChildren<
  FlexProps & {
    tip?: SpinProps["tip"];
    delay?: boolean;
    relative?: boolean;
    spinning: boolean;
    relStyle?: typeof RelStyle;
    absStyle?: typeof AbsStyle;
  }
>) {
  const delaySpinning = useDelayLoading(spinning);
  const abs = (
    <div style={absStyle || AbsStyle}>
      <KmFlex justify="center" align="center" style={style} {...props}>
        <KmSpin spinning={spinning} tip={tip}>
          {children}
        </KmSpin>
      </KmFlex>
    </div>
  );
  if (delay ? !spinning || !delaySpinning : !spinning) return null;
  if (relative === false) {
    return abs;
  }
  return <div style={relStyle || RelStyle}>{abs}</div>;
}

function useDelayLoading(loading: boolean, delay = 200) {
  const [delayedLoading, setDelayedLoading] = useState(false);

  useEffect(() => {
    let timer: number;

    if (loading) {
      // 如果进入加载状态，开启定时器
      timer = setTimeout(() => {
        setDelayedLoading(true);
      }, delay);
    } else {
      // 如果加载结束，立即取消定时器并隐藏 Loading
      setDelayedLoading(false);
    }

    return () => clearTimeout(timer); // 清理副作用
  }, [loading, delay]);

  return delayedLoading;
}
