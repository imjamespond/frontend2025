import { useRef, type CSSProperties, type PropsWithChildren } from "react";
import "./GlowSpinExpand.css";
import { KmInput } from "@components";
import { ConfigProvider, theme } from "antd";

function FC({ children }: PropsWithChildren) {
  return (
    <div className="gradient-spin">
      <div className="gradient-spin-blur">
        <div></div>
      </div>
      <div className="gradient-spin-expand">
        <div></div>
      </div>
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
  const { token } = theme.useToken();
  const containerRef = useRef<HTMLDivElement>(null);
  return (
    <div
      className={"gradient-spin-anim"}
      ref={containerRef}
      onMouseEnter={() => {
        const container = containerRef.current;
        if (!container) return;

        // 1. 获取该元素上正在运行的所有动画（如入场动画）并停止它们
        container.getAnimations({ subtree: true }).forEach((anim) => anim.cancel());

        // 2. 针对两个不同的类执行 mouseEnter 动画
        const targets = container.querySelectorAll(".gradient-spin-blur > div");

        targets.forEach((el) => {
          // 启动线性无限动画
          el.animate(keyframes, options);
        });
      }}
      onMouseLeave={() => {
        const container = containerRef.current;
        if (!container) return;

        // 鼠标移出时停止动画并恢复初始状态（或触发退场动画）
        container.getAnimations({ subtree: true }).forEach((anim) => anim.cancel());
      }}
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

// 定义基于原关键帧修改后的线性无限动画
const keyframes = [
  { opacity: 0, transform: "rotate(360deg)", offset: 0 },
  { opacity: 1, offset: 0.2 },
  { opacity: 1, offset: 0.8 },
  { opacity: 0, transform: "rotate(720deg)", offset: 1 },
];
const options = {
  duration: 5000, // 对应 0.9s
  easing: "linear", // 变为线性
  iterations: Infinity, // 无限循环
  pseudoElement: "::before", // 关键：指定作用于伪元素
};
