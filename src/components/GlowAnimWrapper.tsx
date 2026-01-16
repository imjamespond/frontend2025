import { Fragment, type CSSProperties, type PropsWithChildren } from "react";
import "./GlowAnimWrapper.css";
import { KmButton, KmCard } from "@components";
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
    <div style={{ margin: 100 }}>
      <div
        className="glow-animation-wrapper"
        style={
          {
            "--glow-container-wrapper-scale": 2, // 只能实现width>height的情况
            "--glow-container-border-radius": token.borderRadiusLG + "px",
          } as CSSProperties
        }
      >
        <FC>
          <KmCard style={{ height: 200 }}>TestTestTest</KmCard>
        </FC>
      </div>
      <hr />
      <div
        className="glow-animation-wrapper"
        style={
          {
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
    </div>
  );
}
