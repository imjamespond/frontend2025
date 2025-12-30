import { createGlobalStyle } from "antd-style";
import { type CSSProperties, type PropsWithChildren } from "react";

/**
 * HoverEffect 容器
 */
export function HoverEffectWrapper({ opacity, children }: PropsWithChildren<CSSProperties & { opacity?: number }>) {
  return (
    <div className="__hover-effect" style={{ "--before-opacity": opacity } as React.CSSProperties}>
      {children}
    </div>
  );
}

/**
 * HoverEffect 全局样式
 */
export const HoverEffectStyle = createGlobalStyle`
      .__hover-effect > :first-child {
        position: relative;
        overflow: hidden;
      }
      .__hover-effect > :first-child::before {
        content: '';
        position: absolute;
        inset: 0;
        z-index: -1;
        background-color: ${(p) => p.theme.colorPrimaryHover};
        transition: all 0.3s cubic-bezier(0.05, 0, 0, 1);
        transition-property: opacity, transform;
        opacity: 0;
        transform: scale(0.9);
        will-change: opacity, transform;
        border-radius: inherit;
      }
      .__hover-effect > :first-child:hover::before  {
        transform: scale(1);
        opacity: var(--before-opacity, 1);
      }
`;
