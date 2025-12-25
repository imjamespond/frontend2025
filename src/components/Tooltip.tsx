import React, { type CSSProperties, Fragment, type HTMLAttributes, useEffect, useRef, useState } from "react";
import { Tooltip as AntTooltip, type TooltipProps } from "antd";
import type { TooltipPlacement } from "antd/es/tooltip";


const _defaultStyle: CSSProperties = {
  overflow: "hidden",
  whiteSpace: "nowrap",
  textOverflow: "ellipsis",
  // backgroundColor: "red"
}

export default function FC ({ tip, defaultStyle, style, placement, children, ...rest }: {
  tip: React.ReactNode,
  defaultStyle?: boolean,
  placement?: TooltipPlacement,
  disabled?: boolean
} & HTMLAttributes<Misc.Any>) {
  const wrapper = useRef<HTMLDivElement>(null);
  const text = useRef<HTMLSpanElement>(null);
  const [toolTip, setToolTip] = useState(false);

  useEffect(() => {

    const wrapperRect = wrapper.current!.getBoundingClientRect()
    const textRect = text.current!.getBoundingClientRect();

    if (wrapperRect.width < textRect.width) {
      setToolTip(true);
    }
  }, [tip]);

  const content = (
    <div
      ref={wrapper}
      style={(defaultStyle !== false) ? { ..._defaultStyle, ...style } : style}
      {...rest}
    >
      <span ref={text}>{children ?? tip}</span>
    </div>
  );

  if (toolTip) {
    return <AntTooltip title={tip} placement={placement} color="#fff" overlayInnerStyle={{ color: '#000' }} >{content}</AntTooltip>;
  } else {
    return content;
  }
}

export const Tooltip = ({ children, disabled, ...props }: TooltipProps & { disabled?: boolean }) => {
  if (disabled) {
    return <Fragment>{children}</Fragment>;
  }
  return <AntTooltip {...props} color="#fff" overlayInnerStyle={{ color: '#000' }}>
    <span>
      {children}
    </span>
  </AntTooltip>
}