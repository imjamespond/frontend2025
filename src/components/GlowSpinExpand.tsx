import { useState, type CSSProperties, type PropsWithChildren } from "react";
import "./GlowSpinExpand.css";
import { KmInput } from "@components";
import { ConfigProvider, theme } from "antd";

function FC({ children }: PropsWithChildren) {
  return (
    <div className="gradient-spin">
      <div className="gradient-spin-expand"></div>
      <div className="plate-background-blur"></div>
      {children}
    </div>
  );
}

export default FC;

export function Test() {
  return (
    <ConfigProvider componentSize="large" theme={{ token: { borderRadiusLG: 24 } }}>
      <TestFC />
    </ConfigProvider>
  );
}

function TestFC() {
  const [mouseEnter] = useState(true);
  const { token } = theme.useToken();

  return (
    <div
      className={mouseEnter ? "gradient-spin-anim" : ""}
      // onMouseEnter={() => setMouseEnter(true)}
      // onMouseLeave={() => setMouseEnter(false)}
      style={
        {
          margin: "100px 300px" /* 长宽比不能太大 */,
          "--gradient-spin-border-radius": token.borderRadiusLG + "px",
          "--gradient-spin-time": "2s",
        } as CSSProperties
      }
    >
      <FC>
        <KmInput.TextArea
          rows={5}
          variant="borderless"
          style={{ zIndex: 0, backgroundColor: "transparent", resize: "none" }}
        />
      </FC>
    </div>
  );
}
