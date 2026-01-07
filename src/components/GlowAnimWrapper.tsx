import { type CSSProperties, type PropsWithChildren } from "react";
import "./GlowAnimWrapper.css";
import { KmButton } from "@components";
import { ConfigProvider, theme } from "antd";

function FC({ children }: PropsWithChildren) {
  return (
    /* Add .glow-animation-wrapper class to the parent element */
    <div className="glow-container">
      <div className="gradient-and-mask-wrapper outer-glow">
        <div className="gradient"></div>
        {/* <div className="mask"></div> */}
      </div>
      {children}
    </div>
  );
}

export default FC;

export function Test() {
  return (
    <ConfigProvider componentSize="large" theme={{ token: { borderRadiusLG: 16 } }}>
      <TestFC />
    </ConfigProvider>
  );
}

function TestFC() {
  const { token } = theme.useToken();

  return (
    <div
      className="glow-animation-wrapper"
      style={
        {
          margin: 200,
          // "--glow-container-wrapper-scale": 12,
          "--glow-container-border-radius": token.borderRadiusLG + "px",
        } as CSSProperties
      }
    >
      <FC>
        <KmButton type="text" style={{ backgroundColor: "#fff" }}>
          TestTestTest
        </KmButton>
      </FC>
    </div>
  );
}
