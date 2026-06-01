import { KmFlex, KmSpin } from "@components";
import type { FlexProps } from "antd";
import { type CSSProperties, useEffect, useState } from "react";

const relStyle: CSSProperties = { position: "relative", zIndex: 999 };
const absStyle: CSSProperties = { position: "absolute", inset: 0, minHeight: 50, background: "rgba(255,255,255,.7)" };
const style = { height: "100%" };
function FC({
  spinning,
  relative,
  delay,
  ...props
}: FlexProps & { delay?: boolean; relative?: boolean; spinning: boolean }) {
  const delaySpinning = useDelayLoading(spinning);
  const abs = (
    <div style={absStyle}>
      <KmFlex justify="center" align="center" style={style} {...props}>
        <KmSpin spinning={spinning} />
      </KmFlex>
    </div>
  );
  if (delay ? !spinning || !delaySpinning : !spinning) return null;
  if (relative === false) {
    return abs;
  }
  return <div style={relStyle}>{abs}</div>;
}

export default FC;

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
