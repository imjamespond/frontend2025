import { KmFlex, KmSpin } from "@components";
import type { FlexProps } from "antd";
import type { CSSProperties } from "react";

const relStyle: CSSProperties = { position: "relative", zIndex: 999 };
const absStyle: CSSProperties = { position: "absolute", inset: 0, minHeight: 50, background: "rgba(255,255,255,.7)" };
const style = { height: "100%" };
function FC({ spinning, relative, ...props }: FlexProps & { relative?: boolean; spinning: boolean }) {
  const abs = (
    <div style={absStyle}>
      <KmFlex justify="center" align="center" style={style} {...props}>
        <KmSpin spinning={spinning} />
      </KmFlex>
    </div>
  );
  if (!spinning) return null;
  if (relative === false) {
    return abs;
  }
  return <div style={relStyle}>{abs}</div>;
}

export default FC;
